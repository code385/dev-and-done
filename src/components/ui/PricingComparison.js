'use client';

import { pricingPackages } from '@/data/pricing';
import { Check } from 'lucide-react';

export default function PricingComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-semibold">Features</th>
            {pricingPackages.map((pkg) => (
              <th key={pkg.id} className="text-center p-4 font-semibold">
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="p-4">Price</td>
            {pricingPackages.map((pkg) => (
              <td key={pkg.id} className="p-4 text-center">
                {pkg.price}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border">
            <td className="p-4">Pages</td>
            <td className="p-4 text-center">Up to 5</td>
            <td className="p-4 text-center">Up to 15</td>
            <td className="p-4 text-center">Unlimited</td>
          </tr>
          <tr className="border-b border-border">
            <td className="p-4">Support</td>
            <td className="p-4 text-center">1 month</td>
            <td className="p-4 text-center">3 months</td>
            <td className="p-4 text-center">6+ months</td>
          </tr>
          <tr className="border-b border-border">
            <td className="p-4">Custom Design</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">
              <Check className="w-5 h-5 text-primary mx-auto" />
            </td>
            <td className="p-4 text-center">
              <Check className="w-5 h-5 text-primary mx-auto" />
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="p-4">Advanced SEO</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">
              <Check className="w-5 h-5 text-primary mx-auto" />
            </td>
            <td className="p-4 text-center">
              <Check className="w-5 h-5 text-primary mx-auto" />
            </td>
          </tr>
          <tr>
            <td className="p-4">Dedicated Manager</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">
              <Check className="w-5 h-5 text-primary mx-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

