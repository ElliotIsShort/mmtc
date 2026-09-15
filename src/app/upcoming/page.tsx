'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Show } from '@/types';
import { getUpcomingShows } from '@/lib/firestore';

export default function UpcomingShowPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      try {
        const upcomingShows = await getUpcomingShows();
        setShows(upcomingShows);
      } catch (error) {
        console.error('Error fetching upcoming shows:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, []);

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
          <h1 className="page-title">Upcoming Shows</h1>
          <p className="text-primary-100 mt-4 text-lg max-w-2xl">
            Don&apos;t miss our upcoming productions at the Gwyn Hall.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-page">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading upcoming shows..." className="py-12" />
          ) : shows.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-display font-bold text-gray-700 mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We&apos;re busy preparing our next spectacular production. 
                Check back soon for announcements!
              </p>
              <Link href="/past-productions">
                <Button variant="outline">View Past Productions</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {shows.map((show, index) => (
                <div
                  key={show.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg ${
                    index === 0 ? 'border-2 border-secondary-400' : ''
                  }`}
                >
                  {index === 0 && (
                    <div className="bg-secondary-500 text-white text-center py-2 text-sm font-semibold">
                      🎭 Featured Production
                    </div>
                  )}
                  <div className="grid md:grid-cols-2">
                    {/* Poster */}
                    <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[400px]">
                      {show.posterUrl ? (
                        <Image
                          src={show.posterUrl}
                          alt={show.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                          <span className="text-primary-700 font-display text-3xl text-center px-4">
                            {show.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                        {show.title}
                      </h2>
                      {show.subtitle && (
                        <p className="text-xl text-gray-600 mb-4">{show.subtitle}</p>
                      )}
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {show.description}
                      </p>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar className="text-primary-600 flex-shrink-0" size={20} />
                          <span className="font-medium">{show.dates}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <MapPin className="text-primary-600 flex-shrink-0" size={20} />
                          <span>{show.venue}</span>
                        </div>
                      </div>
                      {show.ticketUrl ? (
                        <a
                          href={show.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button size="lg" leftIcon={<Ticket size={20} />}>
                            Book Tickets
                          </Button>
                        </a>
                      ) : (
                        <p className="text-gray-500 italic">
                          Tickets coming soon
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
