
"use client";

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking, 
  setDocumentNonBlocking 
} from '@/firebase/non-blocking-updates';
import { Ingredient, Recipe, StaffMember, ManagerTask, PaymentMethod, SubscriptionInfo, UserPlan, SystemPaymentConfig } from './types';

export function useInventory() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [currentPlan, setCurrentPlan] = useState<UserPlan>('free');

  // System Payment Config
  const systemPaymentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'system', 'payment');
  }, [firestore]);
  const { data: systemPayment, isLoading: isSystemLoading } = useDoc<SystemPaymentConfig>(systemPaymentRef);

  // Ingredients Collection
  const ingredientsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'ingredients');
  }, [firestore, user]);
  const { data: ingredients, isLoading: isIngredientsLoading } = useCollection<Ingredient>(ingredientsQuery);

  // Recipes Collection
  const recipesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'recipes');
  }, [firestore, user]);
  const { data: recipes, isLoading: isRecipesLoading } = useCollection<Recipe>(recipesQuery);

  // Staff Collection
  const staffQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'staff');
  }, [firestore, user]);
  const { data: staff } = useCollection<StaffMember>(staffQuery);

  // Tasks Collection
  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'tasks');
  }, [firestore, user]);
  const { data: tasks } = useCollection<ManagerTask>(tasksQuery);

  // Payments Collection
  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'payments');
  }, [firestore, user]);
  const { data: paymentMethods } = useCollection<PaymentMethod>(paymentsQuery);

  const updateSystemPaymentConfig = (updates: Partial<SystemPaymentConfig>) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'system', 'payment');
    setDocumentNonBlocking(docRef, updates, { merge: true });
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

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    if (!firestore || !user) return;
    const colRef = collection(firestore, 'users', user.uid, 'payments');
    const newDocId = Math.random().toString(36).substr(2, 9);
    setDocumentNonBlocking(doc(colRef, newDocId), { ...method, id: newDocId }, { merge: true });
  };

  const deletePaymentMethod = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'payments', id);
    deleteDocumentNonBlocking(docRef);
  };

  const setDefaultPaymentMethod = (id: string) => {
    if (!firestore || !user || !paymentMethods) return;
    paymentMethods.forEach(p => {
      const docRef = doc(firestore, 'users', user.uid, 'payments', p.id);
      updateDocumentNonBlocking(docRef, { isDefault: p.id === id });
    });
  };

  const upgradePlan = (plan: UserPlan) => {
    setCurrentPlan(plan);
  };

  return {
    ingredients: ingredients || [],
    recipes: recipes || [],
    staff: staff || [],
    tasks: tasks || [],
    paymentMethods: paymentMethods || [],
    systemPayment: systemPayment || {
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "Kitchen Prof Enterprise",
      paystackPublicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      proPrice: 11000
    },
    subscription: { plan: currentPlan, status: 'active', nextBillingDate: new Date().toISOString() } as SubscriptionInfo,
    loading: isUserLoading || isIngredientsLoading || isRecipesLoading || isSystemLoading,
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
    updateSystemPaymentConfig
  };
}
