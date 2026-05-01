"use client";

import { useState, useEffect } from 'react';
import { Ingredient, Recipe, StaffMember, ManagerTask, PaymentMethod, SubscriptionInfo } from './types';

const STORAGE_KEYS = {
  INGREDIENTS: 'kitchenprof_ingredients',
  RECIPES: 'kitchenprof_recipes',
  STAFF: 'kitchenprof_staff',
  TASKS: 'kitchenprof_tasks',
  PAYMENTS: 'kitchenprof_payments',
  SUBSCRIPTION: 'kitchenprof_subscription',
};

const SEED_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Jollof Rice (Long Grain)', unit: 'kg', bulkPrice: 1200, retailPrice: 1500, weeklyUsage: 50, currentStock: 120, minStock: 20, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Tomato Paste', unit: 'kg', bulkPrice: 800, retailPrice: 1100, weeklyUsage: 20, currentStock: 15, minStock: 10, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Vegetable Oil', unit: 'L', bulkPrice: 2200, retailPrice: 2600, weeklyUsage: 15, currentStock: 5, minStock: 10, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Onions', unit: 'kg', bulkPrice: 600, retailPrice: 900, weeklyUsage: 30, currentStock: 45, minStock: 15, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Chicken Breast', unit: 'kg', bulkPrice: 4500, retailPrice: 5200, weeklyUsage: 25, currentStock: 12, minStock: 8, lastUpdated: new Date().toISOString() },
];

const SEED_RECIPES: Recipe[] = [
  { 
    id: 'r1', 
    name: 'Party Jollof Rice (Standard Portion)', 
    description: 'Classic Lagos party jollof served per plate.', 
    sellingPrice: 3500, 
    items: [
      { ingredientId: '1', quantity: 0.25 },
      { ingredientId: '2', quantity: 0.05 },
      { ingredientId: '3', quantity: 0.02 },
      { ingredientId: '4', quantity: 0.03 },
    ] 
  }
];

const SEED_STAFF: StaffMember[] = [
  { id: 's1', name: 'Chef Buchi', role: 'Chef', status: 'active' },
  { id: 's2', name: 'Amaka Obi', role: 'Sous Chef', status: 'active' },
  { id: 's3', name: 'Tunde Ade', role: 'Server', status: 'on-break' },
];

const SEED_TASKS: ManagerTask[] = [
  { id: 't1', task: 'Check gas levels', completed: false, priority: 'high' },
  { id: 't2', task: 'Review morning delivery', completed: true, priority: 'medium' },
  { id: 't3', task: 'Inspect cold storage', completed: false, priority: 'high' },
];

const SEED_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', type: 'paystack', provider: 'Paystack', isDefault: true },
];

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  plan: 'free',
  status: 'active',
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export function useInventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(DEFAULT_SUBSCRIPTION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIngredients = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    const storedRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
    const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const storedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    const storedSub = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);

    if (storedIngredients) setIngredients(JSON.parse(storedIngredients));
    else {
      setIngredients(SEED_INGREDIENTS);
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(SEED_INGREDIENTS));
    }

    if (storedRecipes) setRecipes(JSON.parse(storedRecipes));
    else {
      setRecipes(SEED_RECIPES);
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(SEED_RECIPES));
    }

    if (storedStaff) setStaff(JSON.parse(storedStaff));
    else {
      setStaff(SEED_STAFF);
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(SEED_STAFF));
    }

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    else {
      setTasks(SEED_TASKS);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    }

    if (storedPayments) setPaymentMethods(JSON.parse(storedPayments));
    else {
      setPaymentMethods(SEED_PAYMENTS);
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    }

    if (storedSub) setSubscription(JSON.parse(storedSub));
    else {
      setSubscription(DEFAULT_SUBSCRIPTION);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(DEFAULT_SUBSCRIPTION));
    }

    setLoading(false);
  }, []);

  const saveIngredients = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(newIngredients));
  };

  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(newRecipes));
  };

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(newStaff));
  };

  const saveTasks = (newTasks: ManagerTask[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
  };

  const savePayments = (newPayments: PaymentMethod[]) => {
    setPaymentMethods(newPayments);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(newPayments));
  };

  const saveSubscription = (newSub: SubscriptionInfo) => {
    setSubscription(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(newSub));
  };

  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'lastUpdated'>) => {
    const newIngredient = {
      ...ingredient,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
    };
    saveIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    saveIngredients(ingredients.map(ing => ing.id === id ? { ...ing, ...updates, lastUpdated: new Date().toISOString() } : ing));
  };

  const deleteIngredient = (id: string) => {
    saveIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
    };
    saveRecipes([...recipes, newRecipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    saveRecipes(recipes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecipe = (id: string) => {
    saveRecipes(recipes.filter(r => r.id !== id));
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = {
      ...method,
      id: Math.random().toString(36).substr(2, 9),
    };
    savePayments([...paymentMethods, newMethod]);
  };

  const deletePaymentMethod = (id: string) => {
    savePayments(paymentMethods.filter(p => p.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    savePayments(paymentMethods.map(p => ({ ...p, isDefault: p.id === id })));
  };

  const upgradePlan = (plan: SubscriptionInfo['plan']) => {
    saveSubscription({
      ...subscription,
      plan,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return {
    ingredients,
    recipes,
    staff,
    tasks,
    paymentMethods,
    subscription,
    loading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleTask,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    upgradePlan,
  };
}
