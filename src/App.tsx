import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WhatWeStandFor from './components/WhatWeStandFor';
import SpotlightFeature from './components/SpotlightFeature';
import OurColorfulCredo from './components/OurColorfulCredo';
import Revolutionaries from './components/Revolutionaries';
import Partners from './components/Partners';
import ContactForm from './components/ContactForm';
import GalleryList from './components/GalleryList';
import Gallery from './components/Gallery';
import Debug from './components/Debug';

// Home page component
const HomePage: React.FC = () => (
  <main className="space-y-10 p-5">
    <WhatWeStandFor />
    <SpotlightFeature />
    <OurColorfulCredo />
    <Revolutionaries />
    <Partners />
    <ContactForm />
  </main>
);

const App: React.FC = () => {
  // Check if we're on the debug route
  if (window.location.pathname === '/debug') {
    return <Debug />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-textColor">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/galleries" element={<GalleryList />} />
          <Route path="/galleries/:galleryId" element={<Gallery galleryId="" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
