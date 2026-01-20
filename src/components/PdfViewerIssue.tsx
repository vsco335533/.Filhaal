import React, { useState } from 'react';
import { Download, X, Eye } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
  issueId?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, title, onClose, issueId }) => {
  const [fullscreen, setFullscreen] = useState(false);

  // Use proxy URL for iframe to avoid CORS issues
  const iframeUrl = issueId 
    ? `/api/issues/pdf-proxy/${issueId}` 
    : pdfUrl;
  
  // Use the direct Cloudinary URL for downloads
  const downloadFilename = title.endsWith('.pdf') ? title : `${title}.pdf`;

  // Handle fullscreen state and body overflow
  React.useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullscreen]);

  // Log for debugging
  React.useEffect(() => {
    console.log('[PdfViewer] PDF URL:', pdfUrl);
    console.log('[PdfViewer] Iframe URL:', iframeUrl);
    console.log('[PdfViewer] Download filename:', downloadFilename);
  }, [pdfUrl, iframeUrl, downloadFilename]);

  // Handle download with fetch to ensure proper PDF handling
  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create a proper blob with PDF mime type
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback: use simple download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = downloadFilename;
      link.click();
    }
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-40 bg-black' : 'relative w-full'}`} style={fullscreen ? { width: '100vw', height: '100vh' } : {}}>
      {/* Header with controls */}
      <div className={`${fullscreen ? 'fixed top-0 left-0 right-0 z-50' : ''} bg-gray-900 text-white p-4 flex justify-between items-center`}>
        <h3 className="font-semibold truncate flex-1">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors"
            title="Download PDF"
          >
            <Download size={16} />
            Download
          </button>
          {fullscreen && (
            <button
              onClick={() => setFullscreen(false)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              title="Exit fullscreen"
            >
              <X size={16} />
            </button>
          )}
          {onClose && !fullscreen && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div 
        className={`${fullscreen ? 'fixed left-0 right-0 bottom-0 z-40' : 'w-full h-96'} bg-gray-100 relative`}
        style={fullscreen ? { top: '64px', width: '100vw', height: 'calc(100vh - 64px)' } : {}}
      >
        <iframe
          src={`${iframeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-full border-0"
          title={`PDF Viewer - ${title}`}
          style={{ 
            display: 'block',
            border: 'none'
          }}
        />

        {/* Fullscreen button */}
        {!fullscreen && (
          <button
            onClick={() => setFullscreen(true)}
            className="absolute top-2 right-2 z-10 p-2 bg-white rounded-md shadow-lg hover:shadow-xl transition-shadow"
            title="View fullscreen"
          >
            <Eye size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
