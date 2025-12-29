'use client';

import Section from '@/components/ui/Section';
import ChatInterface from '@/components/ai/ChatInterface';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ChatPage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', company: '' });

  const handleLeadCapture = () => {
    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send lead data to backend
    console.log('Lead data:', leadData);
    alert('Thank you! We\'ll be in touch soon.');
    setShowLeadForm(false);
  };

  return (
    <Section className="pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Consultant
          </h1>
          <p className="text-lg text-muted-foreground">
            Chat with our AI consultant to learn about our services, get project estimates, or ask any questions.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ height: '600px' }}>
          <ChatInterface onLeadCapture={handleLeadCapture} />
        </div>

        {showLeadForm && (
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <Input
                label="Name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                required
              />
              <Input
                label="Company (Optional)"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
              />
              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowLeadForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Section>
  );
}

