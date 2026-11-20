export type Language = 'en' | 'hi';

export type BudgetLevel = 'free' | 'low' | 'flexible';
export type HomeType = 'apartment' | 'house';
export type WindowSeal = 'tight' | 'average' | 'drafty';
export type HeatingMethod = 'electric' | 'gas' | 'wood' | 'coal' | 'none';
export type CommuteMode = 'walk' | 'cycle' | 'transit' | 'two-wheeler' | 'car' | 'wfh';
export type CookingFuel = 'electric' | 'lpg' | 'biomass';

export type RespiratoryCondition =
  | 'asthma'
  | 'allergies'
  | 'copd_or_lung'
  | 'heart_condition'
  | 'pregnancy';

export interface UserProfile {
  city: string;
  area?: string;
  lat?: number;
  lon?: number;
  adults: number;
  children: number;
  elderly: number;
  conditions: RespiratoryCondition[];
  homeType: HomeType;
  windowSeal: WindowSeal;
  hasExhaustFan: boolean;
  hasAirPurifier: boolean;
  heatingMethod: HeatingMethod;
  commuteMode: CommuteMode;
  cookingFuel: CookingFuel;
  workFromHome: boolean;
  budget: BudgetLevel;
  onboardingCompleted: boolean;
}

export type AQILevelId =
  | 'good'
  | 'moderate'
  | 'sensitive'
  | 'unhealthy'
  | 'very-unhealthy'
  | 'hazardous';

export interface DailyOutlook {
  date: string;
  dayLabel: string;
  aqi: number;
  pm25: number;
  levelId: AQILevelId;
  bestWindow: string;
}

export interface AirQualityData {
  city: string;
  aqi: number;
  mainPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3';
  pm25: number;
  pm10: number;
  no2: number;
  source: string;
  isLive: boolean;
  isManual?: boolean;
  lastUpdated: string;
  outlook: DailyOutlook[];
}

export interface ImpactInfo {
  healthEffect: string;
  healthEffectHi: string;
  emissionEffect: string;
  emissionEffectHi: string;
  communityEffect: string;
  communityEffectHi: string;
  assumptions: string;
  assumptionsHi: string;
}

export interface PlanAction {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  category: 'ventilation' | 'outdoor' | 'mask' | 'commute' | 'cooking' | 'indoor';
  title: string;
  titleHi: string;
  detail: string;
  detailHi: string;
  priority: 'high' | 'recommended' | 'optional';
  impact: ImpactInfo;
}

export interface IndoorHack {
  id: string;
  title: string;
  titleHi: string;
  summary: string;
  summaryHi: string;
  costTier: 'free' | 'low' | 'investment';
  costEstimate: string;
  costEstimateHi: string;
  effectiveness: 'high' | 'moderate' | 'limited';
  honestCaveat: string;
  honestCaveatHi: string;
  steps: string[];
  stepsHi: string[];
  impact: ImpactInfo;
}

export interface SustainableAlternative {
  id: string;
  domain: 'cooking' | 'heating' | 'transport' | 'waste';
  title: string;
  titleHi: string;
  replaces: string;
  replacesHi: string;
  costTier: 'free' | 'low' | 'flexible';
  costRange: string;
  costRangeHi: string;
  tradeOffs: string;
  tradeOffsHi: string;
  description: string;
  descriptionHi: string;
  impact: ImpactInfo;
}

export interface HabitItem {
  id: string;
  label: string;
  labelHi: string;
  weeklyCo2Kg: number;
  weeklyExposurePct: number;
}

export interface HabitProgress {
  completedByDate: Record<string, string[]>;
}

export interface CommunityPledge {
  id: string;
  groupName: string;
  city: string;
  households: number;
  actions: string[];
  estimatedWeeklyCo2Kg: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface PersonaPreset {
  id: string;
  name: string;
  nameHi: string;
  scenario: string;
  scenarioHi: string;
  profile: UserProfile;
  sampleAqi: number;
}
