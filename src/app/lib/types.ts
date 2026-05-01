
export type UnitOfMeasure = 'kg' | 'g' | 'L' | 'ml' | 'piece' | 'bag' | 'crate' | 'bucket' | 'paint_bucket';

export interface Ingredient {
  id: string;
  name: string;
  unitOfMeasure: UnitOfMeasure;
  bulkUnitPrice: number;
  retailUnitPrice: number;
  weeklyUsage: number;
  currentStock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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

export interface SupportIssue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'fixed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface SubscriptionInfo {
  plan: UserPlan;
  status: 'active' | 'past_due' | 'canceled';
  nextBillingDate: string;
}

export interface SystemPaymentConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  paystackPublicKey: string;
  proPrice: number;
  appLogoUrl?: string;
}

export interface SystemAlert {
  message: string;
  type: 'info' | 'warning' | 'market' | 'urgent';
  active: boolean;
  updatedAt: string;
}
