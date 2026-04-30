export type UnitOfMeasure = 'kg' | 'g' | 'L' | 'ml' | 'piece' | 'bag' | 'crate';

export interface Ingredient {
  id: string;
  name: string;
  unit: UnitOfMeasure;
  bulkPrice: number;
  retailPrice: number;
  weeklyUsage: number;
  lastUpdated: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  items: RecipeItem[];
}

export type PricingStrategy = 'bulk' | 'retail';