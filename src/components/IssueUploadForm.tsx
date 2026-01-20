import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { api } from '../lib/api';

interface IssueUploadFormProps {
  year: number;
  month: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const IssueUploadForm: React.FC<IssueUploadFormProps> = ({
  year,
  month,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdf: null as File | null
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setError('');
      setFormData({ ...formData, pdf: file });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.pdf) {
        setError('PDF file is required');
        setLoading(false);
        return;
      }

      const uploadData = new FormData();
      uploadData.append('year', year.toString());
      uploadData.append('month', month.toString());
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description || '');
      uploadData.append('pdf', formData.pdf);

      await api.upload('/issues/upload', uploadData);

      setSuccess(true);
      setFormData({ title: '', description: '', pdf: null });

      // Auto close success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Upload Content for {monthNames[month - 1]} {year}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
            <span>✓ Issue uploaded successfully!</span>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Content Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Monthly Newsletter, Issue #5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
            disabled={loading}
          />
        </div>

        {/* PDF File Input */}
        <div>
          <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-1">
            PDF File <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              required
              disabled={loading}
            />
            <label
              htmlFor="pdf"
              className="block w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-md text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <span className="text-gray-600">
                {formData.pdf ? (
                  <span className="text-green-600 font-medium">
                    ✓ {formData.pdf.name}
                  </span>
                ) : (
                  <span>Click to select PDF file (Max 50MB)</span>
                )}
              </span>
            </label>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add details about this month's content..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <X size={16} />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueUploadForm;
