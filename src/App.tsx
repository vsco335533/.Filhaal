import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Research } from './pages/Research';
import { Videos } from './pages/Videos';
import { Gallery } from './pages/Gallery';
import Books from './pages/Books';
import { PostDetail } from './pages/PostDetail';
import { Contact } from './pages/Contact';
import { ResearcherDashboard } from './pages/ResearcherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PostEditor } from './pages/PostEditor';
import TermsAndPolicies from './pages/TermsAndPolicies';
import About from './pages/About';
import Donations from './pages/Donations';
import LetterToEditor from './pages/LetterToEditor';
import WriteInFilhaal from './pages/WriteInFilhaal';
import Discussion from './pages/Discussion';
import DebateDetail from './pages/debates/[id]';
import DebateAdminUpload from './pages/DebateAdminUpload';
import CategoryHandler from './pages/CategoryHandler';
import PreviousEditions from './pages/PreviousEditions';
import EditionDetail from './pages/previous-editions/[id]';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/research" element={<Research />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/books" element={<Books />} />
              <Route path="/posts/:slug" element={<PostDetail />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ResearcherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/new-post"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/edit/:id"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/terms-and-policies" element={<TermsAndPolicies />} />
              <Route path="/about" element={<About />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/letter-to-editor" element={<LetterToEditor />} />
              {/* alias to match external Filhaal URL */}
              <Route path="/write-in-filhaal" element={<WriteInFilhaal />} />
              <Route path="/debates" element={<Discussion />} />
              <Route
                path="/debates/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <DebateAdminUpload />
                  </ProtectedRoute>
                }
              />
              <Route path="/debates/:id" element={<DebateDetail />} />
              <Route path="/category/:slug" element={<CategoryHandler />} />
              <Route path="/previous-editions" element={<PreviousEditions />} />
              <Route path="/previous-editions/:id" element={<EditionDetail />} />
              <Route path="/previous-editions/:id/:month" element={<EditionDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
