'use client';

import { useEffect, useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AboutPageContent } from '@/types';
import { getAboutPageContent, updateAboutPageContent } from '@/lib/firestore';

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [originalContent, setOriginalContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getAboutPageContent();
        setContent(data);
        setOriginalContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
        setMessage({ type: 'error', text: 'Failed to load content' });
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContent((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setMessage(null);

    try {
      await updateAboutPageContent(content);
      setOriginalContent(content);
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalContent) {
      setContent(originalContent);
      setMessage(null);
    }
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  if (loading) {
    return (
      <AdminLayout title="About Page Editor">
        <LoadingSpinner size="lg" className="py-12" />
      </AdminLayout>
    );
  }

  if (!content) {
    return (
      <AdminLayout title="About Page Editor">
        <div className="text-center py-12 text-gray-600">
          Failed to load content. Please refresh the page.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Page Editor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">
            Edit the content displayed on the About &amp; History page.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              leftIcon={<RotateCcw size={18} />}
              onClick={handleReset}
              disabled={!hasChanges || saving}
            >
              Reset
            </Button>
            <Button
              leftIcon={<Save size={18} />}
              onClick={handleSave}
              disabled={!hasChanges || saving}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
            <Textarea
              label="Hero Subtitle"
              name="heroSubtitle"
              value={content.heroSubtitle}
              onChange={handleChange}
              rows={2}
              helperText="The text displayed below the main title"
            />
          </section>

          {/* History Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Our History</h2>
            <Textarea
              label="History Content (HTML)"
              name="historyContent"
              value={content.historyContent}
              onChange={handleChange}
              rows={8}
              helperText="Use <p> tags for paragraphs and <strong> for bold text"
            />
          </section>

          {/* Stats Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline Highlights</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Founded Year"
                name="foundedYear"
                value={content.foundedYear}
                onChange={handleChange}
              />
              <Input
                label="Productions Count"
                name="productionsCount"
                value={content.productionsCount}
                onChange={handleChange}
              />
              <Input
                label="Members Count"
                name="membersCount"
                value={content.membersCount}
                onChange={handleChange}
              />
              <Input
                label="Awards Text"
                name="awardsText"
                value={content.awardsText}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Senior Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Senior Section</h2>
            <div className="space-y-4">
              <Textarea
                label="Description"
                name="seniorDescription"
                value={content.seniorDescription}
                onChange={handleChange}
                rows={3}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rehearsal Times"
                  name="seniorRehearsalTimes"
                  value={content.seniorRehearsalTimes}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  name="seniorLocation"
                  value={content.seniorLocation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Junior Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Junior Section</h2>
            <div className="space-y-4">
              <Textarea
                label="Description"
                name="juniorDescription"
                value={content.juniorDescription}
                onChange={handleChange}
                rows={3}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rehearsal Times"
                  name="juniorRehearsalTimes"
                  value={content.juniorRehearsalTimes}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  name="juniorLocation"
                  value={content.juniorLocation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Venue Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue: Gwyn Hall</h2>
            <div className="space-y-4">
              <Textarea
                label="Venue Description (HTML)"
                name="venueDescription"
                value={content.venueDescription}
                onChange={handleChange}
                rows={5}
                helperText="Use <p> tags for paragraphs and <strong> for bold text"
              />
              <Input
                label="Venue Address"
                name="venueAddress"
                value={content.venueAddress}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Call to Action</h2>
            <div className="space-y-4">
              <Input
                label="CTA Title"
                name="ctaTitle"
                value={content.ctaTitle}
                onChange={handleChange}
              />
              <Textarea
                label="CTA Description"
                name="ctaDescription"
                value={content.ctaDescription}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
