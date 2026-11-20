# CleanAir Companion

A responsive, PWA-ready web application helping urban families, vulnerable households, and Resident Welfare Associations (RWAs) navigate severe winter smog and urban air pollution with practical, low-emission daily routines.

## Architecture & Page Flow

1. **5-Step Quick Onboarding (Skippable, Local-First)**
   - Location (city search + optional browser geolocation)
   - Household composition & respiratory sensitivities (children, elderly, asthma, allergies, heart conditions, pregnancy)
   - Home environment (apartment/house, window seal quality, exhaust fan, HEPA purifier, heating fuel)
   - Commute & cooking profile
   - Budget level (Free only / Low cost / Flexible)
   - Quick-load **Example Personas** to explore scenarios immediately without typing.

2. **5 Core Views (Responsive Top Bar on Desktop, Ergonomic Bottom Tab Bar on Mobile)**
   - **Today**: Current US AQI, main pollutant, accessible colour + icon risk scale, data source & timestamp, manual AQI override, 3-day outlook, **Personalised Daily Plan** (Morning / Afternoon / Evening), and **Weekly Habit Progress** streak tracker.
   - **Indoor Hacks**: Ranked by cost & effectiveness (damp mopping, no indoor incense/coils, kitchen exhaust, window draft sealing, DIY MERV-13 box-fan filter, commercial HEPA guidance, and honest science on houseplants).
   - **Alternatives**: Low-emission cooking, heating, transport, and zero-burning waste swaps with realistic trade-offs and cost ranges.
   - **Ask AI**: Server-backed Gemini assistant (`gemini-4-hydrogen`) tailored to the user's location, AQI, household vulnerabilities, budget, and selected language (English / Hindi), with clear medical disclaimers.
   - **Community**: Shareable & printable one-page Neighbourhood Action Plan for RWAs/schools/offices, checklist for event organisers, and a live Community Impact Counter.

## Folder Structure

- `server.ts` — Express server mounting Vite in dev, live Open-Meteo AQI proxy (`/api/aqi`), Gemini AI route (`/api/assistant/chat`), and community pledges API (`/api/community/pledges`)
- `src/prompts/systemPrompt.ts` — Separate, editable AI system prompt and context builder
- `src/data/personas.ts` — Example user personas, fallback sample AQI generator, and weekly habits
- `src/data/indoorAndAlternatives.ts` — Indoor IAQ hacks and sustainable alternatives with impact assumptions
- `src/utils/planGenerator.ts` — Deterministic, offline-ready personalised daily plan generator
- `src/utils/aqi.ts` — US AQI thresholds, colour-blind-safe visual tokens, and PM2.5 conversion
- `src/i18n/translations.ts` — English (`en`) and Hindi (`hi`) UI dictionary
- `src/components/` — Modular UI components (`DashboardView`, `IndoorHacksView`, `AlternativesView`, `AssistantView`, `CommunityView`, `OnboardingWizard`, `ImpactExplainer`, `PWAInstallButton`, `OfflineIndicator`)

## Setup & Environment Variables

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (see `.env.example`):
   - `GEMINI_API_KEY`: Required for server-side `/api/assistant/chat`
   - `WAQI_API_TOKEN` *(optional)*: App works out of the box using the free, keyless Open-Meteo Air Quality API and falls back cleanly to sample winter smog data offline.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Example User Personas & Test Scenarios

- **Sharma Family (New Delhi, Tight Budget)**: Apartment with drafty windows, 7-year-old child with asthma, elderly grandparent, free tips only, high AQI (~312). Tests priority indoor protection, damp towel gap sealing, midday-only ventilation, and avoiding commercial purifier upsells.
- **Meera & Elderly Mother (Gurugram)**: Work-from-home caregiver with allergies & heart sensitivity, owns one bedroom HEPA purifier, moderate budget, AQI ~245. Tests clean-air bedroom sanctuary guidance and kitchen exhaust usage.
- **Rohan (Bengaluru, Cyclist)**: Independent house, 6 km cycle commute, induction cooking, flexible budget, AQI ~108. Tests mask guidance on moderate smog days and sustaining low-emission commuting.

## Recommended Next Steps

1. **Hyperlocal Sensor Integration**: Connect municipal CPCB/PurpleAir/OpenAQ station feeds and optional indoor PM2.5 monitor webhooks for room-level alerts.
2. **School & RWA Partnerships**: Offer verified RWA/school admin badges, morning WhatsApp/SMS smog-window digests, and printable Hindi/regional-language lobby posters.
3. **Regional Language Expansion**: Extend `src/i18n/translations.ts` to Punjabi, Bengali, Marathi, and Urdu for wider winter-smog corridor coverage.
4. **Optional Encrypted Cloud Sync**: Let users opt into a lightweight passkey/magic-link account to sync streaks and RWA group pledges across family phones.
