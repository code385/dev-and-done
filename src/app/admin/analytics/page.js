'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import FunnelChart from '@/components/admin/analytics/FunnelChart';
import JourneyMap from '@/components/admin/analytics/JourneyMap';
import EventTracker from '@/components/admin/analytics/EventTracker';
import ExportButton from '@/components/admin/analytics/ExportButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [funnelData, setFunnelData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAnalytics();
      fetchFunnel();
      fetchJourney();
    }
  }, [dateRange, selectedEventType, loading]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (!data.success) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (selectedEventType) params.append('eventType', selectedEventType);

      const response = await fetch(`/api/analytics?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const fetchFunnel = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/analytics/funnel?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFunnelData(data);
      }
    } catch (error) {
      console.error('Error fetching funnel:', error);
    }
  };

  const fetchJourney = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/analytics/journey?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setJourneyData(data.data);
      }
    } catch (error) {
      console.error('Error fetching journey:', error);
    }
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <Spinner />
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track user behavior and conversions</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <ExportButton
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              eventType={selectedEventType}
            />
          </div>
        </div>

        {/* Date Range Selector */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setDateRange({
                  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                });
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDateRange({
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                });
              }}
            >
              Last 30 Days
            </Button>
          </div>
        </Card>

        {/* Summary Stats */}
        {analyticsData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Events</div>
              <div className="text-3xl font-bold">{analyticsData.summary.totalEvents.toLocaleString()}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Unique Sessions</div>
              <div className="text-3xl font-bold">{analyticsData.summary.uniqueSessions.toLocaleString()}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Average Events per Session</div>
              <div className="text-3xl font-bold">
                {analyticsData.summary.uniqueSessions > 0
                  ? Math.round((analyticsData.summary.totalEvents / analyticsData.summary.uniqueSessions) * 100) / 100
                  : 0}
              </div>
            </Card>
          </div>
        )}

        {/* Page Views Chart */}
        {analyticsData?.pageViews && analyticsData.pageViews.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Page Views Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="count" stroke="#604dc3" strokeWidth={2} />
                <Line type="monotone" dataKey="uniqueSessions" stroke="#7c6dd8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Event Counts */}
        {analyticsData?.eventCounts && analyticsData.eventCounts.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Events by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.eventCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#604dc3" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Funnel Analysis */}
        {funnelData && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Conversion Funnel</h2>
            {funnelData.summary && (
              <div className="mb-4 text-sm text-muted-foreground">
                Overall Conversion Rate: <span className="font-semibold">{funnelData.summary.overallConversionRate}%</span>
              </div>
            )}
            <FunnelChart data={funnelData.funnel || []} />
          </Card>
        )}

        {/* User Journey */}
        {journeyData && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">User Journey Map</h2>
            {journeyData.summary && (
              <div className="mb-4 text-sm text-muted-foreground">
                Average Path Length: <span className="font-semibold">{journeyData.summary.averagePathLength}</span> pages
              </div>
            )}
            <JourneyMap data={journeyData.commonPaths || []} />
          </Card>
        )}

        {/* Event Tracker */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Event Tracking</h2>
          <EventTracker onEventTypeChange={setSelectedEventType} />
        </Card>
      </div>
    </Section>
  );
}


