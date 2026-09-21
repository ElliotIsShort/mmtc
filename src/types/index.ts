import { Timestamp } from 'firebase/firestore';

export interface Show {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  dates: string;
  venue: string;
  posterUrl: string;
  ticketUrl?: string;
  isSpotlight: boolean;
  status: 'upcoming' | 'past';
  year: number;
  galleryImages?: string[];
  createdAt: Timestamp;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl?: string;
  author: string;
  publishedAt: Timestamp;
  isPublished: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  interest: 'acting' | 'backstage' | 'junior' | 'general';
  message: string;
  submittedAt: Timestamp;
}

export interface Supporter {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

export interface AboutPageContent {
  id: string;
  heroSubtitle: string;
  historyContent: string;
  foundedYear: string;
  productionsCount: string;
  membersCount: string;
  awardsText: string;
  seniorRehearsalTimes: string;
  seniorLocation: string;
  seniorDescription: string;
  juniorRehearsalTimes: string;
  juniorLocation: string;
  juniorDescription: string;
  venueDescription: string;
  venueAddress: string;
  ctaTitle: string;
  ctaDescription: string;
}

export type InterestType = ContactSubmission['interest'];

export const INTEREST_LABELS: Record<InterestType, string> = {
  acting: 'Acting / Performing',
  backstage: 'Backstage / Technical',
  junior: 'Junior Section',
  general: 'General Enquiry',
};
