'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Search,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Show } from '@/types';
import {
  getShows,
  createShow,
  updateShow,
  deleteShow,
  setSpotlightShow,
} from '@/lib/firestore';

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Shows' },
  { value: 'upcoming', label: 'Upcoming Only' },
  { value: 'past', label: 'Past Only' },
];

interface ShowFormData {
  title: string;
  subtitle: string;
  description: string;
  dates: string;
  venue: string;
  posterUrl: string;
  ticketUrl: string;
  status: 'upcoming' | 'past';
  year: number;
  galleryImages: string;
}

const defaultFormData: ShowFormData = {
  title: '',
  subtitle: '',
  description: '',
  dates: '',
  venue: 'Gwyn Hall, Neath',
  posterUrl: '',
  ticketUrl: '',
  status: 'upcoming',
  year: new Date().getFullYear(),
  galleryImages: '',
};

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [formData, setFormData] = useState<ShowFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteConfirmShow, setDeleteConfirmShow] = useState<Show | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch shows
  const fetchShows = async () => {
    try {
      const data = await getShows();
      setShows(data);
      setFilteredShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // Filter shows
  useEffect(() => {
    let filtered = shows;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.venue.toLowerCase().includes(query) ||
          s.year.toString().includes(query)
      );
    }

    setFilteredShows(filtered);
  }, [searchQuery, statusFilter, shows]);

  // Open modal for new show
  const handleAddShow = () => {
    setEditingShow(null);
    setFormData(defaultFormData);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditShow = (show: Show) => {
    setEditingShow(show);
    setFormData({
      title: show.title,
      subtitle: show.subtitle || '',
      description: show.description,
      dates: show.dates,
      venue: show.venue,
      posterUrl: show.posterUrl,
      ticketUrl: show.ticketUrl || '',
      status: show.status,
      year: show.year,
      galleryImages: show.galleryImages?.join('\n') || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.dates || !formData.venue) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const showData = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        description: formData.description,
        dates: formData.dates,
        venue: formData.venue,
        posterUrl: formData.posterUrl,
        ticketUrl: formData.ticketUrl || undefined,
        status: formData.status,
        year: formData.year,
        galleryImages: formData.galleryImages
          ? formData.galleryImages.split('\n').filter((url) => url.trim())
          : undefined,
        isSpotlight: editingShow?.isSpotlight || false,
      };

      if (editingShow) {
        await updateShow(editingShow.id, showData);
      } else {
        await createShow(showData);
      }

      setIsModalOpen(false);
      fetchShows();
    } catch (error) {
      console.error('Error saving show:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirmShow) return;

    setIsDeleting(true);

    try {
      await deleteShow(deleteConfirmShow.id);
      setDeleteConfirmShow(null);
      fetchShows();
    } catch (error) {
      console.error('Error deleting show:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle spotlight toggle
  const handleSetSpotlight = async (show: Show) => {
    try {
      await setSpotlightShow(show.id);
      fetchShows();
    } catch (error) {
      console.error('Error setting spotlight:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  return (
    <AdminLayout title="Show Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">
            Manage your productions, set spotlight shows, and add gallery images.
          </p>
          <Button leftIcon={<Plus size={18} />} onClick={handleAddShow}>
            Add Show
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="search"
                placeholder="Search shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <Select
                options={FILTER_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>

        {/* Shows List */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : filteredShows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">
              {shows.length === 0
                ? 'No shows yet. Add your first production!'
                : 'No shows match your filters.'}
            </p>
            {shows.length === 0 && (
              <Button onClick={handleAddShow} leftIcon={<Plus size={18} />}>
                Add Your First Show
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Show
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShows.map((show) => (
                    <tr key={show.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            {show.posterUrl ? (
                              <Image
                                src={show.posterUrl}
                                alt={show.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {show.title}
                              </span>
                              {show.isSpotlight && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  <Star size={12} fill="currentColor" />
                                  Spotlight
                                </span>
                              )}
                            </div>
                            {show.subtitle && (
                              <p className="text-sm text-gray-500">{show.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            show.status === 'upcoming'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {show.status === 'upcoming' ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{show.dates}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{show.year}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSetSpotlight(show)}
                            className={`p-2 rounded-lg transition-colors ${
                              show.isSpotlight
                                ? 'text-yellow-600 bg-yellow-50'
                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={show.isSpotlight ? 'Current spotlight' : 'Set as spotlight'}
                          >
                            {show.isSpotlight ? (
                              <Star size={18} fill="currentColor" />
                            ) : (
                              <StarOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditShow(show)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit show"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmShow(show)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete show"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShow ? 'Edit Show' : 'Add New Show'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Come From Away"
            />
            <Input
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="e.g., A New Musical"
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the show..."
            rows={3}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Performance Dates"
              name="dates"
              value={formData.dates}
              onChange={handleChange}
              required
              placeholder="e.g., October 12–15, 2026"
            />
            <Input
              label="Venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="e.g., Gwyn Hall, Neath"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={STATUS_OPTIONS}
              required
            />
            <Input
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
              min={1923}
              max={2100}
            />
            <Input
              label="Ticket URL"
              name="ticketUrl"
              type="url"
              value={formData.ticketUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Input
            label="Poster Image URL"
            name="posterUrl"
            type="url"
            value={formData.posterUrl}
            onChange={handleChange}
            placeholder="https://..."
            helperText="Direct link to the show poster image"
          />

          <Textarea
            label="Gallery Image URLs"
            name="galleryImages"
            value={formData.galleryImages}
            onChange={handleChange}
            placeholder="Enter one URL per line"
            helperText="One image URL per line for the gallery slideshow"
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingShow ? 'Save Changes' : 'Add Show'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmShow}
        onClose={() => setDeleteConfirmShow(null)}
        title="Delete Show"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <strong>&quot;{deleteConfirmShow?.title}&quot;</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmShow(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
