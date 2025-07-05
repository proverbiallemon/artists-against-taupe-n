import React from 'react';
import Header from './components/Header';
import WhatWeStandFor from './components/WhatWeStandFor';
import SpotlightFeature from './components/SpotlightFeature';
import OurColorfulCredo from './components/OurColorfulCredo';
import Revolutionaries from './components/Revolutionaries';
import Partners from './components/Partners';
import ContactForm from './components/ContactForm';
import Debug from './components/Debug';

const App: React.FC = () => {
  // Check if we're on the debug route
  if (window.location.pathname === '/debug') {
    return <Debug />;
  }

  return (
    <div className="min-h-screen bg-background text-textColor">
      <Header />
      <main className="space-y-10 p-5">
        <WhatWeStandFor />
        <SpotlightFeature />
        <OurColorfulCredo />
        <Revolutionaries />
        <Partners />
        <ContactForm />
      </main>
    </div>
  );
};

export default App;
