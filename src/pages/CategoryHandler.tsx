import { useParams, Navigate } from 'react-router-dom';

export default function CategoryHandler() {
  const { slug } = useParams();
  if (!slug) return <Navigate to="/" replace />;

  const s = decodeURIComponent(slug).toLowerCase();

  if (s.includes('discussion')) return <Navigate to="/debates" replace />;
  if (s.includes('editor')) return <Navigate to="/write-in-filhaal" replace />;
  if (s.includes('currently')) return <Navigate to="/write-in-filhaal" replace />;
  if (s.includes('membership')) return <Navigate to="/donations" replace />;
  if (s.includes('issues')) return <Navigate to="/issues" replace />;

  // Default: forward to research page with category query
  return <Navigate to={`/research?category=${encodeURIComponent(s)}`} replace />;
}
