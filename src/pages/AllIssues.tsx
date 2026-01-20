import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import IssueUploadForm from '../components/IssueUploadForm';
import PdfViewer from '../components/PdfViewerIssue';

interface Issue {
  id: string;
  year: number;
  month: number;
  title: string;
  description?: string;
  pdf_url: string;
  created_at: string;
}

export const AllIssues: React.FC = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingForMonth, setUploadingForMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch years with issues
  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await api.get('/issues/years');
      setYears(response.years || []);
      if (response.years && response.years.length > 0) {
        fetchIssuesForYear(response.years[0]);
      }
    } catch (error) {
      console.error('Failed to fetch years:', error);
    }
  };

  // Fetch issues for selected year
  const fetchIssuesForYear = async (year: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/issues/content?year=${year}`);
      setIssues(response.issues || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle year expansion
  const toggleYear = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
      fetchIssuesForYear(year);
    }
  };

  // Toggle month expansion
  const toggleMonth = (monthKey: string) => {
    if (expandedMonths.includes(monthKey)) {
      setExpandedMonths(expandedMonths.filter(m => m !== monthKey));
    } else {
      setExpandedMonths([...expandedMonths, monthKey]);
    }
  };

  // Delete issue
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/issues/${id}`);
      setIssues(issues.filter(issue => issue.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete issue:', error);
    }
  };

  // Update issue metadata
  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/issues/${id}`, editForm);
      setIssues(
        issues.map(issue =>
          issue.id === id
            ? { ...issue, ...editForm }
            : issue
        )
      );
      setEditingId(null);
      setEditForm({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to update issue:', error);
    }
  };

  // Render month section
  const renderMonth = (year: number, month: number) => {
    const monthKey = `${year}-${month}`;
    const monthIssues = issues.filter(i => i.year === year && i.month === month);
    const isExpanded = expandedMonths.includes(monthKey);

    return (
      <div key={monthKey} className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
        {/* Month Header */}
        <button
          onClick={() => toggleMonth(monthKey)}
          className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 flex items-center justify-between transition-colors"
        >
          <h4 className="font-semibold text-gray-800">
            {monthNames[month - 1]}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
              {monthIssues.length > 0 ? '1 Issue' : 'No Content'}
            </span>
            {isExpanded ? (
              <ChevronUp size={20} className="text-gray-600" />
            ) : (
              <ChevronDown size={20} className="text-gray-600" />
            )}
          </div>
        </button>

        {/* Month Content */}
        {isExpanded && (
          <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-4">
            {/* Upload Form for Admin */}
            {user?.role === 'admin' && uploadingForMonth?.year === year && uploadingForMonth?.month === month && (
              <IssueUploadForm
                year={year}
                month={month}
                onSuccess={() => {
                  setUploadingForMonth(null);
                  fetchIssuesForYear(year);
                }}
                onCancel={() => setUploadingForMonth(null)}
              />
            )}

            {/* Show Upload Button if no content or not uploading */}
            {user?.role === 'admin' && monthIssues.length === 0 && !uploadingForMonth && (
              <button
                onClick={() => setUploadingForMonth({ year, month })}
                className="w-full py-2 px-4 border-2 border-dashed border-blue-400 text-blue-600 rounded-md hover:border-blue-600 hover:text-blue-700 transition-colors"
              >
                + Add Content for This Month
              </button>
            )}

            {/* Issues Display or Placeholder */}
            {monthIssues.length > 0 ? (
              monthIssues.map(issue => (
                <div key={issue.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {editingId === issue.id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(issue.id)}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-1">
                            {issue.title}
                          </h5>
                          {issue.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {issue.description}
                            </p>
                          )}
                        </div>
                        {user?.role === 'admin' && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => {
                                setEditingId(issue.id);
                                setEditForm({
                                  title: issue.title,
                                  description: issue.description || ''
                                });
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            {deleteConfirm === issue.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(issue.id)}
                                  className="px-2 py-1 text-white bg-red-600 rounded text-xs hover:bg-red-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-1 text-gray-700 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(issue.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* PDF Preview Button */}
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View PDF
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : !uploadingForMonth && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">📄 Content for this month will appear here</p>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setUploadingForMonth({ year, month })}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Upload Content
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render year section
  const renderYear = (year: number) => {
    const isExpanded = expandedYears.includes(year);
    const yearIssues = issues.filter(i => i.year === year);

    return (
      <div key={year} className="mb-6 border-2 border-gray-300 rounded-lg overflow-hidden">
        {/* Year Header */}
        <button
          onClick={() => toggleYear(year)}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-between transition-colors"
        >
          <h3 className="text-2xl font-bold">{year}</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
              {yearIssues.length} Issue{yearIssues.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp size={24} />
            ) : (
              <ChevronDown size={24} />
            )}
          </div>
        </button>

        {/* Year Content */}
        {isExpanded && (
          <div className="px-6 py-6 bg-gray-50 space-y-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month =>
              renderMonth(year, month)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* PDF Viewer Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-96 overflow-hidden flex flex-col">
            <PdfViewer
              pdfUrl={selectedIssue.pdf_url}
              title={selectedIssue.title}
              issueId={selectedIssue.id}
              onClose={() => setSelectedIssue(null)}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 All Issues Archive</h1>
          <p className="text-gray-600">Browse and download our monthly publications</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading issues...</p>
          </div>
        )}

        {/* No Content State */}
        {!loading && years.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
            <p className="text-xl text-gray-500 mb-4">📭 No issues available yet</p>
            {user?.role === 'admin' && (
              <p className="text-gray-600">Start by uploading content for any month!</p>
            )}
          </div>
        )}

        {/* Years List */}
        {!loading && years.length > 0 && (
          <div>
            {years.map(year => renderYear(year))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIssues;
