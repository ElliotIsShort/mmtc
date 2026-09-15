import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { Show, BlogPost, ContactSubmission, Supporter } from '@/types';

// ============ SHOWS ============

export async function getShows(): Promise<Show[]> {
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Show[];
}

export async function getUpcomingShows(): Promise<Show[]> {
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, where('status', '==', 'upcoming'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Show[];
}

export async function getPastShows(): Promise<Show[]> {
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, where('status', '==', 'past'), orderBy('year', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Show[];
}

export async function getSpotlightShow(): Promise<Show | null> {
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, where('isSpotlight', '==', true), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Show;
}

export async function getShowById(id: string): Promise<Show | null> {
  const docRef = doc(db, 'shows', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Show;
}

export async function createShow(show: Omit<Show, 'id' | 'createdAt'>): Promise<string> {
  const showsRef = collection(db, 'shows');
  const docRef = await addDoc(showsRef, {
    ...show,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateShow(id: string, data: Partial<Show>): Promise<void> {
  const docRef = doc(db, 'shows', id);
  await updateDoc(docRef, data as DocumentData);
}

export async function deleteShow(id: string): Promise<void> {
  const docRef = doc(db, 'shows', id);
  await deleteDoc(docRef);
}

export async function setSpotlightShow(showId: string): Promise<void> {
  // First, remove spotlight from all shows
  const shows = await getShows();
  for (const show of shows) {
    if (show.isSpotlight) {
      await updateShow(show.id, { isSpotlight: false });
    }
  }
  // Set the new spotlight
  await updateShow(showId, { isSpotlight: true });
}

// ============ BLOG POSTS ============

export async function getBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  const postsRef = collection(db, 'blog_posts');
  let q;
  if (includeUnpublished) {
    q = query(postsRef, orderBy('publishedAt', 'desc'));
  } else {
    q = query(postsRef, where('isPublished', '==', true), orderBy('publishedAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function getRecentBlogPosts(count = 3): Promise<BlogPost[]> {
  const postsRef = collection(db, 'blog_posts');
  const q = query(
    postsRef,
    where('isPublished', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const postsRef = collection(db, 'blog_posts');
  const q = query(postsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogPost;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blog_posts', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as BlogPost;
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<string> {
  const postsRef = collection(db, 'blog_posts');
  const docRef = await addDoc(postsRef, {
    ...post,
    publishedAt: post.publishedAt || Timestamp.now(),
  });
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  const docRef = doc(db, 'blog_posts', id);
  await updateDoc(docRef, data as DocumentData);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, 'blog_posts', id);
  await deleteDoc(docRef);
}

// ============ CONTACT SUBMISSIONS ============

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissionsRef = collection(db, 'contact_submissions');
  const q = query(submissionsRef, orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ContactSubmission[];
}

export async function createContactSubmission(
  submission: Omit<ContactSubmission, 'id' | 'submittedAt'>
): Promise<string> {
  const submissionsRef = collection(db, 'contact_submissions');
  const docRef = await addDoc(submissionsRef, {
    ...submission,
    submittedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const docRef = doc(db, 'contact_submissions', id);
  await deleteDoc(docRef);
}

// ============ SUPPORTERS ============

export async function getSupporters(): Promise<Supporter[]> {
  const supportersRef = collection(db, 'supporters');
  const snapshot = await getDocs(supportersRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Supporter[];
}

export async function createSupporter(supporter: Omit<Supporter, 'id'>): Promise<string> {
  const supportersRef = collection(db, 'supporters');
  const docRef = await addDoc(supportersRef, supporter);
  return docRef.id;
}

export async function updateSupporter(id: string, data: Partial<Supporter>): Promise<void> {
  const docRef = doc(db, 'supporters', id);
  await updateDoc(docRef, data as DocumentData);
}

export async function deleteSupporter(id: string): Promise<void> {
  const docRef = doc(db, 'supporters', id);
  await deleteDoc(docRef);
}
