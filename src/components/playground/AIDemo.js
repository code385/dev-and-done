'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

export default function AIDemo() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    setOutput('');

    try {
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        if (data.isDemo) {
          toast.info('Demo mode - configure API key for full AI capabilities');
        }
      } else {
        toast.error(data.error || 'Failed to process text');
        setOutput(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Network error. Please try again.');
      setOutput('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">AI Tool Demo</h3>
      <div className="space-y-4">
        <Input
          label="Enter text to process"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: 'Summarize this text' or 'Translate to Spanish'"
        />
        <Button 
          onClick={handleProcess} 
          variant="primary"
          disabled={isProcessing || !input.trim()}
        >
          {isProcessing ? 'Processing...' : 'Process with AI'}
        </Button>
        {output && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Output:</p>
            <p className="whitespace-pre-wrap">{output}</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY 
            ? 'Powered by Google AI Studio' 
            : 'This is a demonstration. Full AI capabilities are available when API key is configured.'}
        </p>
      </div>
    </Card>
  );
}

