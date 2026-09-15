'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, Users, Wrench, Music, HelpCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { createContactSubmission } from '@/lib/firestore';
import { InterestType, INTEREST_LABELS } from '@/types';

const INTEREST_OPTIONS = Object.entries(INTEREST_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const INTEREST_ICONS = {
  acting: Music,
  backstage: Wrench,
  junior: Users,
  general: HelpCircle,
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '' as InterestType | '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.interest || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createContactSubmission({
        name: formData.name,
        email: formData.email,
        interest: formData.interest as InterestType,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Sorry, there was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          <h1 className="page-title">Join Us / Contact</h1>
          <p className="text-primary-100 mt-4 text-lg max-w-2xl">
            Interested in joining MMTC or have a question? We&apos;d love to hear from you!
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="section-title">Get in Touch</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700">
                    Thank you for your interest in MMTC. We&apos;ll be in touch soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />

                  <Select
                    label="I'm interested in..."
                    name="interest"
                    required
                    value={formData.interest}
                    onChange={handleChange}
                    placeholder="Select an option"
                    options={INTEREST_OPTIONS}
                  />

                  <Textarea
                    label="Your Message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself and what you're interested in..."
                    rows={5}
                  />

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Send size={18} />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 className="section-title">Ways to Get Involved</h2>
              <div className="space-y-6">
                {Object.entries(INTEREST_LABELS).map(([key, label]) => {
                  const Icon = INTEREST_ICONS[key as InterestType];
                  return (
                    <div key={key} className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg">
                          <Icon className="text-primary-700" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{label}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {key === 'acting' &&
                              'Audition for our productions and perform on stage at the Gwyn Hall.'}
                            {key === 'backstage' &&
                              'Help with lighting, sound, set design, costumes, props, and more.'}
                            {key === 'junior' &&
                              'Ages 8-16 can join our Saturday morning sessions to learn performance skills.'}
                            {key === 'general' &&
                              'Questions about membership, tickets, or anything else? We\'re here to help!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rehearsal Info */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Rehearsal Schedule</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-primary-700">Senior Section (16+):</strong>
                    <p className="text-gray-600">Tuesday & Thursday, 7:30pm - 10:00pm</p>
                  </div>
                  <div>
                    <strong className="text-secondary-600">Junior Section (8-16):</strong>
                    <p className="text-gray-600">Saturday, 10:00am - 12:30pm</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <strong>Location:</strong>
                    <p className="text-gray-600">Melyncrythan Community Hall, Neath</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Find Us</h3>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.5!2d-3.8069!3d51.6595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM5JzM0LjIiTiAzwrA0OCcyNC44Ilc!5e0!3m2!1sen!2suk!4v1600000000000!5m2!1sen!2suk"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                  title="Rehearsal Hall Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
