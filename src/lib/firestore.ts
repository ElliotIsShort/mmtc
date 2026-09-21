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
import { Show, BlogPost, ContactSubmission, Supporter, AboutPageContent } from '@/types';

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


// ============ ABOUT PAGE CONTENT ============

const DEFAULT_ABOUT_CONTENT: Omit<AboutPageContent, 'id'> = {
  heroSubtitle: 'Over 100 years of bringing musical theatre magic to Neath and the surrounding valleys.',
  historyContent: `<p><strong>Melyncrythan Musical Theatre Company</strong> was founded in 1923, making us one of the longest-running amateur theatre companies in Wales. For over a century, we have been dedicated to bringing the joy and magic of musical theatre to our community.</p>
<p>Our home is the historic <strong>Gwyn Hall</strong> in Neath, a beautiful venue that has hosted countless memorable performances over the years. From classic musicals to modern Broadway hits, we take pride in delivering high-quality productions that rival professional standards.</p>
<p>As a <strong>registered charity</strong>, we are committed to promoting the performing arts in our community. We believe that theatre has the power to inspire, educate, and bring people together. Our members come from all walks of life, united by their love of musical theatre.</p>`,
  foundedYear: '1923',
  productionsCount: '200+',
  membersCount: '150+',
  awardsText: 'Multiple',
  seniorRehearsalTimes: 'Tuesday & Thursday evenings, 7:30pm - 10:00pm',
  seniorLocation: 'Melyncrythan Community Hall, Neath',
  seniorDescription: 'Our Senior Section is open to anyone aged 16 and over who shares our passion for musical theatre. Whether you want to perform on stage, work behind the scenes, or help with production, we welcome you!',
  juniorRehearsalTimes: 'Saturday mornings, 10:00am - 12:30pm',
  juniorLocation: 'Melyncrythan Community Hall, Neath',
  juniorDescription: 'Our Junior Section (MMTC Juniors) provides young performers with the opportunity to develop their talents in a supportive environment. We focus on building confidence, teamwork, and performance skills.',
  venueDescription: `<p>The <strong>Gwyn Hall</strong> has been the home of our major productions for generations. This beautiful venue in the heart of Neath provides the perfect setting for our musical theatre performances.</p>
<p>With its excellent acoustics, comfortable seating, and rich history, the Gwyn Hall offers our audiences an unforgettable theatre experience. We are proud to continue the tradition of live performance in this wonderful community space.</p>`,
  venueAddress: 'Day-Y-Graid Road, Neath, SA11 1UB',
  ctaTitle: 'Want to Be Part of Our Story?',
  ctaDescription: "We're always looking for new members to join our theatre family.",
};

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const docRef = doc(db, 'site_content', 'about');
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return { id: 'about', ...DEFAULT_ABOUT_CONTENT };
  }
  return { id: docSnap.id, ...docSnap.data() } as AboutPageContent;
}

export async function updateAboutPageContent(data: Partial<AboutPageContent>): Promise<void> {
  const docRef = doc(db, 'site_content', 'about');
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    // Create the document with defaults merged with updates
    const { id, ...dataWithoutId } = data as AboutPageContent;
    await updateDoc(docRef, { ...DEFAULT_ABOUT_CONTENT, ...dataWithoutId } as DocumentData).catch(async () => {
      // If update fails (doc doesn't exist), use setDoc
      const { setDoc } = await import('firebase/firestore');
      await setDoc(docRef, { ...DEFAULT_ABOUT_CONTENT, ...dataWithoutId });
    });
  } else {
    const { id, ...dataWithoutId } = data as AboutPageContent;
    await updateDoc(docRef, dataWithoutId as DocumentData);
  }
}
