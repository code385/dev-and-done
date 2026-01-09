'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function FileUpload({ projectId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Vercel Blob Storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to Vercel Blob
      const uploadResponse = await fetch('/api/client/files/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }

      const { url: fileUrl, fileName: uploadedFileName, fileType: uploadedFileType, fileSize: uploadedFileSize } = uploadData;

      // Save file record to database
      const response = await fetch('/api/client/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileName: uploadedFileName || file.name,
          fileUrl,
          fileType: uploadedFileType || getFileType(file.name),
          fileSize: uploadedFileSize || file.size,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('File uploaded successfully!');
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(data.error || 'Failed to save file record');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const docTypes = ['pdf', 'doc', 'docx', 'txt'];
    const codeTypes = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c'];

    if (imageTypes.includes(ext)) return 'image';
    if (docTypes.includes(ext)) return 'document';
    if (codeTypes.includes(ext)) return 'code';
    return 'other';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: 10MB
              </p>
            </div>
          </label>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
            <span className="text-sm font-medium text-foreground ml-auto">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

