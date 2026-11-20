import type { IndoorHack, SustainableAlternative } from '../types/cleanAir.ts';

export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: 'damp-mopping',
    title: 'Damp mopping instead of dry sweeping',
    titleHi: 'सूखी झाड़ू के बजाय गीला पोंछा',
    summary:
      'Wet mopping traps settled PM2.5, soot, and allergens instead of kicking them back into the air.',
    summaryHi:
      'गीला पोंछा फर्श पर जमी महीन धूल और कालिख को हवा में उड़ने से रोकता है।',
    costTier: 'free',
    costEstimate: 'Free (uses existing mop & water)',
    costEstimateHi: 'मुफ्त (मौजूदा पोंछे और पानी से)',
    effectiveness: 'high',
    honestCaveat:
      'Stops dust resuspension, though it does not filter airborne smoke entering through open windows.',
    honestCaveatHi:
      'यह जमी हुई धूल को उड़ने से रोकता है, लेकिन खुली खिड़की से आने वाले धुएं को साफ नहीं करता।',
    steps: [
      'Use a damp microfiber or cotton mop daily on bedrooms and play mats.',
      'Wipe windowsills and fan blades once a week with a wet cloth.',
      'Wash the mop head outdoors or rinse thoroughly after each room.',
    ],
    stepsHi: [
      'बेडरूम और बच्चों के खेलने की जगह पर रोज़ गीला सूती/माइक्रोफाइबर पोंछा लगाएं।',
      'सप्ताह में एक बार खिड़की की चौखट और पंखे के ब्लेड गीले कपड़े से पोंछें।',
      'हर कमरे के बाद पोंछे को अच्छी तरह धोएं।',
    ],
    impact: {
      healthEffect: 'Estimated 15–25% less resuspended fine and coarse dust at child breathing height.',
      healthEffectHi: 'बच्चों के सांस लेने की ऊंचाई पर उड़ने वाली धूल में अनुमानित 15–25% कमी।',
      emissionEffect: '0 kg CO2e/week (replaces electric vacuuming if used).',
      emissionEffectHi: '0 kg CO2e/सप्ताह (वैक्यूम की बिजली भी बचाता है)।',
      communityEffect:
        'If 100 apartments and RWA staff wet-mop corridors, shared dust clouds drop dramatically.',
      communityEffectHi:
        'यदि 100 घर और सोसायटी कर्मचारी गीली सफाई करें, तो पूरे परिसर की धूल काफी कम हो जाती है।',
      assumptions: 'Rough estimate for daily sweeping vs wet mopping in a 2-bedroom urban flat.',
      assumptionsHi: '2-बेडरूम शहरी फ्लैट में दैनिक सूखी झाड़ू बनाम गीले पोंछे का अनुमान।',
    },
  },
  {
    id: 'no-indoor-smoke',
    title: 'Pause incense, candles & mosquito coils on bad-AQI days',
    titleHi: 'खराब AQI वाले दिनों में अगरबत्ती, मोमबत्ती और मच्छर कॉइल बंद रखें',
    summary:
      'Burning one stick of incense or a mosquito coil in a closed winter room can spike PM2.5 higher than outdoor smog.',
    summaryHi:
      'सर्दियों के बंद कमरे में एक अगरबत्ती या कॉइल जलाने से PM2.5 बाहर की धुंध से भी ज्यादा बढ़ सकता है।',
    costTier: 'free',
    costEstimate: 'Free (saves money on consumables)',
    costEstimateHi: 'मुफ्त (सामान का खर्च भी बचता है)',
    effectiveness: 'high',
    honestCaveat:
      'Eliminates a major indoor spike, though outdoor smog infiltration still needs window sealing.',
    honestCaveatHi:
      'घर के भीतर का बड़ा प्रदूषण स्रोत रोकता है, पर बाहर की धुंध रोकने के लिए खिड़कियां भी बंद रखनी होंगी।',
    steps: [
      'Use window mesh screens or electric liquid vaporizers/nets instead of smoldering coils.',
      'For prayer/calm routines, use fresh flowers, LED diyas, or essential oil diffusers without smoke.',
      'Never burn paper, dried leaves, or coal indoors for warmth.',
    ],
    stepsHi: [
      'मच्छर कॉइल की जगह मच्छरदानी या खिड़की की जाली का उपयोग करें।',
      'पूजा के लिए धुएं वाली अगरबत्ती के बजाय ताजे फूल या बिना धुएं वाले विकल्प चुनें।',
      'गर्मी के लिए कमरे में कभी भी कोयला, लकड़ी या कागज न जलाएं।',
    ],
    impact: {
      healthEffect:
        'Avoids short-term indoor PM2.5 peaks of 100–350 µg/m³ during evening hours.',
      healthEffectHi:
        'शाम के समय कमरे में 100–350 µg/m³ तक पहुंचने वाले अचानक PM2.5 उछाल से बचाव।',
      emissionEffect: 'Estimated 0.4–0.8 kg CO2e and ~8–15 g direct indoor PM avoided per week.',
      emissionEffectHi: 'प्रति सप्ताह अनुमानित 0.4–0.8 kg CO2e और ~8–15 g घरेलू PM धुएं से बचाव।',
      communityEffect:
        'If 100 flats stop burning coils and incense in corridors, indoor air quality improves across shared vents.',
      communityEffectHi:
        'यदि 100 फ्लैट धुएं वाली चीजें बंद करें तो पूरी इमारत के साझा वेंटिलेशन की हवा साफ रहती है।',
      assumptions:
        'Assumes 1–2 incense sticks or 1 mosquito coil burned nightly in an unventilated 12 m² room.',
      assumptionsHi:
        '12 वर्ग मीटर के बंद कमरे में रोज रात 1 कॉइल या 1–2 अगरबत्ती जलाने के आधार पर अनुमान।',
    },
  },
  {
    id: 'kitchen-exhaust',
    title: 'Kitchen exhaust fan + covered pots while cooking',
    titleHi: 'खाना पकाते समय एग्जॉस्ट फैन और बर्तन ढकना',
    summary:
      'High-heat tadka, frying, and gas flames release concentrated PM2.5 and NO2; venting at the stove prevents it spreading to bedrooms.',
    summaryHi:
      'तेज आंच पर तलने, तड़का लगाने और गैस से निकलने वाले PM2.5 व NO2 को सीधे बाहर निकालता है।',
    costTier: 'free',
    costEstimate: 'Free (uses existing exhaust or lid)',
    costEstimateHi: 'मुफ्त (मौजूदा एग्जॉस्ट या ढक्कन से)',
    effectiveness: 'high',
    honestCaveat:
      'Turn off the exhaust fan 10 minutes after cooking finishes so you do not pull outdoor smog in all day.',
    honestCaveatHi:
      'खाना बनने के 10 मिनट बाद एग्जॉस्ट बंद कर दें ताकि दिन भर बाहर की धुंध अंदर न खिंचे।',
    steps: [
      'Always keep lids on boiling/simmering pots to cut steam, grease mist, and cooking gas.',
      'Run chimney/exhaust only while cooking + 10 minutes after.',
      'If you have no exhaust, close the bedroom door and crack only the kitchen window briefly.',
    ],
    stepsHi: [
      'बर्तन हमेशा ढककर पकाएं—इससे भाप, तेल के कण और गैस की खपत तीनों घटते हैं।',
      'खाना पकाने के दौरान और बाद में केवल 10 मिनट तक एग्जॉस्ट चलाएं।',
      'एग्जॉस्ट न हो तो बेडरूम का दरवाजा बंद कर रसोई की खिड़की थोड़ी खोलें।',
    ],
    impact: {
      healthEffect: 'Estimated 30–55% reduction in indoor NO2 and cooking PM2.5 spread.',
      healthEffectHi: 'घर में फैलने वाले NO2 और खाना पकाने के PM2.5 में अनुमानित 30–55% कमी।',
      emissionEffect: 'Lid cooking saves ~1.2–1.8 kg CO2e/week (~15% lower gas/electricity use).',
      emissionEffectHi: 'ढककर पकाने से प्रति सप्ताह ~1.2–1.8 kg CO2e और ~15% ईंधन बचत।',
      communityEffect: '100 households save ~150 kg CO2e/week and cut peak LPG/electricity demand.',
      communityEffectHi: '100 परिवार मिलकर प्रति सप्ताह ~150 kg CO2e बचाते हैं।',
      assumptions: 'Based on 45 min/day cooking with a fitted lid vs uncovered simmering.',
      assumptionsHi: 'रोज़ 45 मिनट ढककर बनाम खुले बर्तन में पकाने के अनुमान पर आधारित।',
    },
  },
  {
    id: 'seal-window-gaps',
    title: 'Seal drafty window & door gaps (weatherstripping or cloth)',
    titleHi: 'खिड़की व दरवाजे की दरारें सील करना (स्ट्रिप या गीला कपड़ा)',
    summary:
      'Smog creeps in fastest around loose sliding window frames and under main doors.',
    summaryHi:
      'ढीले स्लाइडिंग फ्रेम और दरवाजों के नीचे से बाहर की धुंध सबसे तेजी से अंदर आती है।',
    costTier: 'low',
    costEstimate: 'Free (towels) to ~₹250 / $3 (foam tape)',
    costEstimateHi: 'मुफ्त (तौलिया) से ~₹250 (फोम टेप)',
    effectiveness: 'moderate',
    honestCaveat:
      'Significantly slows smog entry and keeps warmth in, but still needs brief midday airing so indoor CO2 does not rise too high.',
    honestCaveatHi:
      'धुंध अंदर आने की रफ्तार कम करता है, लेकिन ताजी हवा के लिए दोपहर में थोड़ी देर खिड़की खोलना ज़रूरी है।',
    steps: [
      'Hold an incense-free tissue near window edges on a breezy day to spot drafts.',
      'Press rolled damp cloth/draft snake along door bottoms or stick peel-and-stick EPDM foam tape.',
      'Keep one bedroom tightly sealed as the family’s clean-air sanctuary.',
    ],
    stepsHi: [
      'हवा वाले दिन खिड़की के किनारों पर पतला कागज रखकर जांचें कि हवा कहां से आ रही है।',
      'दरवाजे के नीचे कपड़े का रोल रखें या सस्ता फोम सीलिंग टेप चिपकाएं।',
      'कम से कम एक बेडरूम को सबसे अच्छी तरह सील रखें।',
    ],
    impact: {
      healthEffect: 'Estimated 20–35% lower indoor infiltration during severe smog spikes.',
      healthEffectHi: 'गंभीर धुंध के दौरान घर के अंदर हवा के रिसाव में अनुमानित 20–35% कमी।',
      emissionEffect: 'Retains winter warmth, saving ~2–4 kg CO2e/week if using electric heaters.',
      emissionEffectHi: 'कमरे की गर्मी बचाकर हीटर बिजली में ~2–4 kg CO2e/सप्ताह बचत।',
      communityEffect: '100 sealed apartments cut ~300 kg CO2e/week in winter heating energy.',
      communityEffectHi: '100 सील किए गए फ्लैट सर्दी में ~300 kg CO2e/सप्ताह हीटिंग ऊर्जा बचाते हैं।',
      assumptions: 'Assumes typical leaky aluminium sliding windows in older urban flats.',
      assumptionsHi: 'पुराने शहरी फ्लैटों की एल्युमिनियम स्लाइडिंग खिड़कियों के आधार पर अनुमान।',
    },
  },
  {
    id: 'diy-box-fan-filter',
    title: 'DIY box-fan + MERV-13 filter (Corsi-Rosenthal style)',
    titleHi: 'कम खर्च वाला DIY बॉक्स-फैन + MERV-13 फ़िल्टर',
    summary:
      'Taping a high-efficiency MERV-13 pleated furnace filter to a standard box fan delivers real PM2.5 filtration at a fraction of commercial purifier prices.',
    summaryHi:
      'एक सामान्य बॉक्स-फैन के पीछे MERV-13 फ़िल्टर टेप करने से कम कीमत में असली PM2.5 सफाई मिलती है।',
    costTier: 'low',
    costEstimate: '~₹2,000–3,500 / $25–$45 (fan + filter)',
    costEstimateHi: '~₹2,000–3,500 (पंखा + MERV-13 फ़िल्टर)',
    effectiveness: 'high',
    honestCaveat:
      'Louder than a commercial HEPA purifier, looks bulky, and only works safely with a modern thermally-protected fan—never cover motor vents.',
    honestCaveatHi:
      'कमर्शियल प्यूरीफायर से थोड़ी आवाज ज्यादा होती है; केवल सुरक्षित थर्मल-प्रोटेक्टेड पंखे के साथ ही इस्तेमाल करें।',
    steps: [
      'Choose a square 20-inch box fan (or build a 4-filter cube for lower motor strain & quieter airflow).',
      'Tape a MERV-13 (or F7/F8) pleated filter firmly to the intake (back) side with airflow arrow pointing into the fan.',
      'Seal cardboard gaps with painter/duct tape so air passes through the filter, not around it.',
    ],
    stepsHi: [
      '20-इंच का बॉक्स फैन चुनें (बेहतर हवा और कम शोर के लिए 4-फ़िल्टर क्यूब भी बना सकते हैं)।',
      'फ़िल्टर को हवा की दिशा के तीर (airflow arrow) को पंखे की ओर रखकर पीछे टेप करें।',
      'किनारों की हर दरार टेप से बंद करें ताकि हवा केवल फ़िल्टर से होकर गुजरे।',
    ],
    impact: {
      healthEffect:
        'Estimated 50–70% indoor PM2.5 reduction in a closed 150–250 sq ft room within 45 minutes.',
      healthEffectHi:
        'बंद 150–250 वर्ग फुट कमरे में 45 मिनट के भीतर PM2.5 में अनुमानित 50–70% कमी।',
      emissionEffect:
        'Uses ~50–70W (~0.4 kWh/night) and avoids manufacturing/shipping plastic-heavy units.',
      emissionEffectHi:
        '~50–70W बिजली खर्च (रात में ~0.4 यूनिट) और कम प्लास्टिक कचरा।',
      communityEffect:
        'Schools and RWAs building 100 DIY filters for classrooms can protect ~3,000 students at 1/4th the cost.',
      communityEffectHi:
        'स्कूल और RWA 100 DIY फ़िल्टर बनाकर कम बजट में ~3,000 बच्चों की कक्षाएं सुरक्षित कर सकते हैं।',
      assumptions:
        'Based on peer-reviewed Corsi-Rosenthal box CADR tests (~150–300 CFM depending on speed & filter area).',
      assumptionsHi:
        'कोर्सी-रोसेंथल बॉक्स के स्वतंत्र CADR परीक्षणों पर आधारित अनुमान।',
    },
  },
  {
    id: 'hepa-purifier-guide',
    title: 'When a commercial HEPA purifier is worth it',
    titleHi: 'कमर्शियल HEPA एयर प्यूरीफायर कब खरीदना सही है?',
    summary:
      'Worth considering if a household member has asthma, COPD, heart disease, infancy, or pregnancy AND you live in frequent AQI > 200 winter smog.',
    summaryHi:
      'यदि परिवार में अस्थमा, हृदय रोग, बुजुर्ग, नवजात शिशु या गर्भवती महिला हैं और AQI अक्सर 200+ रहता है, तो यह उपयोगी है।',
    costTier: 'investment',
    costEstimate: '₹7,000–18,000 / $90–$220 + filter swaps',
    costEstimateHi: '₹7,000–18,000 + फ़िल्टर बदलना',
    effectiveness: 'high',
    honestCaveat:
      'Avoid "ionizer", "UV", or "ozone" gimmicks—look strictly for True HEPA (H13/H14) and a real CADR rating matched to your bedroom size. Useless if windows stay wide open.',
    honestCaveatHi:
      '"आयोनाइज़र" या "ओज़ोन" वाले फीचर से बचें—केवल True HEPA (H13) और कमरे के आकार के अनुसार CADR देखें। खिड़की खुली रहने पर यह काम नहीं करता।',
    steps: [
      'Prioritise one unit in the bedroom used by children, elderly, or asthma patients first.',
      'Check CADR (Clean Air Delivery Rate): aim for CADR (m³/h) >= 3x room volume (approx. room sq ft x 2.5).',
      'Check replacement filter availability and price before buying; vacuum the outer pre-filter mesh monthly.',
    ],
    stepsHi: [
      'सबसे पहले बच्चों, बुजुर्गों या अस्थमा मरीज के बेडरूम के लिए एक यूनिट लें।',
      'कमरे के आकार के हिसाब से CADR जांचें और खरीदने से पहले नए फ़िल्टर की कीमत पता करें।',
      'हर महीने बाहरी जाली (pre-filter) साफ करें और आयोनाइज़र मोड बंद रखें।',
    ],
    impact: {
      healthEffect: 'Estimated 60–80% indoor PM2.5 drop in a closed bedroom overnight.',
      healthEffectHi: 'बंद बेडरूम में रात भर में PM2.5 में अनुमानित 60–80% गिरावट।',
      emissionEffect:
        'Modern brushless DC purifiers use ~15–35W on sleep/medium (~0.2–0.3 kWh/night, ~1.2 kg CO2e/week).',
      emissionEffectHi:
        'आधुनिक DC प्यूरीफायर स्लीप मोड में ~15–35W (~1.2 kg CO2e/सप्ताह) उपयोग करते हैं।',
      communityEffect:
        'Shared RWA lending libraries of 20 purifiers can rotate units to pregnant mothers and recovering patients.',
      communityEffectHi:
        'RWA द्वारा 20 प्यूरीफायर का साझा बैंक बनाकर जरूरतमंद बुजुर्गों और मरीजों को उधार दिया जा सकता है।',
      assumptions:
        'Assumes closed 140 sq ft bedroom, True HEPA H13 unit running 10 hrs/day on medium speed.',
      assumptionsHi:
        '140 वर्ग फुट बंद कमरे में रोज़ 10 घंटे मध्यम गति पर True HEPA चलने का अनुमान।',
    },
  },
  {
    id: 'houseplants-honest',
    title: 'Houseplants (with honest expectations)',
    titleHi: 'घर के पौधे (ईमानदार सच्चाई के साथ)',
    summary:
      'Snake plant, money plant, and areca palm bring calm humidity and wipeable leaves, but they do NOT replace ventilation or filtration during winter smog.',
    summaryHi:
      'स्नेक प्लांट या मनी प्लांट मन को शांत रखते हैं, लेकिन सर्दी की धुंध में ये एयर प्यूरीफायर का विकल्प नहीं हैं।',
    costTier: 'free',
    costEstimate: 'Free (cuttings) – ₹300 / $4',
    costEstimateHi: 'मुफ्त (कलम से) – ₹300',
    effectiveness: 'limited',
    honestCaveat:
      'The famous 1989 NASA study tested sealed small chambers for VOC gases—not winter PM2.5 soot. You would need hundreds of plants per room to equal one HEPA filter.',
    honestCaveatHi:
      '1989 का प्रसिद्ध NASA अध्ययन छोटे बंद चैंबर में गैसों पर था, PM2.5 धुंध पर नहीं। एक HEPA फ़िल्टर जितनी सफाई के लिए कमरे में सैकड़ों पौधे चाहिए।',
    steps: [
      'Keep a few hardy low-light plants (snake plant, pothos) for comfort and visual calm.',
      'Wipe dusty leaves weekly with a damp cloth so pores stay clean; avoid overwatering (prevents mold).',
      'Rely on damp mopping, window timing, and real filtration—not plants—when AQI > 150.',
    ],
    stepsHi: [
      'मानसिक सुकून के लिए कुछ मजबूत पौधे (स्नेक प्लांट, मनी प्लांट) रखें।',
      'पत्तियों पर जमी धूल सप्ताह में गीले कपड़े से पोंछें और ज़्यादा पानी न दें ताकि फफूंद न लगे।',
      'AQI 150+ होने पर केवल पौधों के भरोसे न रहें—गीला पोंछा और फ़िल्ट्रेशन अपनाएं।',
    ],
    impact: {
      healthEffect: 'Negligible (<2–3%) effect on airborne PM2.5; mild stress-relief benefit.',
      healthEffectHi: 'हवा में तैरते PM2.5 पर नगण्य (<2–3%) असर; मानसिक सुकून के लिए अच्छे।',
      emissionEffect: 'Negligible direct carbon impact (~0.01 kg CO2/week); keep plastic pots minimal.',
      emissionEffectHi: 'सीधा कार्बन प्रभाव नगण्य (~0.01 kg CO2/सप्ताह)।',
      communityEffect:
        'Outdoor roadside green belts & native trees—not indoor pots—help trap coarse neighborhood dust.',
      communityEffectHi:
        'घर के गमलों के बजाय सड़क किनारे देसी पेड़ और हरित पट्टियां कॉलोनी की धूल रोकने में मदद करती हैं।',
      assumptions:
        'Based on 2019 Drexel University review (Cummings & Waring) comparing potted plants vs building air-exchange rates.',
      assumptionsHi:
        '2019 ड्रेक्सेल विश्वविद्यालय के समीक्षा अध्ययन पर आधारित जिसमें पौधों की वास्तविक सीमा स्पष्ट की गई।',
    },
  },
];

export const SUSTAINABLE_ALTERNATIVES: SustainableAlternative[] = [
  {
    id: 'alt-cooking-induction',
    domain: 'cooking',
    title: 'Induction or pressure-cooking shift (from biomass / heavy gas)',
    titleHi: 'इंडक्शन या प्रेशर कुकर का अधिक उपयोग (लकड़ी/अतिरिक्त गैस के बजाय)',
    replaces: 'Open biomass chulha / prolonged uncovered gas simmering',
    replacesHi: 'लकड़ी/उपले का चूल्हा या खुले बर्तन में लंबी गैस आंच',
    costTier: 'flexible',
    costRange: '₹1,800–3,500 ($22–$42) single induction hob; ₹0 for pressure cooking',
    costRangeHi: 'सिंगल इंडक्शन ₹1,800–3,500; प्रेशर कुकर उपयोग ₹0 अतिरिक्त',
    tradeOffs:
      'Requires flat-bottom steel/iron cookware and reliable electricity; induction adds zero indoor NO2 or soot.',
    tradeOffsHi:
      'सपाट तले वाले स्टील/लोहे के बर्तन और बिजली की जरूरत होती है; घर में NO2 या कालिख शून्य रहती है।',
    description:
      'For daily boiling, dal, rice, and tea, an induction hob or pressure cooker eliminates open indoor flame combustion and heats food faster with less wasted heat.',
    descriptionHi:
      'दाल, चावल, चाय और उबालने के काम इंडक्शन या प्रेशर कुकर में करने से घर में गैस/धुएं का प्रदूषण काफी घटता है।',
    impact: {
      healthEffect:
        'Eliminates indoor NO2 & CO spikes from flame cooking; 50–80% cleaner kitchen air if replacing biomass.',
      healthEffectHi:
        'आंच से निकलने वाले NO2 और CO को खत्म करता है; चूल्हे से बदलने पर 50–80% साफ रसोई हवा।',
      emissionEffect:
        'Estimated 3–6 kg CO2e avoided/week when replacing LPG simmering, or 18–30 kg CO2e/week when replacing wood/dung.',
      emissionEffectHi:
        'LPG आंच कम करने पर ~3–6 kg CO2e/सप्ताह और लकड़ी/उपले की जगह ~18–30 kg CO2e/सप्ताह की बचत।',
      communityEffect:
        '100 households shifting away from biomass save ~2 tonnes of wood smoke PM & CO2e weekly.',
      communityEffectHi:
        '100 परिवार यदि लकड़ी/कोयले से स्वच्छ ईंधन पर आएं, तो हर सप्ताह ~2 टन धुआं व कार्बन कम होता है।',
      assumptions:
        'Assumes 1 hr/day cooking energy efficiency (~84% induction vs ~40% gas burner vs ~15% open biomass).',
      assumptionsHi:
        'इंडक्शन (~84% दक्षता) बनाम गैस (~40%) बनाम खुले चूल्हे (~15%) की तुलना पर अनुमान।',
    },
  },
  {
    id: 'alt-heating-layers',
    domain: 'heating',
    title: 'Layered thermal insulation + targeted radiant heat (never wood/coal)',
    titleHi: 'सही परतदार कपड़े + सुरक्षित इलेक्ट्रिक हीटिंग (लकड़ी/कोयला बिल्कुल नहीं)',
    replaces: 'Open charcoal angithi, wood fires, or unsealed high-watt room heaters',
    replacesHi: 'कोयले की अंगीठी, लकड़ी का अलाव या खुले कमरे में हाई-वॉट हीटर',
    costTier: 'low',
    costRange: 'Free (layers, curtains) – ₹1,200 ($15) hot-water bag / low-watt heater',
    costRangeHi: 'मुफ्त (पर्दे/ऊनी परतें) – ₹1,200 (गर्म पानी की थैली/छोटा हीटर)',
    tradeOffs:
      'Oil-filled radiators cost more upfront than blower coils, while blower heaters dry air slightly; angithi/coal fires are lethal (carbon monoxide) indoors.',
    tradeOffsHi:
      'तेल वाले रेडिएटर शुरू में महंगे होते हैं; बंद कमरे में कोयले की अंगीठी कार्बन मोनोऑक्साइड से जानलेवा हो सकती है।',
    description:
      'Seal window drafts, pull heavy curtains at dusk, wear thermal base layers, and heat only the occupied person/bed—never burn solid fuels inside.',
    descriptionHi:
      'शाम होते ही भारी पर्दे डालें, दरारें बंद करें, गर्म परतदार कपड़े पहनें—घर में कभी कोयला या लकड़ी न जलाएं।',
    impact: {
      healthEffect:
        'Zero risk of indoor carbon monoxide poisoning and eliminates toxic indoor coal/wood PM2.5.',
      healthEffectHi:
        'कार्बन मोनोऑक्साइड के खतरे से 100% बचाव और जहरीले कोयला/लकड़ी PM2.5 का सफाया।',
      emissionEffect:
        'Cutting electric heater run-time by 3 hrs/day via curtains & layers saves ~15–22 kg CO2e/week.',
      emissionEffectHi:
        'पर्दों और परतों से रोज़ 3 घंटे हीटर कम चलाने पर ~15–22 kg CO2e/सप्ताह बिजली बचती है।',
      communityEffect:
        'If 100 households stop evening wood/coal bonfires, local block-level winter PM2.5 drops sharply.',
      communityEffectHi:
        'यदि 100 परिवार और चौकीदार शाम का अलाव बंद करें तो मोहल्ले की रात की धुंध काफी घटती है।',
      assumptions:
        'Assumes 2,000W coil heater reduced by 3 hrs/day at ~0.7 kg CO2/kWh grid intensity.',
      assumptionsHi:
        '2,000W हीटर का उपयोग रोज़ 3 घंटे घटाने और ~0.7 kg CO2/kWh ग्रिड उत्सर्जन का अनुमान।',
    },
  },
  {
    id: 'alt-transport-shared',
    domain: 'transport',
    title: 'Metro/bus + carpool + consolidated errands',
    titleHi: 'मेट्रो/बस + कारपूल + एक साथ बाजार के काम निपटाना',
    replaces: 'Solo petrol/diesel car or frequent short cold-start two-wheeler trips',
    replacesHi: 'अकेले पेट्रोल/डीजल कार या बार-बार छोटी दोपहिया यात्राएं',
    costTier: 'free',
    costRange: 'Saves ₹400–1,500/week ($5–$18) in fuel',
    costRangeHi: 'हर सप्ताह ₹400–1,500 ईंधन की बचत',
    tradeOffs:
      'Adds 10–15 minutes of planning or walking to transit stops; combine with N95 mask on high-AQI days.',
    tradeOffsHi:
      'योजना बनाने या स्टॉप तक पैदल चलने में 10–15 मिनट अतिरिक्त लग सकते हैं; खराब हवा में N95 पहनें।',
    description:
      'Cold engines in winter emit the highest soot during the first 3 km. Bundling errands into one trip and carpooling school runs cuts both cost and street smog.',
    descriptionHi:
      'सर्दियों में ठंडे इंजन शुरुआती 3 किमी में सबसे ज्यादा धुआं छोड़ते हैं। काम एक साथ निपटाने और स्कूल कारपूल से धुआं व खर्च दोनों घटते हैं।',
    impact: {
      healthEffect:
        'Reduces kerbside tailpipe NO2 and ultrafine particles right outside homes and schools.',
      healthEffectHi:
        'घरों और स्कूलों के बाहर सड़क किनारे NO2 और महीन कणों को कम करता है।',
      emissionEffect:
        'Avoiding 40 km/week of solo car driving saves ~7–9 kg CO2e/week.',
      emissionEffectHi:
        'सप्ताह में 40 किमी अकेली कार यात्रा कम करने से ~7–9 kg CO2e/सप्ताह की बचत।',
      communityEffect:
        '100 families carpooling school runs remove ~60–80 idling cars from school gates every morning.',
      communityEffectHi:
        '100 परिवारों के स्कूल कारपूल करने से हर सुबह स्कूल गेट से ~60–80 कारों का धुआं हटता है।',
      assumptions:
        'Assumes 180–210 g CO2e/km average urban passenger car vs shared ride or electric metro.',
      assumptionsHi:
        'औसत शहरी कार (~180–210 g CO2e/किमी) बनाम साझा सवारी/मेट्रो के आधार पर अनुमान।',
    },
  },
  {
    id: 'alt-waste-compost',
    domain: 'waste',
    title: 'Zero open burning: leaf mulching & segregated wet composting',
    titleHi: 'खुले में कचरा/पत्ते न जलाना: खाद और मल्चिंग अपनाएं',
    replaces: 'Burning dry winter leaves, garden trimmings, or plastic/cardboard waste',
    replacesHi: 'सर्दियों में सूखे पत्ते, बगीचे का कचरा या प्लास्टिक जलाना',
    costTier: 'free',
    costRange: 'Free (shared RWA compost pit or municipal green bin)',
    costRangeHi: 'मुफ्त (RWA कम्पोस्ट गड्ढा या नगर निगम हरा डिब्बा)',
    tradeOffs:
      'Takes 4–8 weeks for leaves to break down into mulch/compost; requires RWA or security-staff awareness so night guards have warm coats instead of trash fires.',
    tradeOffsHi:
      'पत्तों को खाद बनने में 4–8 सप्ताह लगते हैं; चौकीदारों को कचरा जलाने के बजाय गर्म जैकेट/हीटर देना जरूरी है।',
    description:
      'Open trash and leaf fires produce dense, toxic PM2.5 and dioxins right inside residential lanes. Provide guards with warm gear and pile fallen leaves under trees.',
    descriptionHi:
      'मोहल्लों में पत्ते और कचरा जलाने से सीधे घरों के अंदर जहरीला धुआं भरता है। सूखे पत्ते पेड़ों की जड़ में बिछाएं (मल्चिंग) या खाद बनाएं।',
    impact: {
      healthEffect:
        'Eliminates toxic plastic/leaf smoke bursts that trigger asthma attacks in nearby flats.',
      healthEffectHi:
        'आसपास के फ्लैटों में अस्थमा बढ़ाने वाले जहरीले कचरे के धुएं से तुरंत बचाव।',
      emissionEffect:
        'Composting 5 kg of dry leaves/week instead of burning avoids ~7–9 kg CO2e + ~80–120 g dense PM2.5.',
      emissionEffectHi:
        'सप्ताह में 5 किलो पत्ते जलाने के बजाय खाद बनाने से ~7–9 kg CO2e और ~80–120 g धुआं बचता है।',
      communityEffect:
        'If 100 homes & RWA lanes stop open burning, neighborhood evening smog spikes drop visibly within days.',
      communityEffectHi:
        'यदि 100 घर और सोसायटी खुले में जलाना बंद करें तो शाम की स्थानीय धुंध कुछ ही दिनों में कम होती है।',
      assumptions:
        'Open biomass burning emits ~15–25 g PM2.5 per kg dry fuel plus uncombusted hydrocarbons.',
      assumptionsHi:
        'खुले में 1 किलो सूखे पत्ते/कचरा जलाने से लगभग 15–25 ग्राम PM2.5 निकलने के अनुमान पर आधारित।',
    },
  },
];
