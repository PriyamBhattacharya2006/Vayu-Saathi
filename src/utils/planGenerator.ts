import type { AirQualityData, PlanAction, UserProfile } from '../types/cleanAir.ts';

export function generateDailyPlan(
  profile: UserProfile,
  airQuality: AirQualityData
): PlanAction[] {
  const aqi = airQuality.aqi;
  const hasVulnerable =
    profile.children > 0 || profile.elderly > 0 || profile.conditions.length > 0;
  const isSevere = aqi > 200;
  const isUnhealthy = aqi > 150;
  const isModerateOrWorse = aqi > 100;

  const actions: PlanAction[] = [];

  // 1. Morning ventilation & damp cleaning
  if (isModerateOrWorse) {
    actions.push({
      id: 'morning-seal',
      timeOfDay: 'morning',
      category: 'ventilation',
      title:
        profile.windowSeal === 'drafty'
          ? 'Keep windows shut & press rolled damp towels along gaps'
          : 'Keep windows & balcony doors shut until midday sun rises',
      titleHi:
        profile.windowSeal === 'drafty'
          ? 'खिड़कियां बंद रखें और दरारों पर गीले तौलिये/कपड़े लगाएं'
          : 'दोपहर की धूप निकलने तक खिड़कियां और बालकनी के दरवाजे बंद रखें',
      detail:
        'Winter morning temperature inversions trap smog near street level between 6:00 and 10:30 AM. Wait for warmer midday air before brief ventilation.',
      detailHi:
        'सर्दियों की सुबह ठंडी हवा धुंध को जमीन के पास रोक लेती है (सुबह 6 से 10:30 बजे तक)। हल्की धूप निकलने के बाद ही खिड़की खोलें।',
      priority: 'high',
      impact: {
        healthEffect:
          'Estimated 25–40% lower morning indoor PM2.5 spike compared with leaving drafty windows open.',
        healthEffectHi:
          'दरारें खुली रखने की तुलना में सुबह घर के अंदर PM2.5 में अनुमानित 25–40% कम बढ़ोतरी।',
        emissionEffect: 'Zero energy used (0 kg CO2e); avoids extra purifier or heater run time.',
        emissionEffectHi: 'शून्य ऊर्जा उपयोग (0 kg CO2e); प्यूरीफायर या हीटर का अतिरिक्त लोड भी बचाता है।',
        communityEffect:
          'If 100 households delay heating/draft losses, peak morning grid load drops slightly.',
        communityEffectHi:
          'यदि 100 परिवार सुबह की ठंडी हवा रोकें तो हीटर बिजली की पीक मांग कम होती है।',
        assumptions:
          'Assumes typical 1.5–2x outdoor-to-indoor air exchange reduction when gaps are blocked during morning inversion hours.',
        assumptionsHi:
          'अनुमान है कि सुबह की धुंध के समय दरारें ढकने से बाहर की हवा का अंदर आना 1.5–2 गुना कम होता है।',
      },
    });
  } else {
    actions.push({
      id: 'morning-fresh',
      timeOfDay: 'morning',
      category: 'ventilation',
      title: 'Cross-ventilate for 20 minutes after sunrise',
      titleHi: 'सूर्योदय के बाद 20 मिनट के लिए क्रॉस-वेंटिलेशन करें',
      detail:
        'Air quality is relatively favourable right now. Brief cross-ventilation clears overnight indoor CO2 without bringing in heavy smog.',
      detailHi:
        'अभी हवा की गुणवत्ता अपेक्षाकृत ठीक है। 20 मिनट खिड़कियां खोलने से रात भर की बंद हवा और CO2 बाहर निकल जाती है।',
      priority: 'recommended',
      impact: {
        healthEffect: 'Lowers indoor CO2 buildup by ~30–45% for sharper morning alertness.',
        healthEffectHi: 'घर के अंदर जमा CO2 को लगभग 30–45% कम करता है।',
        emissionEffect: '0 kg CO2e (passive natural ventilation).',
        emissionEffectHi: '0 kg CO2e (प्राकृतिक वेंटिलेशन)।',
        communityEffect: 'Healthy indoor homes reduce reliance on daytime mechanical cooling/fans.',
        communityEffectHi: 'प्राकृतिक हवा से दिन में पंखे/मशीनों की जरूरत घटती है।',
        assumptions: 'Assumes outdoor AQI remains <= 100 during the 20-minute window.',
        assumptionsHi: 'मान लिया गया है कि 20 मिनट की अवधि में बाहर का AQI 100 या उससे कम रहता है।',
      },
    });
  }

  // 2. Morning commute & mask guidance
  if (!profile.workFromHome && profile.commuteMode !== 'wfh') {
    const isActiveOutdoor =
      profile.commuteMode === 'walk' ||
      profile.commuteMode === 'cycle' ||
      profile.commuteMode === 'two-wheeler';

    actions.push({
      id: 'morning-commute',
      timeOfDay: 'morning',
      category: isModerateOrWorse && isActiveOutdoor ? 'mask' : 'commute',
      title:
        isModerateOrWorse && isActiveOutdoor
          ? 'Wear a snug N95/FFP2 mask & switch to metro/bus if possible'
          : profile.commuteMode === 'car'
            ? 'Consider carpooling or metro today; use cabin air recirculation in traffic'
            : 'Keep your low-emission commute (metro/bus/walk) and pace exertion',
      titleHi:
        isModerateOrWorse && isActiveOutdoor
          ? 'फिट होने वाला N95/FFP2 मास्क पहनें और संभव हो तो मेट्रो/बस चुनें'
          : profile.commuteMode === 'car'
            ? 'आज कारपूल या मेट्रो पर विचार करें; ट्रैफिक में कार का रीसर्क्युलेशन मोड ऑन रखें'
            : 'अपनी कम-उत्सर्जन यात्रा (मेट्रो/बस/पैदल) जारी रखें और तेज दौड़-भाग से बचें',
      detail: isUnhealthy
        ? 'Cloth and surgical masks leave side gaps that let fine PM2.5 through. A snug N95/FFP2 cuts inhaled particles meaningfully on busy roads.'
        : 'Taking public transit or carpooling cuts road tailpipe exhaust right outside schools and footpaths.',
      detailHi: isUnhealthy
        ? 'कपड़े और सर्जिकल मास्क के किनारों से महीन PM2.5 कण अंदर चले जाते हैं। सही फिटिंग वाला N95/FFP2 मास्क धुंध में बेहतर सुरक्षा देता है।'
        : 'मेट्रो, बस या कारपूल अपनाने से सड़कों और स्कूलों के आसपास धुआं कम होता है।',
      priority: isUnhealthy ? 'high' : 'recommended',
      impact: {
        healthEffect: isModerateOrWorse
          ? 'Estimated 65–85% reduction in inhaled PM2.5 when wearing a well-fitted N95 vs no mask.'
          : 'Light steady travel avoids deep mouth-breathing of roadside exhaust.',
        healthEffectHi: isModerateOrWorse
          ? 'बिना मास्क के मुकाबले सही फिट N95 पहनने से सांस में जाने वाले PM2.5 में अनुमानित 65–85% कमी।'
          : 'संतुलित गति से चलने पर सड़क का धुआं कम अंदर जाता है।',
        emissionEffect:
          profile.commuteMode === 'car'
            ? 'Switching one 15 km round-trip from solo car to metro/carpool avoids ~2.4–3.2 kg CO2e/day (~12–16 kg/week).'
            : 'Using transit, walking, or cycling saves ~10–15 kg CO2e per week vs a solo petrol car.',
        emissionEffectHi:
          profile.commuteMode === 'car'
            ? 'अकेले कार के बजाय मेट्रो/कारपूल से 15 किमी यात्रा करने पर रोज लगभग 2.4–3.2 kg CO2e बचता है।'
            : 'पेट्रोल कार की जगह बस/मेट्रो/साइकिल से हर सप्ताह लगभग 10–15 kg CO2e की बचत होती है।',
        communityEffect:
          'If 100 commuters shift from solo cars/two-wheelers to shared transit or carpools, ~1.2 tonnes CO2e and ~350 g road exhaust PM are avoided weekly.',
        communityEffectHi:
          'यदि 100 यात्री अकेले वाहन की जगह साझा परिवहन चुनें तो हर सप्ताह ~1.2 टन CO2e और ~350 ग्राम सड़क का धुआं कम होता है।',
        assumptions:
          'Estimate assumes 15 km daily round trip, ~180 g CO2/km average petrol car vs ~35 g CO2/passenger-km metro/bus.',
        assumptionsHi:
          'अनुमान 15 किमी दैनिक यात्रा पर आधारित है (पेट्रोल कार ~180g CO2/किमी बनाम मेट्रो/बस ~35g/यात्री-किमी)।',
      },
    });
  }

  // 3. Afternoon best window + damp mopping + cooking
  actions.push({
    id: 'afternoon-window',
    timeOfDay: 'afternoon',
    category: 'outdoor',
    title: isSevere
      ? 'Keep children & elderly indoors; 15-min calm courtyard break only around 2:00 PM'
      : isUnhealthy
        ? 'Limit outdoor play for kids/elderly to 1:30–3:30 PM; avoid vigorous running'
        : 'Best outdoor & window-airing slot: 1:00–4:00 PM',
    titleHi: isSevere
      ? 'बच्चों और बुजुर्गों को घर के अंदर रखें; दोपहर ~2 बजे केवल 15 मिनट की शांत धूप लें'
      : isUnhealthy
        ? 'बच्चों/बुजुर्गों के लिए बाहर का समय दोपहर 1:30–3:30 बजे तक सीमित रखें; तेज दौड़ न लगाएं'
        : 'बाहर निकलने और खिड़की खोलने का सबसे अच्छा समय: दोपहर 1:00–4:00 बजे',
    detail: hasVulnerable
      ? 'Sunlight warms the lower atmosphere in the afternoon, dispersing smog slightly. Avoid early mornings and dusk for children with asthma or elderly family members.'
      : 'Afternoon mixing usually brings the day’s lowest PM2.5 concentration—use this short window to air out rooms safely.',
    detailHi: hasVulnerable
      ? 'दोपहर की धूप से हवा थोड़ी ऊपर उठती है और धुंध कुछ कम होती है। अस्थमा वाले बच्चों व बुजुर्गों को सुबह-शाम बाहर न भेजें।'
      : 'दोपहर में धुंध अक्सर दिन के सबसे निचले स्तर पर होती है—इसी समय घर की हवा बदलें।',
    priority: isUnhealthy || hasVulnerable ? 'high' : 'recommended',
    impact: {
      healthEffect:
        'Shifting outdoor time from 7 AM to 2 PM can lower peak PM2.5 exposure by ~20–35% on winter inversion days.',
      healthEffectHi:
        'सुबह 7 बजे के बजाय दोपहर 2 बजे बाहर जाने से धुंध के संपर्क में अनुमानित 20–35% कमी आ सकती है।',
      emissionEffect: '0 kg CO2e (schedule shift only, zero cost).',
      emissionEffectHi: '0 kg CO2e (केवल समय बदलाव, बिना किसी खर्च के)।',
      communityEffect:
        'If 100 families & local schools shift sports/recess to midday, hundreds of children breathe cleaner air without indoor AC.',
      communityEffectHi:
        'यदि 100 परिवार और स्कूल खेल का समय दोपहर रखें, तो सैकड़ों बच्चे बिना अतिरिक्त बिजली खर्च के सुरक्षित रहते हैं।',
      assumptions:
        'Winter urban diurnal curves typically peak 7–9 AM and 8–11 PM, dipping 15–35% between 1 PM and 4 PM.',
      assumptionsHi:
        'सर्दियों के शहरों में प्रदूषण सुबह 7–9 और रात 8–11 बजे अधिक तथा दोपहर 1–4 बजे 15–35% कम रहता है।',
    },
  });

  actions.push({
    id: 'afternoon-cleaning',
    timeOfDay: 'afternoon',
    category: 'indoor',
    title: 'Damp mop floors & wipe surfaces instead of dry sweeping',
    titleHi: 'सूखी झाड़ू लगाने के बजाय गीला पोंछा लगाएं और सतह पोंछें',
    detail:
      'Dry brooms kick settled fine dust and soot back into breathing height (especially for toddlers and people sitting on floor mats).',
    detailHi:
      'सूखी झाड़ू से फर्श पर बैठी महीन धूल फिर से हवा में उड़ती है, जो बच्चों और जमीन पर बैठने वालों के फेफड़ों में जाती है।',
    priority: 'recommended',
    impact: {
      healthEffect:
        'Estimated 15–25% reduction in resuspended indoor coarse and fine dust particles.',
      healthEffectHi:
        'घर के अंदर दोबारा उड़ने वाली धूल में अनुमानित 15–25% की कमी।',
      emissionEffect: '0 kg CO2e (replaces dry broom or high-wattage vacuuming).',
      emissionEffectHi: '0 kg CO2e (वैक्यूम क्लीनर की बिजली भी बचाता है)।',
      communityEffect:
        'If 100 apartments & RWA sweepers wet-mop or sprinkle water before sweeping, neighbourhood dust plumes drop visibly.',
      communityEffectHi:
        'यदि 100 घर और सोसायटी सफाईकर्मी पानी छिड़ककर या गीला पोंछा लगाएं तो कॉलोनी की धूल काफी घटती है।',
      assumptions:
        'Assumes daily floor cleaning in a 700–1,000 sq ft urban home; avoids ~20–40 min vacuuming/week if replacing vacuum.',
      assumptionsHi:
        '700–1,000 वर्ग फुट के घर में दैनिक सफाई पर आधारित अनुमान।',
    },
  });

  // 4. Evening cooking, filtration & no burning
  actions.push({
    id: 'evening-cooking',
    timeOfDay: 'evening',
    category: 'cooking',
    title:
      profile.cookingFuel === 'biomass'
        ? 'Cook with lids on, vent smoke outward, and transition toward LPG/induction when feasible'
        : profile.hasExhaustFan
          ? 'Run kitchen exhaust fan & cover pots during evening cooking'
          : 'Cover pots with lids & crack kitchen window slightly while frying/tadka',
    titleHi:
      profile.cookingFuel === 'biomass'
        ? 'ढक्कन लगाकर खाना पकाएं, धुआं बाहर निकालें और संभव हो तो LPG/इंडक्शन अपनाएं'
        : profile.hasExhaustFan
          ? 'शाम को खाना बनाते समय एग्जॉस्ट फैन चलाएं और बर्तन ढककर पकाएं'
          : 'तड़का या तलते समय बर्तन ढकें और रसोई की खिड़की थोड़ी खोलें',
    detail:
      'High-heat frying and unvented gas/biomass flames create large indoor PM2.5 and NO2 spikes right before bedtime. Covering pots also cuts fuel use.',
    detailHi:
      'तेज आंच पर तलने और गैस/चूल्हे से सोने से ठीक पहले घर में PM2.5 और NO2 तेजी से बढ़ता है। बर्तन ढकने से ईंधन भी बचता है।',
    priority: 'high',
    impact: {
      healthEffect:
        'Estimated 30–55% lower peak kitchen PM2.5 and NO2 during dinner prep.',
      healthEffectHi:
        'रात का खाना बनाते समय रसोई के PM2.5 और NO2 शिखर में अनुमानित 30–55% की कमी।',
      emissionEffect:
        'Covering pots saves ~15–20% cooking energy (~1.2–1.8 kg CO2e/week for LPG; much more if displacing biomass).',
      emissionEffectHi:
        'बर्तन ढककर पकाने से ~15–20% ईंधन बचता है (LPG पर लगभग 1.2–1.8 kg CO2e/सप्ताह बचत)।',
      communityEffect:
        'If 100 families cover pots and vent cleanly, ~150 kg CO2e and significant indoor respiratory flare-ups are avoided weekly.',
      communityEffectHi:
        'यदि 100 परिवार ऐसा करें तो हर सप्ताह ~150 kg CO2e और घर के भीतर धुएं की समस्या कम होती है।',
      assumptions:
        'Assumes 45 min/day active cooking; lid retention reduces boil/simmer energy by ~15–20%.',
      assumptionsHi:
        'रोजाना 45 मिनट खाना पकाने और ढक्कन से 15–20% ऊर्जा बचत के आधार पर अनुमान।',
    },
  });

  actions.push({
    id: 'evening-sleep',
    timeOfDay: 'evening',
    category: 'indoor',
    title: profile.hasAirPurifier
      ? 'Run HEPA purifier in the main bedroom with doors/windows closed; skip incense'
      : profile.budget === 'flexible' || profile.budget === 'low'
        ? 'Use a quiet fan + MERV-13 DIY filter or sealed bedroom routine; skip incense & coils'
        : 'Create one "clean-air bedroom" (doors closed, damp towel seal, zero smoke/incense)',
    titleHi: profile.hasAirPurifier
      ? 'मुख्य बेडरूम के दरवाजे-खिड़की बंद रखकर HEPA प्यूरीफायर चलाएं; अगरबत्ती न जलाएं'
      : profile.budget === 'flexible' || profile.budget === 'low'
        ? 'बेडरूम सील रखें, DIY बॉक्स-फैन फ़िल्टर का उपयोग करें और अगरबत्ती/कॉइल से बचें'
        : 'एक "साफ हवा वाला बेडरूम" बनाएं (दरवाजे बंद, दरारों पर कपड़ा, घर में कोई धुआं नहीं)',
    detail:
      'People spend ~8 hours sleeping. Protecting even one bedroom and avoiding evening incense, scented candles, or mosquito coils keeps night-time lung recovery safer.',
    detailHi:
      'हम ~8 घंटे सोते हैं। रात को केवल एक बेडरूम को साफ रखने और अगरबत्ती, मोमबत्ती या मच्छर कॉइल से बचने से फेफड़ों को आराम मिलता है।',
    priority: isUnhealthy || hasVulnerable ? 'high' : 'recommended',
    impact: {
      healthEffect: profile.hasAirPurifier
        ? 'A properly sized HEPA purifier in a closed room typically cuts indoor PM2.5 by ~50–75%.'
        : 'Skipping one incense stick or coil prevents a localized PM2.5 burst of 100–300+ µg/m³ indoors.',
      healthEffectHi: profile.hasAirPurifier
        ? 'बंद कमरे में सही क्षमता का HEPA प्यूरीफायर PM2.5 को लगभग 50–75% कम कर सकता है।'
        : 'एक अगरबत्ती या कॉइल न जलाने से कमरे के अंदर PM2.5 में 100–300+ µg/m³ का अचानक उछाल रुकता है।',
      emissionEffect:
        'Skipping daily incense/coils & avoiding open heating saves ~0.5–1.5 kg CO2e/week; running purifier on medium uses ~0.3–0.6 kWh/night.',
      emissionEffectHi:
        'रोजाना अगरबत्ती/कॉइल से बचने से ~0.5–1.5 kg CO2e/सप्ताह की बचत होती है।',
      communityEffect:
        'If 100 households stop evening mosquito coils and waste burning, shared stairwell & courtyard air stays noticeably fresher overnight.',
      communityEffectHi:
        'यदि 100 परिवार शाम को कॉइल और कचरा जलाना बंद करें, तो पूरी इमारत और आंगन की हवा रात भर साफ रहती है।',
      assumptions:
        'Assumes 120–160 sq ft closed bedroom, 8 hrs sleep; HEPA effectiveness drops sharply if doors/windows stay ajar.',
      assumptionsHi:
        '120–160 वर्ग फुट के बंद बेडरूम और 8 घंटे की नींद के आधार पर अनुमान।',
    },
  });

  return actions;
}
