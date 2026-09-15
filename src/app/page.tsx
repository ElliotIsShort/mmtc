'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Ticket, ArrowRight, Users, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import BlogCard from '@/components/BlogCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Show, BlogPost, Supporter } from '@/types';
import { getSpotlightShow, getRecentBlogPosts, getSupporters } from '@/lib/firestore';

export default function HomePage() {
  const [spotlightShow, setSpotlightShow] = useState<Show | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [show, posts, supportersList] = await Promise.all([
          getSpotlightShow(),
          getRecentBlogPosts(3),
          getSupporters(),
        ]);
        setSpotlightShow(show);
        setRecentPosts(posts);
        setSupporters(supportersList);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/images/theatre-pattern.svg')] opacity-5" />
        <div className="relative container-page py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-balance">
              Bringing Musical Theatre Magic to Neath
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              Since 1923, Melyncrythan Musical Theatre Company has been entertaining 
              audiences with spectacular productions at the historic Gwyn Hall.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/upcoming">
                <Button size="lg" variant="secondary" rightIcon={<ArrowRight size={20} />}>
                  See Next Show
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Join MMTC
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Show Banner */}
      {loading ? (
        <section className="section-padding bg-white">
          <div className="container-page">
            <LoadingSpinner text="Loading upcoming show..." />
          </div>
        </section>
      ) : spotlightShow ? (
        <section className="bg-white section-padding">
          <div className="container-page">
            <h2 className="section-title text-center mb-10">What&apos;s On</h2>
            <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Poster */}
                <div className="relative aspect-[3/4] md:aspect-auto">
                  {spotlightShow.posterUrl ? (
                    <Image
                      src={spotlightShow.posterUrl}
                      alt={spotlightShow.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                      <span className="text-primary-700 font-display text-2xl">
                        {spotlightShow.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-2">
                    Now Booking
                  </span>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                    {spotlightShow.title}
                  </h3>
                  {spotlightShow.subtitle && (
                    <p className="text-xl text-gray-600 mb-4">{spotlightShow.subtitle}</p>
                  )}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {spotlightShow.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="text-primary-600" size={20} />
                      <span className="font-medium">{spotlightShow.dates}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="text-primary-600" size={20} />
                      <span>{spotlightShow.venue}</span>
                    </div>
                  </div>
                  {spotlightShow.ticketUrl && (
                    <a
                      href={spotlightShow.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" leftIcon={<Ticket size={20} />}>
                        Book Tickets
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white section-padding">
          <div className="container-page text-center">
            <h2 className="section-title">What&apos;s On</h2>
            <p className="text-gray-600 mb-6">
              Stay tuned for our next exciting production!
            </p>
            <Link href="/past-productions">
              <Button variant="outline">View Past Productions</Button>
            </Link>
          </div>
        </section>
      )}

      {/* About MMTC Snippet */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">About MMTC</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded in 1923, Melyncrythan Musical Theatre Company is one of Wales&apos; 
                longest-running amateur theatre groups. We&apos;re a registered charity 
                dedicated to promoting the performing arts in our community.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                With both Senior (16+) and Junior sections, we welcome performers, 
                backstage crew, and supporters of all ages who share our passion for 
                bringing spectacular musical theatre to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
                    Our History
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" rightIcon={<Users size={18} />}>
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-display font-bold text-primary-700 mb-2">100+</div>
                <p className="text-gray-700 text-sm">Years of Theatre</p>
              </div>
              <div className="bg-secondary-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-display font-bold text-secondary-700 mb-2">200+</div>
                <p className="text-gray-700 text-sm">Productions</p>
              </div>
              <div className="bg-secondary-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-display font-bold text-secondary-700 mb-2">150+</div>
                <p className="text-gray-700 text-sm">Active Members</p>
              </div>
              <div className="bg-primary-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-display font-bold text-primary-700 mb-2">
                  <Heart className="inline" size={36} />
                </div>
                <p className="text-gray-700 text-sm">Community Driven</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-page">
            <div className="flex justify-between items-center mb-10">
              <h2 className="section-title mb-0">Latest News</h2>
              <Link href="/blog">
                <Button variant="ghost" rightIcon={<ArrowRight size={18} />}>
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Supporters Section */}
      {supporters.length > 0 && (
        <section className="section-padding bg-gray-100">
          <div className="container-page">
            <h2 className="text-xl font-semibold text-center text-gray-600 mb-8">
              Proudly Supported By
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {supporters.map((supporter) => (
                <a
                  key={supporter.id}
                  href={supporter.websiteUrl || '#'}
                  target={supporter.websiteUrl ? '_blank' : undefined}
                  rel={supporter.websiteUrl ? 'noopener noreferrer' : undefined}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  {supporter.logoUrl ? (
                    <Image
                      src={supporter.logoUrl}
                      alt={supporter.name}
                      width={120}
                      height={60}
                      className="h-12 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium">{supporter.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-page text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Join the Magic?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you want to perform on stage, work behind the scenes, or support 
            our community theatre, there&apos;s a place for you at MMTC.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" rightIcon={<ArrowRight size={20} />}>
              Get Involved
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
