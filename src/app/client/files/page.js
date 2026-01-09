import { redirect } from 'next/navigation';
import { getCurrentClient } from '@/lib/auth/client-auth';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';
import { FileText, Download, Upload, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import FilesPageClient from './FilesPageClient';

export const metadata = {
  title: 'Files - Client Portal',
  description: 'Manage and share project files',
};

export default async function ClientFilesPage() {
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

  // Fetch all projects and their files
  const projects = await ProjectModel.getProjectsByClientId(client._id.toString());
  
  const filesWithProjects = await Promise.all(
    projects.map(async (project) => {
      const files = await ProjectFileModel.getFilesByProjectId(project._id.toString());
      return { project, files };
    })
  );

  // Serialize projects for client component
  const serializedProjects = projects.map((project) => ({
    _id: project._id.toString(),
    title: project.title,
    description: project.description || '',
    status: project.status,
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
    createdAt: project.createdAt ? project.createdAt.toISOString() : null,
    updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
  }));

  const allFiles = filesWithProjects.flatMap(({ project, files }) =>
    files.map(file => ({
      _id: file._id.toString(),
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileType: file.fileType || '',
      fileSize: file.fileSize || 0,
      uploadedBy: file.uploadedBy || '',
      projectTitle: project.title,
      projectId: project._id.toString(),
      createdAt: file.createdAt ? file.createdAt.toISOString() : null,
      updatedAt: file.updatedAt ? file.updatedAt.toISOString() : null,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">File Management</h1>
          <p className="text-muted-foreground">
            Upload, view, and manage files across all your projects
          </p>
        </div>

        {/* Upload Section - Client Component */}
        {serializedProjects.length > 0 && (
          <FilesPageClient projects={serializedProjects} />
        )}

        {/* Files List */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            All Files ({allFiles.length})
          </h2>

          {allFiles.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No files yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload files to share with your team or view files shared by admins.
              </p>
              {projects.length === 0 && (
                <Link href="/client/dashboard">
                  <button className="text-primary hover:underline">
                    View your projects →
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {allFiles.map((file) => (
                <div
                  key={file._id.toString()}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 truncate">
                          {file.fileName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <Link
                            href={`/client/projects/${file.projectId}`}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <FolderKanban className="w-4 h-4" />
                            {file.projectTitle}
                          </Link>
                          <span>•</span>
                          <span>
                            {file.uploadedBy === 'client' ? 'Uploaded by you' : 'Uploaded by admin'}
                          </span>
                          <span>•</span>
                          <span>
                            {format(new Date(file.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {file.fileSize > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

