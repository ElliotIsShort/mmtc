'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import ShowCard from '@/components/ShowCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Show } from '@/types';
import { getPastShows } from '@/lib/firestore';

export default function PastProductionsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDecade, setSelectedDecade] = useState<string>('all');

  useEffect(() => {
    async function fetchShows() {
      try {
        const pastShows = await getPastShows();
        // Sort by year (descending), then by dates string to get most recent first
        const sortedShows = pastShows.sort((a, b) => {
          // First sort by year descending
          if (b.year !== a.year) {
            return b.year - a.year;
          }
          // If same year, try to parse month from dates string for secondary sort
          const getMonthIndex = (dates: string): number => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
            for (let i = 0; i < months.length; i++) {
              if (dates.includes(months[i])) return i;
            }
            return 0;
          };
          return getMonthIndex(b.dates) - getMonthIndex(a.dates);
        });
        setShows(sortedShows);
        setFilteredShows(sortedShows);
      } catch (error) {
        console.error('Error fetching past shows:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, []);

  // Get unique decades for filtering
  const decades = [...new Set(shows.map((show) => Math.floor(show.year / 10) * 10))].sort(
    (a, b) => b - a
  );

  // Filter shows by decade while maintaining sort order
  useEffect(() => {
    if (selectedDecade === 'all') {
      setFilteredShows(shows);
    } else {
      const decadeStart = parseInt(selectedDecade);
      const filtered = shows.filter((show) => show.year >= decadeStart && show.year < decadeStart + 10);
      setFilteredShows(filtered);
    }
  }, [selectedDecade, shows]);

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
          <h1 className="page-title">Past Productions</h1>
          <p className="text-primary-100 mt-4 text-lg max-w-2xl">
            Explore our rich history of spectacular performances spanning over a century.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-page">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading past productions..." className="py-12" />
          ) : shows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No past productions found.</p>
            </div>
          ) : (
            <>
              {/* Filter */}
              {decades.length > 1 && (
                <div className="mb-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Filter size={18} />
                    <span className="font-medium">Filter by decade:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDecade('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedDecade === 'all'
                          ? 'bg-primary-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {decades.map((decade) => (
                      <button
                        key={decade}
                        onClick={() => setSelectedDecade(decade.toString())}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedDecade === decade.toString()
                            ? 'bg-primary-700 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {decade}s
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results count */}
              <p className="text-gray-600 mb-6">
                Showing {filteredShows.length} production{filteredShows.length !== 1 ? 's' : ''}
              </p>

              {/* Shows Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
