
"use client";

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import {
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking
} from '@/firebase/non-blocking-updates';
import { Ingredient, Recipe, StaffMember, ManagerTask, SupportIssue, SubscriptionInfo, UserPlan, SystemPaymentConfig, SystemAlert } from './types';

const DEFAULT_SYSTEM_PAYMENT: SystemPaymentConfig = {
  bankName: "GTBank",
  accountNumber: "0123456789",
  accountName: "Kitchen Prof Enterprise",
  paystackPublicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  proPrice: 11000,
  appLogoUrl: ""
};

const DEFAULT_SYSTEM_ALERT: SystemAlert = {
  message: "Welcome to Kitchen Prof! Update your prices for accuracy.",
  type: "info",
  active: true,
  updatedAt: "2024-01-01T00:00:00.000Z"
};

export function useInventory() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [currentPlan, setCurrentPlan] = useState<UserPlan>('free');

  const systemPaymentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'system', 'payment');
  }, [firestore]);
  const { data: systemPayment, isLoading: isSystemLoading } = useDoc<SystemPaymentConfig>(systemPaymentRef);

  const systemAlertRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'system', 'alert');
  }, [firestore]);
  const { data: systemAlert } = useDoc<SystemAlert>(systemAlertRef);

  const ingredientsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'ingredients');
  }, [firestore, user]);
  const { data: ingredients, isLoading: isIngredientsLoading } = useCollection<Ingredient>(ingredientsQuery);

  const recipesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'recipes');
  }, [firestore, user]);
  const { data: recipes, isLoading: isRecipesLoading } = useCollection<Recipe>(recipesQuery);

  const staffQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'staff');
  }, [firestore, user]);
  const { data: staff } = useCollection<StaffMember>(staffQuery);

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'tasks');
  }, [firestore, user]);
  const { data: tasks } = useCollection<ManagerTask>(tasksQuery);

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'issues');
  }, [firestore, user]);
  const { data: issues } = useCollection<SupportIssue>(issuesQuery);

  const updateSystemPaymentConfig = (updates: Partial<SystemPaymentConfig>) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'system', 'payment');
    setDocumentNonBlocking(docRef, updates, { merge: true });
  };

  const updateSystemAlert = (updates: Partial<SystemAlert>) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'system', 'alert');
    setDocumentNonBlocking(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
  };

  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'currentStock' | 'minStock'>) => {
    if (!firestore || !user) return;
    const colRef = collection(firestore, 'users', user.uid, 'ingredients');
    const newDocId = Math.random().toString(36).substr(2, 9);
    setDocumentNonBlocking(doc(colRef, newDocId), {
      ...ingredient,
      id: newDocId,
      currentStock: 0,
      minStock: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'ingredients', id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: new Date().toISOString() });
  };

  const deleteIngredient = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'ingredients', id);
    deleteDocumentNonBlocking(docRef);
  };

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'sellingPrice'>) => {
    if (!firestore || !user) return;
    const colRef = collection(firestore, 'users', user.uid, 'recipes');
    const newDocId = Math.random().toString(36).substr(2, 9);
    setDocumentNonBlocking(doc(colRef, newDocId), {
      ...recipe,
      id: newDocId,
      sellingPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'recipes', id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: new Date().toISOString() });
  };

  const deleteRecipe = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'recipes', id);
    deleteDocumentNonBlocking(docRef);
  };

  const toggleTask = (id: string) => {
    if (!firestore || !user || !tasks) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const docRef = doc(firestore, 'users', user.uid, 'tasks', id);
    updateDocumentNonBlocking(docRef, { completed: !task.completed });
  };

  const reportIssue = (title: string, description: string, severity: SupportIssue['severity']) => {
    if (!firestore || !user) return;
    const colRef = collection(firestore, 'users', user.uid, 'issues');
    const newDocId = Math.random().toString(36).substr(2, 9);
    setDocumentNonBlocking(doc(colRef, newDocId), {
      id: newDocId,
      title,
      description,
      status: 'open',
      severity,
      createdAt: new Date().toISOString()
    }, { merge: true });
  };

  const upgradePlan = (plan: UserPlan) => {
    setCurrentPlan(plan);
  };

  return {
    ingredients: ingredients || [],
    recipes: recipes || [],
    staff: staff || [],
    tasks: tasks || [],
    issues: issues || [],
    systemPayment: systemPayment || DEFAULT_SYSTEM_PAYMENT,
    systemAlert: systemAlert || DEFAULT_SYSTEM_ALERT,
    subscription: { plan: currentPlan, status: 'active', nextBillingDate: "2024-01-01T00:00:00.000Z" } as SubscriptionInfo,
    loading: isUserLoading || isIngredientsLoading || isRecipesLoading || isSystemLoading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleTask,
    reportIssue,
    upgradePlan,
    updateSystemPaymentConfig,
    updateSystemAlert
  };
}
