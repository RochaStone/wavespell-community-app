'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BirthData } from '@/lib/sidereal-astrology';
import { CosmicContainer, CosmicCard, CosmicButton, CosmicText, StarField, GlowingOrb, FloatingElement } from '@/components/ui/CosmicTheme';

// Dynamic imports for better performance
const BirthDataForm = dynamic(() => import('@/components/BirthDataForm'), { ssr: false });
const PersonalizedBirthChart = dynamic(() => import('@/components/PersonalizedBirthChart'), { ssr: false });
const WavespellVisualization = dynamic(() => import('@/components/WavespellVisualization'), { ssr: false });
const SubscriptionManager = dynamic(() => import('@/components/SubscriptionManager'), { ssr: false });

type AppView = 'welcome' | 'birth-form' | 'daily-wavespell' | 'birth-chart' | 'subscription';

interface UserProfile {
  hasCompletedProfile: boolean;
  birthData?: BirthData;
  subscriptionTier: 'free' | 'premium' | 'new_earth_pioneer';
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    hasCompletedProfile: false,
    subscriptionTier: 'free'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user profile
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      // In a real app, this would fetch from Firebase
      const savedProfile = localStorage.getItem('wavespell-user-profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.birthData) {
            profile.birthData.date = new Date(profile.birthData.date);
          }
          setUserProfile(profile);
          if (profile.hasCompletedProfile) {
            setCurrentView('daily-wavespell');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      
      setIsLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleBirthDataSubmit = (birthData: BirthData) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      hasCompletedProfile: true,
      birthData
    };
    
    setUserProfile(updatedProfile);
    localStorage.setItem('wavespell-user-profile', JSON.stringify(updatedProfile));
    setCurrentView('birth-chart');
  };

  const renderWelcomeScreen = () => (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden flex items-center justify-center">
      {/* Cosmic background effects */}
      <StarField density={120} animated={true} />
      <GlowingOrb size={400} color="rgba(147, 51, 234, 0.3)" className="top-0 left-0" />
      <GlowingOrb size={300} color="rgba(59, 130, 246, 0.2)" className="bottom-0 right-0" />
      <GlowingOrb size={200} color="rgba(236, 72, 153, 0.15)" className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <FloatingElement>
          <div className="mb-8">
            <CosmicText variant="primary" size="2xl" className="text-6xl md:text-8xl font-bold mb-6">
              ✨ Wavespell Community ✨
            </CosmicText>
            <CosmicText variant="secondary" size="xl" className="text-2xl md:text-3xl">
              Where Ancient Wisdom Meets Cosmic Technology
            </CosmicText>
          </div>
        </FloatingElement>

        <CosmicContainer variant="ethereal" className="p-8 mb-8">
          <p className="text-xl text-purple-100 leading-relaxed mb-6">
            Discover your galactic signature, explore sidereal astrology, and connect with a community 
            synchronized to the rhythms of the Dreamspell calendar. Journey through 13 moons, 
            20 wavespells, and 260 kin as you unlock the mysteries of galactic time.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <CosmicCard title="🌀 Dreamspell Calendar" className="text-center">
              <p className="text-purple-200 text-sm">
                Track your galactic signature through the 260-day Dreamspell cycle and discover 
                your place in the cosmic order.
              </p>
            </CosmicCard>

            <CosmicCard title="⭐ Sidereal Astrology" className="text-center">
              <p className="text-purple-200 text-sm">
                Explore your authentic birth chart using sidereal calculations, revealing your 
                true celestial blueprint.
              </p>
            </CosmicCard>

            <CosmicCard title="🌟 Sacred Community" className="text-center">
              <p className="text-purple-200 text-sm">
                Connect with others who share your wavespell, discover oracle relationships, 
                and grow together in cosmic wisdom.
              </p>
            </CosmicCard>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            {userProfile.hasCompletedProfile ? (
              <>
                <CosmicButton
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentView('daily-wavespell')}
                >
                  🌟 View Today's Wavespell
                </CosmicButton>
                <CosmicButton
                  variant="secondary"
                  size="lg"
                  onClick={() => setCurrentView('birth-chart')}
                >
                  🔮 My Birth Chart
                </CosmicButton>
              </>
            ) : (
              <CosmicButton
                variant="primary"
                size="lg"
                onClick={() => setCurrentView('birth-form')}
              >
                ✨ Begin Your Cosmic Journey ✨
              </CosmicButton>
            )}
          </div>
        </CosmicContainer>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          <CosmicButton
            variant="ethereal"
            onClick={() => setCurrentView('daily-wavespell')}
          >
            📅 Daily Wavespell
          </CosmicButton>
          <CosmicButton
            variant="ethereal"
            onClick={() => setCurrentView('subscription')}
          >
            💫 Premium Features
          </CosmicButton>
          {userProfile.hasCompletedProfile && (
            <CosmicButton
              variant="ethereal"
              onClick={() => setCurrentView('birth-form')}
            >
              ⚙️ Update Profile
            </CosmicButton>
          )}
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="fixed top-6 left-6 right-6 z-50">
      <CosmicContainer variant="secondary" className="p-4">
        <div className="flex items-center justify-between">
          <CosmicButton
            variant="ethereal"
            size="sm"
            onClick={() => setCurrentView('welcome')}
          >
            🏠 Home
          </CosmicButton>

          <div className="flex space-x-2">
            <CosmicButton
              variant="ethereal"
              size="sm"
              onClick={() => setCurrentView('daily-wavespell')}
            >
              📅 Daily
            </CosmicButton>
            {userProfile.hasCompletedProfile && (
              <CosmicButton
                variant="ethereal"
                size="sm"
                onClick={() => setCurrentView('birth-chart')}
              >
                🔮 Chart
              </CosmicButton>
            )}
            <CosmicButton
              variant="ethereal"
              size="sm"
              onClick={() => setCurrentView('subscription')}
            >
              💫 Premium
            </CosmicButton>
          </div>
        </div>
      </CosmicContainer>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <StarField density={50} animated={true} />
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-6"></div>
            <CosmicText variant="ethereal" size="lg">
              Aligning with cosmic frequencies...
            </CosmicText>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'welcome':
        return renderWelcomeScreen();
      
      case 'birth-form':
        return (
          <div className="pt-24">
            <BirthDataForm
              onSubmit={handleBirthDataSubmit}
              initialData={userProfile.birthData}
            />
          </div>
        );
      
      case 'daily-wavespell':
        return (
          <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <StarField density={60} animated={true} />
            <div className="relative z-10 container mx-auto px-6 py-8">
              <WavespellVisualization />
            </div>
          </div>
        );
      
      case 'birth-chart':
        return userProfile.birthData ? (
          <div className="pt-24">
            <PersonalizedBirthChart
              birthData={userProfile.birthData}
              isPaidTier={userProfile.subscriptionTier !== 'free'}
            />
          </div>
        ) : (
          <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <CosmicContainer variant="primary" className="p-8 text-center">
              <CosmicText variant="accent" size="xl">
                Birth Data Required
              </CosmicText>
              <p className="text-purple-200 mt-4 mb-6">
                Please complete your birth data to view your personalized chart.
              </p>
              <CosmicButton
                variant="primary"
                onClick={() => setCurrentView('birth-form')}
              >
                Complete Profile
              </CosmicButton>
            </CosmicContainer>
          </div>
        );
      
      case 'subscription':
        return (
          <div className="pt-24">
            <SubscriptionManager
              userId="demo-user" // Replace with actual user ID
              currentSubscription={null}
            />
          </div>
        );
      
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <>
      {currentView !== 'welcome' && renderNavigation()}
      {renderContent()}
    </>
  );
}
