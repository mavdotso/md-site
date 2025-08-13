'use client';

import { useState } from 'react';
import { ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Site {
  name: string;
  url: string;
  updatedAt: string;
  size: number;
}

interface SiteListProps {
  sites: Site[];
  onDelete: (siteName: string) => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function SiteList({ sites, onDelete, onRefresh, isLoading = false }: SiteListProps) {
  const [deletingSite, setDeletingSite] = useState<string | null>(null);

  const handleDelete = async (siteName: string) => {
    if (confirm(`Are you sure you want to delete ${siteName}?`)) {
      setDeletingSite(siteName);
      try {
        await onDelete(siteName);
      } finally {
        setDeletingSite(null);
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Published Sites</h2>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No sites published yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Upload a markdown file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map((site) => (
            <div
              key={site.name}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-medium text-lg">{site.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {site.url}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <span>Updated: {new Date(site.updatedAt).toLocaleDateString()}</span>
                  <span>Size: {formatSize(site.size)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(site.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(site.name)}
                  disabled={deletingSite === site.name}
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  {deletingSite === site.name ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}