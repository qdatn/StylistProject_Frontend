export interface StylePreference {
  _id: string
  occupation?: string;
  location?: string;
  height?: number;
  weight?: number;

  favoriteStyles: string[];
  outfitsByOccasion: Map<string, string>;
  followTrends?: "yes" | "no" | "sometimes";
  favoriteColors: string[];
  avoidedColors: string[];
  favoritePatterns: string[];

  topSize?: string;
  bottomSize?: string;
  shoeSize?: string;
  fitPreference?: string;
  avoidedStyles?: string;

  shoppingPlaces: string[];
  shoppingFrequency?: string;
  shoppingMethod?: string;
  priorities: string[];

  platforms: string[];
  consentForAdvice: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

// Kiểu dữ liệu analytics
export interface AnalyticsData {
  topStyles: { item: string; count: number }[];
  popularColors: { item: string; count: number }[];
  sizeDistribution: {
    top: Record<string, number>;
    bottom: Record<string, number>;
    shoe: Record<string, number>;
  };
  shoppingHabits: {
    places: { item: string; count: number }[];
    frequencies: Record<string, number>;
  };
  trendFollowing: Record<string, number>;
  brandPreferences: { brand: string; count: number }[];
  totalUsers: number;
  lastUpdated: string;
}

export interface AnalyticsList {
  data: AnalyticsData;
}