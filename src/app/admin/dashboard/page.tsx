'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Film, FileText, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getShows, getBlogPosts, getContactSubmissions } from '@/lib/firestore';

interface Stats {
  totalShows: number;
  upcomingShows: number;
  totalPosts: number;
  publishedPosts: number;
  totalSubmissions: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [shows, posts, submissions] = await Promise.all([
          getShows(),
          getBlogPosts(true), // Include unpublished
          getContactSubmissions(),
        ]);

        setStats({
          totalShows: shows.length,
          upcomingShows: shows.filter((s) => s.status === 'upcoming').length,
          totalPosts: posts.length,
          publishedPosts: posts.filter((p) => p.isPublished).length,
          totalSubmissions: submissions.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Film className="text-primary-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalShows || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Shows</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {stats?.upcomingShows || 0} upcoming
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary-100 p-3 rounded-lg">
                  <FileText className="text-secondary-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalPosts || 0}
                  </p>
                  <p className="text-sm text-gray-600">Blog Posts</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {stats?.publishedPosts || 0} published
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageSquare className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalSubmissions || 0}
                  </p>
                  <p className="text-sm text-gray-600">Form Submissions</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Contact & join requests</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                  <p className="text-sm text-gray-600">Years of History</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Since 1923</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/shows">
                <Button leftIcon={<Plus size={18} />}>Add New Show</Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="secondary" leftIcon={<Plus size={18} />}>
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/submissions">
                <Button variant="outline" leftIcon={<MessageSquare size={18} />}>
                  View Submissions
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Getting Started
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>Welcome to the MMTC Admin Portal! Here you can:</p>
              <ul>
                <li>
                  <strong>Manage Shows:</strong> Add upcoming productions, mark past shows, 
                  set a spotlight show for the homepage, and upload gallery images.
                </li>
                <li>
                  <strong>Write Blog Posts:</strong> Share news, announcements, and stories 
                  with your audience.
                </li>
                <li>
                  <strong>View Submissions:</strong> See messages from people interested in 
                  joining or contacting MMTC.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
