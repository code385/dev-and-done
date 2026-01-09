'use client';

import { useState } from 'react';
import FileUpload from '@/components/client/FileUpload';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FilesPageClient({ projects }) {
  // Projects are already serialized from server component
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?._id || ''
  );
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.refresh();
  };

  if (projects.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        Upload New File
      </h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Project
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
        {selectedProjectId && (
          <FileUpload projectId={selectedProjectId} onUploadSuccess={handleUploadSuccess} />
        )}
      </div>
    </div>
  );
}

