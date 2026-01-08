'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

export function BookingsChart({ data }) {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Bookings Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function BookingStatusChart({ data }) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Booking Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

