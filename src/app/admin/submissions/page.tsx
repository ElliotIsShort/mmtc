'use client';

import { useEffect, useState } from 'react';
import {
  Trash2,
  Search,
  Filter,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Music,
  Wrench,
  Users,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ContactSubmission, InterestType, INTEREST_LABELS } from '@/types';
import { getContactSubmissions, deleteContactSubmission } from '@/lib/firestore';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Interests' },
  { value: 'acting', label: 'Acting / Performing' },
  { value: 'backstage', label: 'Backstage / Technical' },
  { value: 'junior', label: 'Junior Section' },
  { value: 'general', label: 'General Enquiry' },
];

const INTEREST_ICONS: Record<InterestType, typeof Music> = {
  acting: Music,
  backstage: Wrench,
  junior: Users,
  general: HelpCircle,
};

const INTEREST_COLORS: Record<InterestType, string> = {
  acting: 'bg-purple-100 text-purple-800',
  backstage: 'bg-blue-100 text-blue-800',
  junior: 'bg-orange-100 text-orange-800',
  general: 'bg-gray-100 text-gray-800',
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [interestFilter, setInterestFilter] = useState('all');

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Delete confirmation
  const [deleteConfirmSubmission, setDeleteConfirmSubmission] = useState<ContactSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const data = await getContactSubmissions();
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    // Interest filter
    if (interestFilter !== 'all') {
      filtered = filtered.filter((s) => s.interest === interestFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.message.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchQuery, interestFilter, submissions]);

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirmSubmission) return;

    setIsDeleting(true);

    try {
      await deleteContactSubmission(deleteConfirmSubmission.id);
      setDeleteConfirmSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (timestamp: { toDate: () => Date }) => {
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Get stats
  const stats = {
    total: submissions.length,
    acting: submissions.filter((s) => s.interest === 'acting').length,
    backstage: submissions.filter((s) => s.interest === 'backstage').length,
    junior: submissions.filter((s) => s.interest === 'junior').length,
    general: submissions.filter((s) => s.interest === 'general').length,
  };

  return (
    <AdminLayout title="Form Submissions">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats.acting}</p>
            <p className="text-sm text-purple-600">Acting</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.backstage}</p>
            <p className="text-sm text-blue-600">Backstage</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-700">{stats.junior}</p>
            <p className="text-sm text-orange-600">Junior</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">{stats.general}</p>
            <p className="text-sm text-gray-600">General</p>
          </div>
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
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <Select
                options={FILTER_OPTIONS}
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-600">
              {submissions.length === 0
                ? 'No submissions yet. They will appear here when someone fills out the contact form.'
                : 'No submissions match your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const isExpanded = expandedRows.has(submission.id);
              const Icon = INTEREST_ICONS[submission.interest];

              return (
                <div
                  key={submission.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Header Row */}
                  <div
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleRowExpansion(submission.id)}
                  >
                    {/* Interest Icon */}
                    <div
                      className={`p-2 rounded-lg ${INTEREST_COLORS[submission.interest]}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Main Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-medium text-gray-900">
                          {submission.name}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            INTEREST_COLORS[submission.interest]
                          }`}
                        >
                          {INTEREST_LABELS[submission.interest]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {submission.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmSubmission(submission);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete submission"
                      >
                        <Trash2 size={18} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare
                            size={16}
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Message:
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap pl-6">
                          {submission.message}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <a
                          href={`mailto:${submission.email}?subject=RE: Your enquiry to MMTC`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          <Mail size={16} />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Results count */}
        {!loading && filteredSubmissions.length > 0 && (
          <p className="text-center text-sm text-gray-500">
            Showing {filteredSubmissions.length} of {submissions.length} submission
            {submissions.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmSubmission}
        onClose={() => setDeleteConfirmSubmission(null)}
        title="Delete Submission"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the submission from{' '}
            <strong>{deleteConfirmSubmission?.name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmSubmission(null)}
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
