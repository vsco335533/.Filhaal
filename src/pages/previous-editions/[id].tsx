import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import IssueUploadForm from "../../components/IssueUploadForm";
import PdfViewer from "../../components/PdfViewerIssue";

interface Issue {
  id: string;
  year: number;
  month: number;
  title: string;
  description?: string;
  pdf_url: string;
  created_at: string;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// Year view component
function YearView({ id }: { id: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-black text-white text-center py-2 font-semibold mb-6">
        All previous points
      </div>

      <h1 className="text-xl font-bold text-center mb-8">
        Issues of {id}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 text-center text-lg">
        {MONTHS.map((m) => (
          <Link
            key={m}
            to={`/previous-editions/${id}/${m.toLowerCase()}`}
            className="hover:text-red-700"
          >
            {m} {id}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Month view component
function MonthView({ year, month }: { year: number; month: string }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingForMonth, setUploadingForMonth] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const monthNum = MONTHS.findIndex(m => m.toLowerCase() === month) + 1;

  const fetchIssues = async (year: number, monthNum: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/issues/content?year=${year}&month=${monthNum}`);
      setIssues(response.issues || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (issueId: string) => {
    try {
      await api.delete(`/issues/${issueId}`);
      setIssues(issues.filter(issue => issue.id !== issueId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete issue:', error);
    }
  };

  const handleUpdate = async (issueId: string) => {
    try {
      await api.put(`/issues/${issueId}`, editForm);
      setIssues(
        issues.map(issue =>
          issue.id === issueId
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

  useEffect(() => {
    fetchIssues(year, monthNum);
  }, [year, month, monthNum]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-black text-white text-center py-2 font-semibold mb-6">
        All previous points
      </div>

      <h1 className="text-xl font-bold text-center mb-6">
        Issues for {month} {year}
      </h1>

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

      {/* Admin Upload Form */}
      {user?.role === 'super_admin' && uploadingForMonth && (
        <div className="mb-6">
          <IssueUploadForm
            year={year}
            month={monthNum}
            onSuccess={() => {
              setUploadingForMonth(false);
              fetchIssues(year, monthNum);
            }}
            onCancel={() => setUploadingForMonth(false)}
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading issues...</p>
        </div>
      ) : issues.length > 0 ? (
        <div className="space-y-4">
          {issues.map(issue => (
            <div key={issue.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {editingId === issue.id ? (
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
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {issue.title}
                      </h3>
                      {issue.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {issue.description}
                        </p>
                      )}
                    </div>
                    {user?.role === 'super_admin' && (
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

                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View PDF
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">📄 Content for this month will appear here</p>
          {user?.role === 'super_admin' && (
            <button
              onClick={() => setUploadingForMonth(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Content
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Main component
export default function EditionDetail() {
  const { id, month } = useParams();

  if (!id) {
    return <div className="text-center py-8">Invalid year</div>;
  }

  // Year view
  if (!month) {
    return <YearView id={id} />;
  }

  // Month view
  return <MonthView year={parseInt(id)} month={month} />;
}
