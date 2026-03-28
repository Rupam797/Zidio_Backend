import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Rightbar from '../components/Rightbar';
import Feed from '../components/Feed';

const Home = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
    <Header />
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1rem 3rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
      <div className="hidden lg:block" style={{ width: 220, flexShrink: 0, position: 'sticky', top: 70 }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, minWidth: 0, maxWidth: 600 }}>
        <Feed />
      </div>
      <Rightbar />
    </main>
  </div>
);

export default Home;