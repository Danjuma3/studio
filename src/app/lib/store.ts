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
    else {
      setRecipes(SEED_RECIPES);
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(SEED_RECIPES));
    }

    if (storedStaff) setStaff(JSON.parse(storedStaff));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedPayments) setPaymentMethods(JSON.parse(storedPayments));

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
    updateRecipe,
    deleteRecipe,
  };
}
