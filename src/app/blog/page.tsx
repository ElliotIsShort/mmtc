'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import BlogCard from '@/components/BlogCard';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BlogPost } from '@/types';
import { getBlogPosts } from '@/lib/firestore';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
        setFilteredPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Filter posts by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.author.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, posts]);

  return (
    <Layout>
      {/* Header */}
      <div className="page-header">
        <div className="container-page">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <h1 className="page-title">News & Blog</h1>
          <p className="text-primary-100 mt-4 text-lg max-w-2xl">
            Stay up to date with the latest news, announcements, and stories from MMTC.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-page">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading blog posts..." className="py-12" />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-display font-bold text-gray-700 mb-4">
                No Posts Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re working on some exciting content. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="max-w-md mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="search"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No posts found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? `Found ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`
                      : `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`}
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
