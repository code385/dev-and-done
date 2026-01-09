import { redirect } from 'next/navigation';
import { getCurrentClient } from '@/lib/auth/client-auth';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as MilestoneModel from '@/lib/mongodb/models/Milestone';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';
import MilestoneTracker from '@/components/client/MilestoneTracker';
import FileUpload from '@/components/client/FileUpload';
import CommunicationHub from '@/components/client/CommunicationHub';
import { ArrowLeft, Calendar, FolderKanban, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await ProjectModel.getProjectById(id);
  return {
    title: project ? `${project.title} - Client Portal` : 'Project Not Found',
  };
}

export default async function ProjectDetailPage({ params }) {
  // Await params (Next.js 15 requirement)
  const { id } = await params;

  // Verify authentication
  let client;
  try {
    client = await getCurrentClient();
    if (!client) {
      redirect('/client/login');
    }
  } catch (error) {
    redirect('/client/login');
  }

  // Fetch project
  const project = await ProjectModel.getProjectById(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/client/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Verify client owns this project
  if (project.clientId.toString() !== client._id.toString()) {
    redirect('/client/dashboard');
  }

  // Fetch related data
  const [milestones, files] = await Promise.all([
    MilestoneModel.getMilestonesByProjectId(id),
    ProjectFileModel.getFilesByProjectId(id),
  ]);

  // Serialize milestones for client component
  const serializedMilestones = milestones.map((milestone) => ({
    id: milestone._id.toString(),
    _id: milestone._id.toString(),
    title: milestone.title,
    description: milestone.description || '',
    status: milestone.status,
    dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : null,
    createdAt: milestone.createdAt ? milestone.createdAt.toISOString() : null,
    updatedAt: milestone.updatedAt ? milestone.updatedAt.toISOString() : null,
  }));

  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'on-hold': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  const statusLabels = {
    active: 'Active',
    completed: 'Completed',
    'on-hold': 'On Hold',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[project.status] || statusColors.active}`}
                >
                  {statusLabels[project.status] || 'Active'}
                </span>
              </div>
              {project.description && (
                <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Started: {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'N/A'}
                  </span>
                </div>
                {project.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      End: {format(new Date(project.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestones Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Milestones</h2>
              </div>
              <MilestoneTracker milestones={serializedMilestones} />
            </div>

            {/* Files Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Files</h2>
                </div>
                <Link
                  href="/client/files"
                  className="text-sm text-primary hover:underline"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                <FileUpload projectId={id} />

                {files.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.slice(0, 5).map((file) => (
                      <a
                        key={file._id.toString()}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all group"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.uploadedBy === 'client' ? 'Uploaded by you' : 'Uploaded by admin'} •{' '}
                            {format(new Date(file.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Communication */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Communication</h2>
            </div>
            <CommunicationHub projectId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

