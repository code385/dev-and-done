'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import EstimatorForm from './EstimatorForm';
import EstimatorResults from './EstimatorResults';
import Section from '../ui/Section';
import Spinner from '../ui/Spinner';

export default function ProjectEstimator() {
  const [estimate, setEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (answers) => {
    // #region agent log
    if(typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:14',message:'handleComplete called',data:{answers,answersKeys:Object.keys(answers),answersCount:Object.keys(answers).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    setIsLoading(true);
    try {
      const response = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      // #region agent log
      if(typeof window !== 'undefined') {
        const contentType = response.headers.get('content-type');
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:23',message:'API response received',data:{ok:response.ok,status:response.status,contentType,hasJson:contentType?.includes('application/json')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      }
      // #endregion

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData = {};
        if (contentType?.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const text = await response.text().catch(() => '');
          // #region agent log
          if(typeof window !== 'undefined') {
            fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:32',message:'Non-JSON error response',data:{status:response.status,textPreview:text.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          }
          // #endregion
        }
        throw new Error(errorData.error || 'Failed to generate estimate');
      }

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // #region agent log
        if(typeof window !== 'undefined') {
          fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:44',message:'Non-JSON success response',data:{textPreview:text.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        }
        // #endregion
        throw new Error('Invalid response format from server');
      }
      
      // #region agent log
      if(typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:51',message:'Estimate data received',data:{hasPriceRange:!!data.priceRange,hasTimeline:!!data.timeline,hasTechStack:!!data.suggestedTechStack,estimateKeys:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion
      setEstimate(data);
      toast.success('Estimate generated successfully!');
    } catch (error) {
      // #region agent log
      if(typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectEstimator.js:57',message:'Estimation error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      }
      // #endregion
      console.error('Estimation error:', error);
      toast.error(error.message || 'Error generating estimate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEstimate(null);
  };

  if (isLoading) {
    return (
      <Section className="pt-24">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-muted-foreground">Analyzing your project...</p>
        </div>
      </Section>
    );
  }

  if (estimate) {
    return (
      <Section className="pt-24">
        <EstimatorResults estimate={estimate} />
        <div className="text-center mt-8">
          <button
            onClick={handleReset}
            className="text-primary hover:underline"
          >
            Start Over
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Project Estimator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions about your project, and we'll provide an instant estimate 
          for timeline and budget.
        </p>
      </div>
      <EstimatorForm onComplete={handleComplete} />
    </Section>
  );
}

