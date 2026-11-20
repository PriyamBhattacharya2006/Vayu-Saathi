import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { buildCleanAirSystemPrompt } from './src/prompts/systemPrompt.ts';
import { buildSampleAirQuality } from './src/data/personas.ts';
import { getAQILevelId, pm25ToUsAqi } from './src/utils/aqi.ts';
import type {
  AirQualityData,
  CommunityPledge,
  DailyOutlook,
  Language,
  UserProfile,
} from './src/types/cleanAir.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const communityPledges: CommunityPledge[] = [
  {
    id: 'seed-rwa-1',
    groupName: 'Mayur Vihar Phase 1 RWA',
    city: 'New Delhi',
    households: 84,
    actions: ['No-burning patrol for night guards', 'Wet sweeping in lanes', 'School carpool roster'],
    estimatedWeeklyCo2Kg: 1120,
    createdAt: '2026-11-12T09:30:00.000Z',
  },
  {
    id: 'seed-rwa-2',
    groupName: 'Sector 45 Block C Collective',
    city: 'Gurugram',
    households: 42,
    actions: ['Leaf composting pit', 'Midday outdoor recess check', 'Carpool Wednesday'],
    estimatedWeeklyCo2Kg: 540,
    createdAt: '2026-11-14T11:15:00.000Z',
  },
  {
    id: 'seed-school-3',
    groupName: 'Greenway Primary Parents Circle',
    city: 'Noida',
    households: 36,
    actions: ['Engine-off at school gate', 'DIY classroom box-fan filters'],
    estimatedWeeklyCo2Kg: 430,
    createdAt: '2026-11-15T14:20:00.000Z',
  },
];

async function fetchWithTimeout(url: string, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchLiveAqiFromOpenMeteo(params: {
  city: string;
  lat?: number;
  lon?: number;
}): Promise<AirQualityData> {
  let { city, lat, lon } = params;
  let resolvedName = city;

  if (lat === undefined || lon === undefined) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;
    const geoRes = await fetchWithTimeout(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`Geocoding status ${geoRes.status}`);
    }
    const geoJson = (await geoRes.json()) as {
      results?: { name: string; country?: string; latitude: number; longitude: number }[];
    };
    const first = geoJson.results?.[0];
    if (!first) {
      throw new Error(`City not found: ${city}`);
    }
    lat = first.latitude;
    lon = first.longitude;
    resolvedName = first.country ? `${first.name}, ${first.country}` : first.name;
  }

  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone&hourly=pm2_5,us_aqi&timezone=auto&forecast_days=4`;
  const aqRes = await fetchWithTimeout(aqUrl);
  if (!aqRes.ok) {
    throw new Error(`Open-Meteo AQ status ${aqRes.status}`);
  }
  const aqJson = (await aqRes.json()) as {
    current?: {
      us_aqi?: number;
      pm2_5?: number;
      pm10?: number;
      nitrogen_dioxide?: number;
      ozone?: number;
      time?: string;
    };
    hourly?: {
      time: string[];
      pm2_5: (number | null)[];
      us_aqi: (number | null)[];
    };
  };

  const cur = aqJson.current;
  if (!cur) {
    throw new Error('Missing current air quality data');
  }

  const pm25 = Math.round((cur.pm2_5 ?? 0) * 10) / 10;
  const pm10 = Math.round((cur.pm10 ?? 0) * 10) / 10;
  const no2 = Math.round((cur.nitrogen_dioxide ?? 0) * 10) / 10;
  const o3 = Math.round((cur.ozone ?? 0) * 10) / 10;
  const usAqi = Math.max(1, Math.round(cur.us_aqi ?? pm25ToUsAqi(pm25)));

  let mainPollutant: AirQualityData['mainPollutant'] = 'PM2.5';
  if (pm10 > pm25 * 2.5 && pm10 > 80) mainPollutant = 'PM10';
  else if (no2 > 90 && pm25 < 30) mainPollutant = 'NO2';
  else if (o3 > 110 && pm25 < 30) mainPollutant = 'O3';

  // Build 3-day outlook from hourly forecast
  const times = aqJson.hourly?.time ?? [];
  const hourlyAqi = aqJson.hourly?.us_aqi ?? [];
  const hourlyPm25 = aqJson.hourly?.pm2_5 ?? [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const byDate = new Map<string, { aqis: number[]; pm25s: number[]; middayBestHour?: number; middayBestVal: number }>();

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const datePart = t.slice(0, 10);
    if (datePart <= todayStr) continue;
    const hour = Number(t.slice(11, 13));
    const aqiVal = hourlyAqi[i] ?? (hourlyPm25[i] != null ? pm25ToUsAqi(hourlyPm25[i] as number) : null);
    const pmVal = hourlyPm25[i];
    if (aqiVal == null) continue;

    if (!byDate.has(datePart)) {
      byDate.set(datePart, { aqis: [], pm25s: [], middayBestVal: Number.POSITIVE_INFINITY });
    }
    const bucket = byDate.get(datePart)!;
    bucket.aqis.push(aqiVal);
    if (pmVal != null) bucket.pm25s.push(pmVal);
    if (hour >= 11 && hour <= 16 && aqiVal < bucket.middayBestVal) {
      bucket.middayBestVal = aqiVal;
      bucket.middayBestHour = hour;
    }
  }

  const dayLabels = ['Tomorrow', 'Day +2', 'Day +3'];
  const outlook: DailyOutlook[] = Array.from(byDate.entries())
    .slice(0, 3)
    .map(([date, info], idx) => {
      const avgAqi = Math.round(
        info.aqis.reduce((sum, n) => sum + n, 0) / Math.max(1, info.aqis.length)
      );
      const avgPm25 = Math.round(
        info.pm25s.reduce((sum, n) => sum + n, 0) / Math.max(1, info.pm25s.length)
      );
      const bestStart = info.middayBestHour ?? 13;
      const bestEnd = Math.min(17, bestStart + 2);
      return {
        date,
        dayLabel: dayLabels[idx] || date,
        aqi: avgAqi,
        pm25: avgPm25,
        levelId: getAQILevelId(avgAqi),
        bestWindow: `${String(bestStart).padStart(2, '0')}:00 – ${String(bestEnd).padStart(2, '0')}:00`,
      };
    });

  return {
    city: resolvedName,
    aqi: usAqi,
    mainPollutant,
    pm25,
    pm10,
    no2,
    source: 'Open-Meteo Air Quality (Copernicus CAMS)',
    isLive: true,
    lastUpdated: new Date().toISOString(),
    outlook: outlook.length > 0 ? outlook : buildSampleAirQuality(resolvedName, usAqi).outlook,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. Live AQI endpoint with graceful fallback
  app.get('/api/aqi', async (req, res) => {
    const city = typeof req.query.city === 'string' && req.query.city.trim() ? req.query.city.trim() : 'New Delhi';
    const lat = typeof req.query.lat === 'string' && req.query.lat ? Number(req.query.lat) : undefined;
    const lon = typeof req.query.lon === 'string' && req.query.lon ? Number(req.query.lon) : undefined;

    try {
      const liveData = await fetchLiveAqiFromOpenMeteo({
        city,
        lat: Number.isFinite(lat) ? lat : undefined,
        lon: Number.isFinite(lon) ? lon : undefined,
      });
      res.json(liveData);
    } catch (error) {
      console.warn('AQI live fetch failed, returning fallback sample data:', error);
      const fallback = buildSampleAirQuality(city);
      res.json(fallback);
    }
  });

  // 2. Server-side Gemini AI Assistant chat endpoint
  app.post('/api/assistant/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error: 'MISSING_API_KEY',
        message:
          'GEMINI_API_KEY is not configured yet. Please set GEMINI_API_KEY in Settings > Secrets to enable AI chat.',
      });
      return;
    }

    const {
      messages,
      profile,
      airQuality,
      language = 'en',
    } = req.body as {
      messages?: { role: 'user' | 'assistant'; content: string }[];
      profile?: UserProfile;
      airQuality?: AirQualityData;
      language?: Language;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0 || !profile || !airQuality) {
      res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'Please provide messages, household profile, and current air quality.',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = buildCleanAirSystemPrompt({
        language,
        profile,
        airQuality,
      });

      const contents = messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        throw new Error('Empty response from Gemini model');
      }

      res.json({ reply });
    } catch (err: unknown) {
      console.error('Gemini assistant error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unable to reach AI assistant right now.';
      res.status(502).json({
        error: 'AI_UPSTREAM_ERROR',
        message: errMsg,
      });
    }
  });

  // 3. Community Pledges API
  app.get('/api/community/pledges', (_req, res) => {
    const totalHouseholds = communityPledges.reduce((s, p) => s + p.households, 0);
    const totalWeeklyCo2Kg = communityPledges.reduce((s, p) => s + p.estimatedWeeklyCo2Kg, 0);
    res.json({
      pledges: communityPledges,
      totalHouseholds,
      totalWeeklyCo2Kg,
    });
  });

  app.post('/api/community/pledges', (req, res) => {
    const { groupName, city, households, actions } = req.body as {
      groupName?: string;
      city?: string;
      households?: number;
      actions?: string[];
    };

    if (!groupName?.trim() || !city?.trim() || !Array.isArray(actions) || actions.length === 0) {
      res.status(400).json({ error: 'Group name, city, and at least one action are required.' });
      return;
    }

    const safeHouseholds = Math.max(1, Math.min(5000, Math.round(Number(households) || 1)));
    // Rough estimate: ~11 kg CO2e/week per participating household combining transit + no burning + cooking lid
    const estimatedWeeklyCo2Kg = Math.round(safeHouseholds * actions.length * 3.8);

    const created: CommunityPledge = {
      id: `pledge-${Date.now()}`,
      groupName: groupName.trim().slice(0, 80),
      city: city.trim().slice(0, 60),
      households: safeHouseholds,
      actions: actions.slice(0, 8),
      estimatedWeeklyCo2Kg,
      createdAt: new Date().toISOString(),
    };

    communityPledges.unshift(created);
    const totalHouseholds = communityPledges.reduce((s, p) => s + p.households, 0);
    const totalWeeklyCo2Kg = communityPledges.reduce((s, p) => s + p.estimatedWeeklyCo2Kg, 0);

    res.status(201).json({
      pledge: created,
      pledges: communityPledges,
      totalHouseholds,
      totalWeeklyCo2Kg,
    });
  });

  const httpServer = http.createServer(app);

  // Mount Vite middleware in dev, or serve dist/ in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.get('/@vite/client', async (_req, res, next) => {
      try {
        const result = await vite.transformRequest('/@vite/client');
        if (!result) return next();
        const patched = result.code
          .replace('transport.connect(createHMRHandler(handleMessage));', '/* HMR disabled */')
          .replace('setupForwardConsoleHandler(transport, forwardConsole);', '/* console forward disabled */')
          .replace('throw new SendBeforeConnectError("send was called before connect");', 'return;')
          .replace('throw new SendBeforeConnectError("invoke was called before connect");', 'return;')
          .replace('wsTransport.send(data);', '/* HMR disabled */');
        res.type('application/javascript').send(patched);
      } catch (err) {
        next(err);
      }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(indexPath);
      });
    } else {
      app.get('*', (_req, res) => {
        res
          .status(503)
          .send(
            '<h1>Build Required</h1><p>Run <code>npm run build</code> before starting in production mode, or run <code>npm run dev</code> for development.</p>'
          );
      });
    }
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`CleanAir Companion server listening on http://localhost:${PORT}`);
  });
}

startServer();
