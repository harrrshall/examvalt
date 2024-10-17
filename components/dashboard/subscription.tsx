'use client';

import React, { useState, useEffect } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { Clock, Brain, Timer, AlertTriangle } from 'lucide-react';
import DotPattern from '@/components/ui/dot-pattern';
import { useAuth } from '@/lib/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function SubscriptionDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { isSubscriptionActive, daysLeftInSubscription, userData } = useAuth();
  const router = useRouter();

  const getPlanStatus = () => {
    if (!userData) return 'No Plan';
    
    switch (userData.subscriptionData.status) {
      case 'trial':
        return 'Free Trial';
      case 'active':
        return 'Premium Plan';
      case 'expired':
        return 'Trial Expired';
      default:
        return 'No Plan';
    }
  };

  const handleUpgrade = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShouldNavigate(true);
  };

  useEffect(() => {
    if (shouldNavigate) {
      router.push('/payment');
    }
  }, [shouldNavigate, router]);

  const getStatusAlert = () => {
    if (!userData) return null;

    switch (userData.subscriptionData.status) {
      case 'trial':
        return (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your free trial expires in {daysLeftInSubscription} day{daysLeftInSubscription !== 1 ? 's' : ''}
            </AlertDescription>
          </Alert>
        );
      case 'active':
        return (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your premium subscription is active. {daysLeftInSubscription} day{daysLeftInSubscription !== 1 ? 's' : ''} remaining
            </AlertDescription>
          </Alert>
        );
      case 'expired':
        return (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              Your trial has expired. Upgrade now to continue using all features.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${inter.className} flex h-screen bg-gray-50 relative overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <DotPattern
          width={22}
          height={22}
          cx={2}
          cy={2}
          cr={1}
          className="text-gray-200"
        />
      </div>
      
      <div className="flex-1 overflow-auto z-10">
        <main className="p-6 max-w-6xl mx-auto">
          {/* Trial Status Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500">Current Plan</h2>
                <p className={`${playfair.className} text-2xl font-bold`}>
                  {getPlanStatus()}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-semibold text-gray-500">Premium Plan</h2>
                <p className={`${playfair.className} text-2xl font-bold`}>₹549<span className="text-sm font-normal text-gray-500">/3mo</span></p>
              </div>
            </div>

            {getStatusAlert()}

            <button
              onClick={handleUpgrade}
              disabled={userData?.subscriptionData.status === 'active'}
              className={`${inter.className} w-full px-4 py-3 font-semibold text-white ${
                userData?.subscriptionData.status === 'active' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              } rounded-md transition-colors duration-200`}
            >
              {isLoading 
                ? 'Processing...' 
                : userData?.subscriptionData.status === 'active'
                  ? 'Currently Active'
                  : 'Upgrade to Premium'
              }
            </button>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${playfair.className} text-lg font-semibold mb-6`}>Your Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Questions Generated */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-sm font-semibold">Questions Generated</h3>
                  </div>
                  <span className="text-sm font-medium">
                    {userData?.questionsGenerated || 0} / {isSubscriptionActive ? '50' : '0'}
                  </span>
                </div>
                <Progress 
                  value={((userData?.questionsGenerated || 0) / 50) * 100} 
                  className="h-2"
                />
              </div>

              {/* Study Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-sm font-semibold">Study Time</h3>
                  </div>
                  <span className="text-sm font-medium">
                    {userData?.studyTimeHours || 0} hours
                  </span>
                </div>
                <Progress 
                  value={((userData?.studyTimeHours || 0) / 10) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Premium Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Unlimited Questions</h3>
                  <p className="text-sm text-gray-500">Generate as many practice questions as you need</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Timer className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Performance Tracking</h3>
                  <p className="text-sm text-gray-500">Detailed analytics and progress tracking</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}