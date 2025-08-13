'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFileSelect: (file: File, siteName: string) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [siteName, setSiteName] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.md')) {
      setFile(file);
      setError('');
      // Auto-generate site name from filename
      const defaultName = file.name.replace('.md', '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
      setSiteName(defaultName);
    } else {
      setError('Please upload a markdown (.md) file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
  });

  const handlePublish = () => {
    if (file && siteName) {
      if (!/^[a-z0-9-]+$/.test(siteName)) {
        setError('Site name can only contain lowercase letters, numbers, and hyphens');
        return;
      }
      onFileSelect(file, siteName);
    }
  };

  const clearFile = () => {
    setFile(null);
    setSiteName('');
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop your markdown file here...</p>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">
                Drag & drop your markdown file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to select a file
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label htmlFor="siteName" className="block text-sm font-medium mb-2">
              Site Name (subdomain)
            </label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value.toLowerCase())}
              placeholder="my-awesome-site"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your site will be available at {siteName || 'site-name'}.markdownsite.xyz
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handlePublish}
              disabled={!siteName}
              className="flex-1"
            >
              Publish Site
            </Button>
            <Button
              onClick={clearFile}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}