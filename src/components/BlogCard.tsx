'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  // Format date
  const formatDate = (timestamp: { toDate: () => Date }) => {
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="card h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <span className="text-primary-400 font-display text-lg">MMTC</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{post.author}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          {/* Read More */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="inline-flex items-center gap-1.5 text-primary-700 font-medium text-sm group-hover:gap-2.5 transition-all">
              Read More
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
