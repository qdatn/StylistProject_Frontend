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