'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, FolderKanban, FileText, Upload, Download, User, Building2, CheckCircle2, Clock, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id || '';

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
  });
  const [fileForm, setFileForm] = useState({
    fileName: '',
    fileUrl: '',
    fileType: 'other',
    fileSize: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchProjectData();
  }, [projectId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (!data.success) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch milestones with cache busting
      const milestonesUrl = `/api/admin/milestones?projectId=${projectId}&_t=${Date.now()}`;
      
      const [projectRes, milestonesRes, filesRes] = await Promise.all([
        fetch(`/api/admin/projects/${projectId}`),
        fetch(milestonesUrl),
        fetch(`/api/admin/files?projectId=${projectId}`),
      ]);

      const projectData = await projectRes.json();
      const milestonesData = await milestonesRes.json();
      const filesData = await filesRes.json();

      if (projectData.success) {
        setProject(projectData.project);
      } else {
        console.error('Failed to fetch project:', projectData.error);
      }
      
      if (milestonesData.success) {
        const milestoneList = milestonesData.milestones || [];
        console.log('Fetched milestones:', milestoneList.length, milestoneList);
        setMilestones(milestoneList);
      } else {
        console.error('Failed to fetch milestones:', milestonesData);
        setMilestones([]);
      }
      
      if (filesData.success) {
        setFiles(filesData.files || []);
      } else {
        console.error('Failed to fetch files:', filesData.error);
        setFiles([]);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMilestone
        ? `/api/admin/milestones/${editingMilestone.id}`
        : '/api/admin/milestones';
      const method = editingMilestone ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...milestoneForm,
          projectId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingMilestone ? 'Milestone updated' : 'Milestone created');
        setShowMilestoneModal(false);
        setEditingMilestone(null);
        setMilestoneForm({ title: '', description: '', dueDate: '', status: 'pending' });
        // Wait a bit before fetching to ensure database is updated
        setTimeout(() => {
          fetchProjectData();
        }, 100);
      } else {
        toast.error(data.error || 'Failed to save milestone');
        console.error('Milestone save error:', data);
      }
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast.error('Failed to save milestone');
    }
  };

  const handleMilestoneDelete = async (milestoneId) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Milestone deleted');
        fetchProjectData();
      } else {
        toast.error(data.error || 'Failed to delete milestone');
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fileForm,
          projectId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('File added');
        setShowFileModal(false);
        setFileForm({ fileName: '', fileUrl: '', fileType: 'other', fileSize: 0 });
        fetchProjectData();
      } else {
        toast.error(data.error || 'Failed to add file');
      }
    } catch (error) {
      console.error('Error adding file:', error);
      toast.error('Failed to add file');
    }
  };

  const handleFileDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('File deleted');
        fetchProjectData();
      } else {
        toast.error(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'on-hold':
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Section>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </Section>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Section>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Project not found</p>
            <Link href="/admin/projects">
              <Button variant="outline" className="mt-4">
                Back to Projects
              </Button>
            </Link>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Section>
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/projects">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{project.clientName}</span>
                </div>
                {project.clientCompany && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{project.clientCompany}</span>
                  </div>
                )}
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(project.startDate), 'MMM d, yyyy')}
                      {project.endDate && ` - ${format(new Date(project.endDate), 'MMM d, yyyy')}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Milestones {milestones && milestones.length > 0 && `(${milestones.length})`}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchProjectData}
                  title="Refresh milestones"
                >
                  ↻
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingMilestone(null);
                    setMilestoneForm({ title: '', description: '', dueDate: '', status: 'pending' });
                    setShowMilestoneModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </div>

            {!milestones || milestones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No milestones yet</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Click "Add Milestone" to create one
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="bg-background border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        {getMilestoneIcon(milestone.status)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMilestone(milestone);
                            setMilestoneForm({
                              title: milestone.title,
                              description: milestone.description || '',
                              dueDate: milestone.dueDate ? format(new Date(milestone.dueDate), 'yyyy-MM-dd') : '',
                              status: milestone.status,
                            });
                            setShowMilestoneModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMilestoneDelete(milestone.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                        {milestone.status}
                      </span>
                      {milestone.dueDate && (
                        <span>
                          Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Files Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Files</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFileForm({ fileName: '', fileUrl: '', fileType: 'other', fileSize: 0 });
                  setShowFileModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add File
              </Button>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No files yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-background border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{file.fileName}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>
                              {file.uploadedBy === 'client' ? 'Uploaded by client' : 'Uploaded by admin'}
                            </span>
                            {file.createdAt && (
                              <>
                                <span>•</span>
                                <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
                              </>
                            )}
                            {file.fileSize > 0 && (
                              <>
                                <span>•</span>
                                <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary hover:bg-primary/10 rounded"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileDelete(file.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Milestone Modal */}
        {showMilestoneModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
                </h2>
                <button
                  onClick={() => {
                    setShowMilestoneModal(false);
                    setEditingMilestone(null);
                    setMilestoneForm({ title: '', description: '', dueDate: '', status: 'pending' });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={milestoneForm.dueDate}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status *
                    </label>
                    <select
                      value={milestoneForm.status}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingMilestone ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowMilestoneModal(false);
                      setEditingMilestone(null);
                      setMilestoneForm({ title: '', description: '', dueDate: '', status: 'pending' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* File Modal */}
        {showFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Add File</h2>
                <button
                  onClick={() => {
                    setShowFileModal(false);
                    setFileForm({ fileName: '', fileUrl: '', fileType: 'other', fileSize: 0 });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    File Name *
                  </label>
                  <input
                    type="text"
                    value={fileForm.fileName}
                    onChange={(e) => setFileForm({ ...fileForm, fileName: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    File URL *
                  </label>
                  <input
                    type="url"
                    value={fileForm.fileUrl}
                    onChange={(e) => setFileForm({ ...fileForm, fileUrl: e.target.value })}
                    required
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      File Type
                    </label>
                    <select
                      value={fileForm.fileType}
                      onChange={(e) => setFileForm({ ...fileForm, fileType: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="document">Document</option>
                      <option value="image">Image</option>
                      <option value="code">Code</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      File Size (bytes)
                    </label>
                    <input
                      type="number"
                      value={fileForm.fileSize}
                      onChange={(e) => setFileForm({ ...fileForm, fileSize: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Add File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowFileModal(false);
                      setFileForm({ fileName: '', fileUrl: '', fileType: 'other', fileSize: 0 });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </Section>
    </div>
  );
}

