"use client";

import { useState, useEffect } from 'react';
import { Ingredient, Recipe } from './types';

const STORAGE_KEYS = {
  INGREDIENTS: 'ekoplate_ingredients',
  RECIPES: 'ekoplate_recipes',
};

// Seed data for initial experience
const SEED_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Jollof Rice (Long Grain)', unit: 'kg', bulkPrice: 1200, retailPrice: 1500, weeklyUsage: 50, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Tomato Paste', unit: 'kg', bulkPrice: 800, retailPrice: 1100, weeklyUsage: 20, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Vegetable Oil', unit: 'L', bulkPrice: 2200, retailPrice: 2600, weeklyUsage: 15, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Onions', unit: 'kg', bulkPrice: 600, retailPrice: 900, weeklyUsage: 30, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Chicken Breast', unit: 'kg', bulkPrice: 4500, retailPrice: 5200, weeklyUsage: 25, lastUpdated: new Date().toISOString() },
];

export function useInventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIngredients = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    const storedRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);

    if (storedIngredients) {
      setIngredients(JSON.parse(storedIngredients));
    } else {
      setIngredients(SEED_INGREDIENTS);
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(SEED_INGREDIENTS));
    }

    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
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

  return {
    ingredients,
    recipes,
    loading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addRecipe,
    deleteRecipe,
  };
}