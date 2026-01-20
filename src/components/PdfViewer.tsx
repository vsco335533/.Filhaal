import React from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface Props {
  url: string;
  filename?: string;
}

export default function PdfViewer({ url, filename }: Props) {
  const safeFilename = (filename || 'document').replace(/\.[^/.]+$/, '') + '.pdf';
  
  // Get backend base URL
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  const proxyUrl = backendBase + `/api/debates/proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;
  
  console.log('[PdfViewer] Using proxyUrl:', proxyUrl);

  return (  
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-sm font-semibold">PDF Preview</div>
        <div className="flex-1" />
        {/* <button 
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" 
          onClick={() => {
            const a = document.createElement('a');
            a.href = proxyUrl;
            a.download = safeFilename;
            a.click();
          }}
        >
          Download
        </button> */}
        <button 
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" 
          onClick={() => window.open(proxyUrl, '_blank')}
        >
          Open
        </button>
      </div>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
        <iframe 
          src={proxyUrl} 
          title="PDF Preview" 
          className="w-full"
          style={{ height: '85vh', border: 'none' }}
          onError={() => {
            console.error('[PdfViewer] iframe failed to load from:', proxyUrl);
          }} 
        />
      </div>
    </div>
  );
}
