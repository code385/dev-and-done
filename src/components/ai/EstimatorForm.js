'use client';

import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const steps = [
  {
    id: 'projectType',
    title: 'Project Type',
    question: 'What type of project are you building?',
    type: 'select',
    options: [
      { value: 'web-app', label: 'Web Application' },
      { value: 'mobile-app', label: 'Mobile App' },
      { value: 'ai-solution', label: 'AI Solution' },
      { value: 'custom-software', label: 'Custom Software' },
    ],
  },
  {
    id: 'complexity',
    title: 'Complexity',
    question: 'How complex is your project?',
    type: 'select',
    options: [
      { value: 'simple', label: 'Simple - Basic features, standard requirements' },
      { value: 'medium', label: 'Medium - Some custom features, moderate complexity' },
      { value: 'complex', label: 'Complex - Advanced features, integrations required' },
      { value: 'enterprise', label: 'Enterprise - Large scale, multiple systems' },
    ],
  },
  {
    id: 'features',
    title: 'Features',
    question: 'What features do you need? (Select all that apply)',
    type: 'multiselect',
    options: [
      { value: 'user-auth', label: 'User Authentication' },
      { value: 'payments', label: 'Payment Integration' },
      { value: 'admin-panel', label: 'Admin Dashboard' },
      { value: 'api', label: 'REST/GraphQL API' },
      { value: 'real-time', label: 'Real-time Features' },
      { value: 'analytics', label: 'Analytics & Reporting' },
      { value: 'ai-features', label: 'AI/ML Features' },
      { value: 'mobile-responsive', label: 'Mobile Responsive' },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline',
    question: 'What is your preferred timeline?',
    type: 'select',
    options: [
      { value: 'flexible', label: 'Flexible - Quality over speed' },
      { value: 'standard', label: 'Standard - 2-4 months' },
      { value: 'urgent', label: 'Urgent - Need it fast' },
    ],
  },
];

export default function EstimatorForm({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const step = steps[currentStep];

  // #region agent log
  useEffect(() => {
    if(typeof window !== 'undefined') {
      try {
        const safeAnswers = {};
        Object.keys(answers || {}).forEach(key => {
          const value = answers[key];
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || Array.isArray(value)) {
            safeAnswers[key] = value;
          }
        });
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EstimatorForm.js:67',message:'Component render/step change',data:{currentStep,stepId:step.id,answersKeys:Object.keys(safeAnswers),missingAnswers:steps.filter(s => !safeAnswers[s.id]).map(s => s.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
      } catch (e) {
        // Silently fail logging if serialization fails
      }
    }
  }, [currentStep, answers]);
  // #endregion

  const handleNext = (answersToUse = null) => {
    const currentAnswers = answersToUse || answers;
    // #region agent log
    if(typeof window !== 'undefined') {
      try {
        const safeAnswers = {};
        Object.keys(currentAnswers || {}).forEach(key => {
          const value = currentAnswers[key];
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || Array.isArray(value)) {
            safeAnswers[key] = value;
          }
        });
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EstimatorForm.js:75',message:'handleNext called',data:{currentStep,stepsLength:steps.length,answersKeys:Object.keys(safeAnswers),answersCount:Object.keys(safeAnswers).length,allStepsHaveAnswers:steps.every(s => safeAnswers[s.id])},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      } catch (e) {
        // Silently fail logging if serialization fails
      }
    }
    // #endregion
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(currentAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value) => {
    // #region agent log
    if(typeof window !== 'undefined') {
      try {
        const safeAnswers = {};
        Object.keys(answers || {}).forEach(key => {
          const val = answers[key];
          if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || Array.isArray(val)) {
            safeAnswers[key] = val;
          }
        });
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EstimatorForm.js:106',message:'handleAnswer called',data:{value,stepId:step.id,stepType:step.type,currentStep,answersKeys:Object.keys(safeAnswers)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
      } catch (e) {
        // Silently fail logging if serialization fails
      }
    }
    // #endregion
    if (step.type === 'multiselect') {
      const current = answers[step.id] || [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [step.id]: newValue });
    } else {
      const updatedAnswers = { ...answers, [step.id]: value };
      setAnswers(updatedAnswers);
      // Auto-advance for single select (or submit if last step)
      setTimeout(() => {
        // #region agent log
        if(typeof window !== 'undefined') {
          try {
            const safeAnswers = {};
            Object.keys(updatedAnswers || {}).forEach(key => {
              const val = updatedAnswers[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || Array.isArray(val)) {
                safeAnswers[key] = val;
              }
            });
            fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EstimatorForm.js:118',message:'Auto-advance timeout executing',data:{currentStep,stepsLength:steps.length,isLastStep:currentStep === steps.length - 1,updatedAnswersKeys:Object.keys(safeAnswers)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
          } catch (e) {
            // Silently fail logging if serialization fails
          }
        }
        // #endregion
        // Always call handleNext with updated answers - it will advance or submit based on current step
        handleNext(updatedAnswers);
      }, 300);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const canProceed = step.type === 'multiselect' 
    ? (answers[step.id]?.length > 0)
    : answers[step.id];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">{step.title}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{step.question}</h2>

      <div className="space-y-3 mb-6">
        {step.options.map((option) => {
          const isSelected = step.type === 'multiselect'
            ? answers[step.id]?.includes(option.value)
            : answers[step.id] === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted hover:border-primary/50'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        {step.type === 'multiselect' && (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentStep === steps.length - 1 ? 'Get Estimate' : 'Next'}
          </Button>
        )}
      </div>
    </Card>
  );
}

