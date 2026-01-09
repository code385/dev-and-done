import { redirect } from 'next/navigation';
import { getCurrentClient } from '@/lib/auth/client-auth';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as MilestoneModel from '@/lib/mongodb/models/Milestone';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';
import ProjectCard from '@/components/client/ProjectCard';
import { Calendar, FileText, Target, FolderKanban } from 'lucide-react';

export const metadata = {
  title: 'Client Dashboard',
  description: 'View your projects, milestones, and files',
};

export default async function ClientDashboardPage() {
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

  // Fetch dashboard data
  const [projects, allMilestones, allFiles] = await Promise.all([
    ProjectModel.getProjectsByClientId(client._id.toString()),
    ProjectModel.getProjectsByClientId(client._id.toString()).then(async (projs) => {
      const milestonePromises = projs.map(p => 
        MilestoneModel.getMilestonesByProjectId(p._id.toString())
      );
      const milestones = await Promise.all(milestonePromises);
      return milestones.flat();
    }),
    ProjectModel.getProjectsByClientId(client._id.toString()).then(async (projs) => {
      const filePromises = projs.map(p => 
        ProjectFileModel.getFilesByProjectId(p._id.toString())
      );
      const files = await Promise.all(filePromises);
      return files.flat();
    }),
  ]);

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const activeMilestones = allMilestones.filter(m => m.status === 'in-progress').length;
  const recentFiles = allFiles.slice(0, 5);

  // Get recent projects and serialize them for client components
  const recentProjects = projects.slice(0, 6).map((project) => ({
    _id: project._id.toString(),
    title: project.title,
    description: project.description || '',
    status: project.status,
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
    createdAt: project.createdAt ? project.createdAt.toISOString() : null,
    updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {client.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your projects and progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeProjects}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Milestones</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeMilestones}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Recent Files</h3>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{recentFiles.length}</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Your Projects</h2>
            <a
              href="/client/files"
              className="text-sm text-primary hover:underline"
            >
              View All Files →
            </a>
          </div>

          {recentProjects.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground">
                Your projects will appear here once they're created.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

