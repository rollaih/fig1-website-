'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { logout } from '@/lib/auth';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  publicPosts: number;
  privatePosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    archivedPosts: 0,
    publicPosts: 0,
    privatePosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?visibility=all');
      const result = await response.json();
      
      if (result.success) {
        const posts = result.data;
        
        // Calculate statistics
        const totalPosts = posts.length;
        const publishedPosts = posts.filter((post: any) => post.status === 'published').length;
        const draftPosts = posts.filter((post: any) => post.status === 'draft').length;
        const archivedPosts = posts.filter((post: any) => post.status === 'archived').length;
        const publicPosts = posts.filter((post: any) => post.visibility === 'public').length;
        const privatePosts = posts.filter((post: any) => post.visibility === 'private').length;
        
        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
          archivedPosts,
          publicPosts,
          privatePosts
        });
      } else {
        setError(result.error || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/Fig1_Finallogo.png"
                alt="Fig1 Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-light" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/blog"
                className="bg-transparent border border-[#D959B3] text-[#D959B3] px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white"
              >
                View Blog
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error loading dashboard</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchDashboardStats}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-6 w-8 rounded"></span>
                  ) : (
                    stats.totalPosts
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-6 w-8 rounded"></span>
                  ) : (
                    stats.publishedPosts
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-6 w-8 rounded"></span>
                  ) : (
                    stats.draftPosts
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <div className="flex items-center">
              <div className="p-2" style={{backgroundColor: '#F3E8FF'}}>
                <svg className="h-6 w-6" style={{color: '#D959B3'}} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3a3 3 0 003 3h3m-6-6h.01M9 21c0-1.657.895-3 2-3s2 1.343 2 3M15 21c0-1.657.895-3 2-3s2 1.343 2 3" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public Posts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-6 w-8 rounded"></span>
                  ) : (
                    stats.publicPosts
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Private Cases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-6 w-8 rounded"></span>
                  ) : (
                    stats.privatePosts
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
              <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/posts/new"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-[#D959B3] transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">New Blog Post</p>
                      <p className="text-sm text-gray-500">Create a new article</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/posts"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-[#D959B3] transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Manage Posts</p>
                      <p className="text-sm text-gray-500">Edit existing articles</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/media"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-[#D959B3] transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Media Library</p>
                      <p className="text-sm text-gray-500">Upload and manage files</p>
                    </div>
                  </div>
                </Link>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
              <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  No recent activity to display. Start by creating your first blog post!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}