"use client";

import { useState, useEffect } from 'react';
import { Ingredient, Recipe, StaffMember, ManagerTask, PaymentMethod } from './types';

const STORAGE_KEYS = {
  INGREDIENTS: 'ekoplate_ingredients',
  RECIPES: 'ekoplate_recipes',
  STAFF: 'ekoplate_staff',
  TASKS: 'ekoplate_tasks',
  PAYMENTS: 'ekoplate_payments',
};

// Seed data
const SEED_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Jollof Rice (Long Grain)', unit: 'kg', bulkPrice: 1200, retailPrice: 1500, weeklyUsage: 50, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Tomato Paste', unit: 'kg', bulkPrice: 800, retailPrice: 1100, weeklyUsage: 20, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Vegetable Oil', unit: 'L', bulkPrice: 2200, retailPrice: 2600, weeklyUsage: 15, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Onions', unit: 'kg', bulkPrice: 600, retailPrice: 900, weeklyUsage: 30, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Chicken Breast', unit: 'kg', bulkPrice: 4500, retailPrice: 5200, weeklyUsage: 25, lastUpdated: new Date().toISOString() },
];

const SEED_STAFF: StaffMember[] = [
  { id: 's1', name: 'Chidi Okafor', role: 'Chef', status: 'active' },
  { id: 's2', name: 'Fatima Bello', role: 'Sous Chef', status: 'active' },
  { id: 's3', name: 'Emeka Nwosu', role: 'Server', status: 'on-break' },
  { id: 's4', name: 'Bisi Adeyemi', role: 'Server', status: 'off-duty' },
];

const SEED_TASKS: ManagerTask[] = [
  { id: 't1', task: 'Inventory Audit for Mile 12 delivery', completed: false, priority: 'high' },
  { id: 't2', task: 'Review staff shift schedule', completed: true, priority: 'medium' },
  { id: 't3', task: 'Inspect kitchen hygiene standards', completed: false, priority: 'high' },
  { id: 't4', task: 'Update fish market prices', completed: false, priority: 'medium' },
];

const SEED_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', type: 'bank_transfer', provider: 'GTBank', accountName: "Buchi's Kitchen Ent.", isDefault: true },
  { id: 'p2', type: 'card', provider: 'Visa', lastFour: '4242', isDefault: false },
];

export function useInventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIngredients = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    const storedRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
    const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const storedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);

    if (storedIngredients) setIngredients(JSON.parse(storedIngredients));
    else {
      setIngredients(SEED_INGREDIENTS);
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(SEED_INGREDIENTS));
    }

    if (storedRecipes) setRecipes(JSON.parse(storedRecipes));

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
    if (newMethod.isDefault) {
      savePayments(paymentMethods.map(m => ({ ...m, isDefault: false })).concat(newMethod));
    } else {
      savePayments([...paymentMethods, newMethod]);
    }
  };

  const deletePaymentMethod = (id: string) => {
    savePayments(paymentMethods.filter(m => m.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    savePayments(paymentMethods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  return {
    ingredients,
    recipes,
    staff,
    tasks,
    paymentMethods,
    loading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addRecipe,
    deleteRecipe,
    toggleTask,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
}
