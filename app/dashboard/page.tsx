'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteList, Site } from '@/components/site-list';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSites: 0,
    totalSize: 0,
    lastUpdated: '',
  });

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
        
        // Calculate stats
        const totalSize = data.sites.reduce((acc: number, site: Site) => acc + site.size, 0);
        const lastUpdated = data.sites.length > 0 
          ? new Date(Math.max(...data.sites.map((s: Site) => new Date(s.updatedAt).getTime()))).toLocaleDateString()
          : 'N/A';
        
        setStats({
          totalSites: data.sites.length,
          totalSize,
          lastUpdated,
        });
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (siteName: string) => {
    try {
      const response = await fetch(`/api/sites/delete?siteName=${siteName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSites();
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Site Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your markdown sites
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            </Link>
            <Link href="/">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Sites
            </h3>
            <p className="text-3xl font-bold">{stats.totalSites}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Storage
            </h3>
            <p className="text-3xl font-bold">{formatSize(stats.totalSize)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Last Updated
            </h3>
            <p className="text-3xl font-bold">{stats.lastUpdated}</p>
          </div>
        </div>

        {/* Sites List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Published Sites</h2>
          </div>
          <div className="p-6">
            <SiteList
              sites={sites}
              onDelete={handleDelete}
              onRefresh={fetchSites}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}