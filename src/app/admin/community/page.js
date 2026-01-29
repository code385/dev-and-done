'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, XCircle, Ban, Unlock, Pin, Unpin, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCommunityPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingReports: 0,
    totalReports: 0,
    resolvedReports: 0,
  });

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/community/reports?status=pending&limit=10');
      const data = await response.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch('/api/admin/community/reports?status=pending'),
        fetch('/api/admin/community/reports'),
      ]);
      
      const pendingData = await pendingRes.json();
      const allData = await allRes.json();

      if (pendingData.success && allData.success) {
        setStats({
          pendingReports: pendingData.pagination?.total || 0,
          totalReports: allData.pagination?.total || 0,
          resolvedReports: (allData.pagination?.total || 0) - (pendingData.pagination?.total || 0),
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleReportAction = async (reportId, status) => {
    try {
      const response = await fetch(`/api/admin/community/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Report ${status}`);
        fetchReports();
        fetchStats();
      } else {
        toast.error(data.error || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const getReasonColor = (reason) => {
    const colors = {
      spam: 'bg-red-500/10 text-red-500',
      harassment: 'bg-orange-500/10 text-orange-500',
      inappropriate: 'bg-yellow-500/10 text-yellow-500',
      'off-topic': 'bg-blue-500/10 text-blue-500',
      other: 'bg-gray-500/10 text-gray-500',
    };
    return colors[reason] || colors.other;
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Moderation</h1>
            <p className="text-muted-foreground">Manage reports and moderate community content</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Reports</p>
                <p className="text-3xl font-bold text-orange-500">{stats.pendingReports}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-500/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                <p className="text-3xl font-bold">{stats.totalReports}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-500">{stats.resolvedReports}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500/20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/community/reports">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold">All Reports</h3>
            </Card>
          </Link>
          <Link href="/admin/community/posts">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <Pin className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold">Manage Posts</h3>
            </Card>
          </Link>
          <Link href="/admin/community/users">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <Ban className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold">Manage Users</h3>
            </Card>
          </Link>
          <Link href="/admin/community/settings">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <Unlock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold">Settings</h3>
            </Card>
          </Link>
        </div>

        {/* Pending Reports */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Reports</h2>
            {loading ? (
              <div className="text-center py-12">
                <Spinner />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500/20" />
                <h3 className="text-xl font-bold mb-2">No pending reports</h3>
                <p className="text-muted-foreground">All reports have been reviewed!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report._id.toString()}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getReasonColor(report.reason)}`}>
                            {report.reason}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {report.targetType}
                          </span>
                        </div>
                        {report.description && (
                          <p className="text-sm text-foreground mb-2">{report.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Reported by {report.reporterEmail || 'Anonymous'} • {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report._id.toString(), 'resolved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report._id.toString(), 'dismissed')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

