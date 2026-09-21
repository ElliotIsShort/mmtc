'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Music, Calendar, Award, MapPin, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';

export default function AboutPage() {
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
            Over 100 years of bringing musical theatre magic to Neath and the surrounding valleys.
          </p>
        </div>
      </div>

      {/* Our History */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Our History</h2>
            <div className="prose-content">
              <p>
                <strong>Melyncrythan Musical Theatre Company</strong> was founded in 1923, 
                making us one of the longest-running amateur theatre companies in Wales. 
                For over a century, we have been dedicated to bringing the joy and magic 
                of musical theatre to our community.
              </p>
              <p>
                Our home is the historic <strong>Gwyn Hall</strong> in Neath, a beautiful 
                venue that has hosted countless memorable performances over the years. 
                From classic musicals to modern Broadway hits, we take pride in delivering 
                high-quality productions that rival professional standards.
              </p>
              <p>
                As a <strong>registered charity</strong>, we are committed to promoting 
                the performing arts in our community. We believe that theatre has the 
                power to inspire, educate, and bring people together. Our members come 
                from all walks of life, united by their love of musical theatre.
              </p>
            </div>

            {/* Timeline Highlights */}
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <Calendar className="mx-auto mb-3 text-primary-600" size={32} />
                <div className="text-2xl font-display font-bold text-primary-700">1923</div>
                <p className="text-gray-600 text-sm mt-1">Founded</p>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6 text-center">
                <Music className="mx-auto mb-3 text-secondary-600" size={32} />
                <div className="text-2xl font-display font-bold text-secondary-700">200+</div>
                <p className="text-gray-600 text-sm mt-1">Productions</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <Users className="mx-auto mb-3 text-primary-600" size={32} />
                <div className="text-2xl font-display font-bold text-primary-700">150+</div>
                <p className="text-gray-600 text-sm mt-1">Members</p>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6 text-center">
                <Award className="mx-auto mb-3 text-secondary-600" size={32} />
                <div className="text-2xl font-display font-bold text-secondary-700">Multiple</div>
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
                <p className="text-gray-700 mb-6">
                  Our Senior Section is open to anyone aged 16 and over who shares our 
                  passion for musical theatre. Whether you want to perform on stage, 
                  work behind the scenes, or help with production, we welcome you!
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Rehearsals:</strong> Tuesday & Thursday evenings, 7:30pm - 10:00pm
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Location:</strong> Melyncrythan Community Hall, Neath
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
                <p className="text-gray-700 mb-6">
                  Our Junior Section (MMTC Juniors) provides young performers with the 
                  opportunity to develop their talents in a supportive environment. 
                  We focus on building confidence, teamwork, and performance skills.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="text-secondary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Rehearsals:</strong> Saturday mornings, 10:00am - 12:30pm
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-secondary-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Location:</strong> Melyncrythan Community Hall, Neath
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
            <div className="prose-content">
              <p>
                The <strong>Gwyn Hall</strong> has been the home of our major productions 
                for generations. This beautiful venue in the heart of Neath provides the 
                perfect setting for our musical theatre performances.
              </p>
              <p>
                With its excellent acoustics, comfortable seating, and rich history, 
                the Gwyn Hall offers our audiences an unforgettable theatre experience. 
                We are proud to continue the tradition of live performance in this 
                wonderful community space.
              </p>
            </div>
            <div className="mt-8 bg-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">Gwyn Hall Location</h3>
              <p className="text-gray-700 mb-4">
                Orchard Street, Neath, SA11 1DU
              </p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6!2d-3.807449!3d51.6531206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486e5dc550ca2495%3A0x6114474ede2a1c40!2sMMTC%20HEADQUARTERS!5e0!3m2!1sen!2suk!4v1600000000000!5m2!1sen!2suk"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="Gwyn Hall Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-page text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Want to Be Part of Our Story?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            We&apos;re always looking for new members to join our theatre family.
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
