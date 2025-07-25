import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import OurColorfulCredo from './components/OurColorfulCredo';
import GalleryList from './components/GalleryList';
import Gallery from './components/Gallery';
import Debug from './components/Debug';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import About from './pages/About';
import Artists from './pages/Artists';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminGalleries from './pages/AdminGalleries';
import AdminGalleryEdit from './pages/AdminGalleryEdit';
import AdminMigrateGallery from './pages/AdminMigrateGallery';

// Home page component with simplified content
const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <div className="space-y-10 p-5">
        <section className="max-w-screen-lg mx-auto bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
          <p className="text-lg text-gray-800 mb-4">
            Artists Against Taupe is transforming institutional spaces through vibrant murals and artwork. 
            We believe that color has the power to heal, inspire hope, and create environments where 
            people feel valued and cared for.
          </p>
          <Link to="/about" className="text-primary hover:text-secondary font-bold">
            Learn more about our story →
          </Link>
        </section>
        
        <section className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">Featured Gallery</h2>
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-secondary mb-4">Safe Place Art Takeover Louisville</h3>
            <p className="text-gray-700 mb-4">
              Our flagship project at the YMCA Safe Place Shelter, where we've transformed every wall 
              and room with vibrant murals, creating a healing environment for at-risk youth.
            </p>
            <Link 
              to="/galleries/safe-place-louisville" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
            >
              View Gallery
            </Link>
          </div>
        </section>
        
        <OurColorfulCredo />
      </div>
    </main>
  );
};

const App: React.FC = () => {
  // Check if we're on the debug route
  if (window.location.pathname === '/debug') {
    return <Debug />;
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-textColor flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/galleries" element={<GalleryList />} />
              <Route path="/galleries/:galleryId" element={<Gallery galleryId="" />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/:id/edit" element={
                <ProtectedRoute>
                  <AdminPostEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/new" element={
                <ProtectedRoute>
                  <AdminPostEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/galleries" element={
                <ProtectedRoute>
                  <AdminGalleries />
                </ProtectedRoute>
              } />
              <Route path="/admin/galleries/:galleryId" element={
                <ProtectedRoute>
                  <AdminGalleryEdit />
                </ProtectedRoute>
              } />
              <Route path="/admin/migrate-gallery" element={
                <ProtectedRoute>
                  <AdminMigrateGallery />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
