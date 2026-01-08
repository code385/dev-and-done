'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Link from 'next/link';
import { servicePricing } from '@/data/pricing';
import { services } from '@/data/services';

export default function PricingCalculator() {
  const [selectedService, setSelectedService] = useState('');
  const [packageType, setPackageType] = useState('starter');
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  const calculatePrice = () => {
    if (!selectedService) {
      setEstimatedPrice(null);
      return;
    }

    const pricing = servicePricing[selectedService];
    if (!pricing) {
      setEstimatedPrice(null);
      return;
    }

    const range = pricing[packageType];
    if (!range) {
      setEstimatedPrice(null);
      return;
    }

    if (range.max === null) {
      setEstimatedPrice(`$${range.min.toLocaleString()}+`);
    } else {
      setEstimatedPrice(`$${range.min.toLocaleString()} - $${range.max.toLocaleString()}`);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedService, packageType]);

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-6">Get a Quick Estimate</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Service Type</label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              calculatePrice();
            }}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Package Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['starter', 'professional', 'enterprise'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setPackageType(type);
                  calculatePrice();
                }}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  packageType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {estimatedPrice && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Estimated Price</p>
            <p className="text-2xl font-bold text-primary">{estimatedPrice}</p>
            <p className="text-xs text-muted-foreground mt-2">
              * Final price may vary based on specific requirements
            </p>
          </div>
        )}
        <Link href="/book-service">
          <Button variant="primary" className="w-full">
            Book a Consultation
          </Button>
        </Link>
      </div>
    </Card>
  );
}

