import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BlogPostContent from './BlogPostContent';

// Fetch all published blog post slugs at build time
export async function generateStaticParams() {
  try {
    const postsRef = collection(db, 'blog_posts');
    const q = query(postsRef, where('isPublished', '==', true));
    const snapshot = await getDocs(q);
    
    const slugs = snapshot.docs
      .map((doc) => doc.data().slug as string)
      .filter((slug): slug is string => Boolean(slug));
    
    // Return array of slug params for static generation
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error fetching blog slugs for static generation:', error);
    // Return empty array - pages will be generated on-demand if possible
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
