'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FunnelChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No funnel data available
      </div>
    );
  }

  const colors = ['#604dc3', '#7c6dd8', '#9a8ded', '#b8adff', '#d6cdff'];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="step" type="category" width={100} />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'count') return [value, 'Count'];
              if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate'];
              if (name === 'dropOffRate') return [`${value}%`, 'Drop-off Rate'];
              return value;
            }}
          />
          <Bar dataKey="count" fill="#604dc3" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Funnel Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((step, index) => (
          <div key={step.step} className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">{step.step}</div>
            <div className="text-2xl font-bold">{step.count}</div>
            {index > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {step.conversionRate}% conversion
                {step.dropOffRate > 0 && ` • ${step.dropOffRate}% drop-off`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


