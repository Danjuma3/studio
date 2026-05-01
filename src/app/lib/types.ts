export type UnitOfMeasure = 'kg' | 'g' | 'L' | 'ml' | 'piece' | 'bag' | 'crate';

export interface Ingredient {
  id: string;
  name: string;
  unit: UnitOfMeasure;
  bulkPrice: number;
  retailPrice: number;
  weeklyUsage: number;
  currentStock: number;
  minStock: number;
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
  sellingPrice: number;
  items: RecipeItem[];
}

export type PricingStrategy = 'bulk' | 'retail';

export interface StaffMember {
  id: string;
  name: string;
  role: 'Chef' | 'Server' | 'Cleaner' | 'Sous Chef';
  status: 'active' | 'on-break' | 'off-duty';
}

export interface ManagerTask {
  id: string;
  task: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'pos' | 'cash' | 'paystack';
  provider: string;
  lastFour?: string;
  accountName?: string;
  isDefault: boolean;
}

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface SubscriptionInfo {
  plan: UserPlan;
  status: 'active' | 'past_due' | 'canceled';
  nextBillingDate: string;
}
