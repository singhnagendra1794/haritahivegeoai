import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Harita Hive!',
    description: 'Let\'s take a quick tour of your GeoAI platform. You can skip this anytime.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'sidebar',
    title: 'Tools & Layers',
    description: 'Access all your spatial analysis tools and manage your map layers from this sidebar.',
    target: '[data-sidebar="sidebar"]',
    position: 'right'
  },
  {
    id: 'map',
    title: 'Interactive Map',
    description: 'This is your main workspace. Click and draw directly on the map to create polygons.',
    target: '[data-map="container"]',
    position: 'top'
  },
  {
    id: 'fab-draw',
    title: 'Drawing Tools',
    description: 'Use these floating buttons to quickly access drawing tools and create buffers.',
    target: '[data-fab="draw"]',
    position: 'left'
  },
  {
    id: 'topbar',
    title: 'Navigation & Profile',
    description: 'Access your dashboard, settings, and account options from the top bar.',
    target: 'header',
    position: 'bottom'
  }
];

interface OnboardingTooltipsProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

const OnboardingTooltips: React.FC<OnboardingTooltipsProps> = ({ 
  isFirstVisit, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isFirstVisit) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        setIsVisible(true);
        positionTooltip();
      }, 1000);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (isVisible) {
      positionTooltip();
    }
  }, [currentStep, isVisible]);

  const positionTooltip = () => {
    const step = onboardingSteps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) return;

    setTargetElement(element);

    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    
    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'top':
        top = rect.top - tooltipHeight - 16;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 16;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 16;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 16;
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

    setTooltipPosition({ top, left });

    // Add highlight to target element
    element.style.position = 'relative';
    element.style.zIndex = '60';
    element.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)';
    element.style.borderRadius = '8px';
    element.style.transition = 'all 0.3s ease';
  };

  const removeHighlight = () => {
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
      targetElement.style.borderRadius = '';
    }
  };

  const nextStep = () => {
    removeHighlight();
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    removeHighlight();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    removeHighlight();
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-60 w-80 bg-white border-2 border-forest-primary shadow-2xl"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-charcoal-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={skipTour}
              className="p-1 h-6 w-6 text-muted-foreground hover:text-charcoal-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-forest-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={skipTour}
              className="text-muted-foreground"
            >
              Skip tour
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={prevStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button 
                size="sm"
                onClick={nextStep}
                className="bg-forest-primary hover:bg-forest-primary/90"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OnboardingTooltips;