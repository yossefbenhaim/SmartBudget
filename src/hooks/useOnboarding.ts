import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useOnboarding() {
  const [runTour, setRunTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getOnboardingStatus, completeOnboarding } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await getOnboardingStatus();
        setRunTour(!completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setRunTour(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [getOnboardingStatus]);

  const handleTourComplete = async () => {
    setRunTour(false);
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return {
    runTour,
    isLoading,
    handleTourComplete,
  };
}
