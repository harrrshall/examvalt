'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface SubscriptionData {
  status: 'trial' | 'active' | 'expired';
  trialStartDate: Date | null;
  subscriptionEndDate: Date | null;
}

interface UserData {
  subscriptionData: SubscriptionData;
  files: string[];
  questionsGenerated: number;
  studyTimeHours: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  isSubscriptionActive: boolean;
  daysLeftInSubscription: number;
  logout: () => Promise<void>; // New logout function
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
  isSubscriptionActive: false,
  daysLeftInSubscription: 0,
  logout: async () => {}, // Initialize logout function
});

const TRIAL_DURATION_DAYS = 2;

const calculateDaysLeft = (startDate: Date, endDate: Date): number => {
  const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
};

const determineSubscriptionStatus = (subscriptionData: SubscriptionData | null): [boolean, number, 'trial' | 'active' | 'expired'] => {
  if (!subscriptionData || !subscriptionData.trialStartDate) {
    return [false, 0, 'expired'];
  }

  let daysLeft = 0;
  let status: 'trial' | 'active' | 'expired' = 'expired';

  if (subscriptionData.status === 'trial' && subscriptionData.trialStartDate) {
    const trialStartDate = new Date(subscriptionData.trialStartDate);
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialStartDate.getDate() + TRIAL_DURATION_DAYS);
    
    daysLeft = calculateDaysLeft(trialStartDate, trialEndDate);
    
    if (daysLeft > 0) {
      status = 'trial';
    } else {
      status = 'expired';
      daysLeft = 0;
    }
  } else if (subscriptionData.status === 'active' && subscriptionData.subscriptionEndDate) {
    const endDate = new Date(subscriptionData.subscriptionEndDate);
    daysLeft = calculateDaysLeft(new Date(), endDate);
    status = daysLeft > 0 ? 'active' : 'expired';
  }

  const isActive = status !== 'expired';
  return [isActive, daysLeft, status];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [daysLeftInSubscription, setDaysLeftInSubscription] = useState(0);

  const refreshUserData = useCallback(async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const rawData = userDocSnap.data();
        // Properly type and convert the Firestore data
        const data: UserData = {
          subscriptionData: {
            status: rawData.subscriptionData.status,
            trialStartDate: rawData.subscriptionData.trialStartDate?.toDate() || null,
            subscriptionEndDate: rawData.subscriptionData.subscriptionEndDate?.toDate() || null,
          },
          files: rawData.files || [],
          questionsGenerated: rawData.questionsGenerated || 0,
          studyTimeHours: rawData.studyTimeHours || 0
        };

        const [isActive, daysLeft, status] = determineSubscriptionStatus(data.subscriptionData);

        if (data.subscriptionData.status !== status) {
          const updatedData: UserData = {
            ...data,
            subscriptionData: {
              ...data.subscriptionData,
              status
            }
          };
          
          await setDoc(userDocRef, updatedData, { merge: true });
          setUserData(updatedData);
        } else {
          setUserData(data);
        }

        setIsSubscriptionActive(isActive);
        setDaysLeftInSubscription(daysLeft);

      } else {
        const now = new Date();
        const initialUserData: UserData = {
          subscriptionData: {
            status: 'trial',
            trialStartDate: now,
            subscriptionEndDate: null,
          },
          files: [],
          questionsGenerated: 0,
          studyTimeHours: 0,
        };

        await setDoc(userDocRef, initialUserData);
        setUserData(initialUserData);
        setIsSubscriptionActive(true);
        setDaysLeftInSubscription(TRIAL_DURATION_DAYS);

        const studyMaterialsRef = collection(db, 'study_materials');
        await addDoc(studyMaterialsRef, {
          userId: user.uid,
          title: 'Welcome to ExamVault',
          createdAt: now,
          fileUrl: 'https://example.com/welcome-guide.pdf',
        });
      }
    } else {
      setUserData(null);
      setIsSubscriptionActive(false);
      setDaysLeftInSubscription(0);
    }
  }, [user]);
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setIsSubscriptionActive(false);
      setDaysLeftInSubscription(0);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshUserData();
      } else {
        setUserData(null);
        setIsSubscriptionActive(false);
        setDaysLeftInSubscription(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshUserData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshUserData();
      } else {
        setUserData(null);
        setIsSubscriptionActive(false);
        setDaysLeftInSubscription(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshUserData]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      refreshUserData,
      isSubscriptionActive,
      daysLeftInSubscription,
      logout // Add logout function to the context
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);