'use client';

import { useState, useEffect } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { SiteList, Site } from '@/components/site-list';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sites/list');
      const data = await response.json();
      if (data.success) {
        setSites(data.sites);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File, siteName: string) => {
    setUploadStatus(null);
    
    // Read file for preview
    const content = await file.text();
    setPreviewContent(content);
    
    // Upload file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('siteName', siteName);

    try {
      const response = await fetch('/api/sites/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Site published successfully at ${data.url}`,
        });
        fetchSites(); // Refresh the list
      } else {
        setUploadStatus({
          type: 'error',
          message: data.error || 'Failed to upload site',
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Failed to upload site. Please try again.',
      });
    }
  };

  const handleDelete = async (siteName: string) => {
    try {
      const response = await fetch(`/api/sites/delete?siteName=${siteName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSites(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Markdown Site Hosting</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your markdown files and host them instantly as websites
          </p>
        </div>

        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              uploadStatus.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {uploadStatus.message}
          </div>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="sites">My Sites</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <UploadZone onFileSelect={handleFileSelect} />
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg">
              {previewContent ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Markdown Preview</h2>
                  <div className="border dark:border-gray-700 rounded-lg p-6">
                    <MarkdownPreview content={previewContent} />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Upload a markdown file to see preview
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sites" className="mt-6">
            <SiteList
              sites={sites}
              onDelete={handleDelete}
              onRefresh={fetchSites}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}