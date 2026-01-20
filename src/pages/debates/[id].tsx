import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../../lib/api';
import PdfViewer from '../../components/PdfViewer';

const DebateDetail: React.FC = () => {
  const params = useParams();
  const id = params.id ?? '';
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet<{ pdfUrl?: string | null; title?: string | null; description?: string | null }>(`/debate?id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (!mounted) return;
        setPdfUrl(res.pdfUrl ?? null);
        setTitle(res.title ?? null);
        setDescription(res.description ?? null);
      })
      .catch((err) => setError(err.message || 'Failed to load debate'))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">{title || 'Debate'}</h1>
      {description && <p className="mb-4">{description}</p>}
      {pdfUrl ? (
        <div>
          {/* Use PdfViewer to render PDF with controls (zoom, download, print) */}
          <PdfViewer url={pdfUrl} filename={title ?? undefined} />
        </div>
      ) : (
        <div>No PDF available for this debate.</div>
      )}
    </div>
  );
};

export default DebateDetail;
