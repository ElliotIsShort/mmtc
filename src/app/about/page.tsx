'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Music, Calendar, Award, MapPin, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AboutPageContent } from '@/types';
import { getAboutPageContent } from '@/lib/firestore';

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getAboutPageContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div className="container-page">
            <h1 className="page-title">About MMTC</h1>
          </div>
        </div>
        <div className="section-padding">
          <LoadingSpinner size="lg" className="py-12" />
        </div>
      </Layout>
    );
  }

  // Fallback content if loading fails
  const displayContent = content || {
    heroSubtitle: 'Over 100 years of bringing musical theatre magic to Neath and the surrounding valleys.',
    historyContent: '',
    foundedYear: '1923',
    productionsCount: '200+',
    membersCount: '150+',
    awardsText: 'Multiple',
    seniorRehearsalTimes: 'Tuesday & Thursday evenings, 7:30pm - 10:00pm',
    seniorLocation: 'Melyncrythan Community Hall, Neath',
    seniorDescription: 'Our Senior Section is open to anyone aged 16 and over who shares our passion for musical theatre.',
    juniorRehearsalTimes: 'Saturday mornings, 10:00am - 12:30pm',
    juniorLocation: 'Melyncrythan Community Hall, Neath',
    juniorDescription: 'Our Junior Section provides young performers with the opportunity to develop their talents.',
    venueDescription: '',
    venueAddress: 'Day-Y-Graid Road, Neath, SA11 1UB',
    ctaTitle: 'Want to Be Part of Our Story?',
    ctaDescription: "We're always looking for new members to join our theatre family.",
  };

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
          <h1 className="page-title">About MMTC</h1>
          <p className="text-primary-100 mt-4 text-lg max-w-2xl">
            {displayContent.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Our History */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Our History</h2>
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: displayContent.historyContent }}
            />

            {/* Timeline Highlights */}
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <Calendar className="mx-auto mb-3 text-primary-600" size={32} />
                <div className="text-2xl font-display font-bold text-primary-700">
                  {displayContent.foundedYear}
                </div>
                <p className="text-gray-600 text-sm mt-1">Founded</p>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6 text-center">
                <Music className="mx-auto mb-3 text-secondary-600" size={32} />
                <div className="text-2xl font-display font-bold text-secondary-700">
                  {displayContent.productionsCount}
                </div>
                <p className="text-gray-600 text-sm mt-1">Productions</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <Users className="mx-auto mb-3 text-primary-600" size={32} />
                <div className="text-2xl font-display font-bold text-primary-700">
                  {displayContent.membersCount}
                </div>
                <p className="text-gray-600 text-sm mt-1">Members</p>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6 text-center">
                <Award className="mx-auto mb-3 text-secondary-600" size={32} />
                <div className="text-2xl font-display font-bold text-secondary-700">
                  {displayContent.awardsText}
                </div>
                <p className="text-gray-600 text-sm mt-1">Awards Won</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Sections */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <h2 className="section-title text-center mb-12">Our Sections</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Senior Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <h3 className="text-2xl font-display font-bold">Senior Section</h3>
                <p className="text-primary-100 mt-1">Ages 16+</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">{displayContent.seniorDescription}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Rehearsals:</strong> {displayContent.seniorRehearsalTimes}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Location:</strong> {displayContent.seniorLocation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Junior Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-6">
                <h3 className="text-2xl font-display font-bold">Junior Section</h3>
                <p className="text-secondary-100 mt-1">Ages 8-16</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">{displayContent.juniorDescription}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="text-secondary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Rehearsals:</strong> {displayContent.juniorRehearsalTimes}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-secondary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Location:</strong> {displayContent.juniorLocation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Venue */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Our Venue: Gwyn Hall</h2>
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: displayContent.venueDescription }}
            />
            <div className="mt-8 bg-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">MMTC Practice Hall</h3>
              <p className="text-gray-700 mb-4">{displayContent.venueAddress}</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6!2d-3.807449!3d51.6531206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486e5dc550ca2495%3A0x6114474ede2a1c40!2sMMTC%20HEADQUARTERS!5e0!3m2!1sen!2suk!4v1600000000000!5m2!1sen!2suk"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="MMTC Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-page text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            {displayContent.ctaTitle}
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            {displayContent.ctaDescription}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
