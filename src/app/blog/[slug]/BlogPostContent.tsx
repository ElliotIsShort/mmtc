'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { BlogPost } from '@/types';
import { getBlogPostBySlug } from '@/lib/firestore';

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      try {
        const blogPost = await getBlogPostBySlug(slug);
        if (blogPost) {
          setPost(blogPost);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  // Format date
  const formatDate = (timestamp: { toDate: () => Date }) => {
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-page">
            <LoadingSpinner size="lg" text="Loading post..." className="py-12" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-page text-center py-12">
            <h1 className="text-3xl font-display font-bold text-gray-700 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the blog post you&apos;re looking for.
            </p>
            <Link href="/blog">
              <Button variant="outline" leftIcon={<ArrowLeft size={18} />}>
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="page-header">
        <div className="container-page">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>
          <h1 className="page-title">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 mt-4 text-primary-200">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="section-padding">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div 
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/blog">
                <Button variant="outline" leftIcon={<ArrowLeft size={18} />}>
                  Back to All Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
