import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Rightbar from '../components/Rightbar';
import Feed from '../components/Feed';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto pt-5 px-4 pb-12 flex gap-5 items-start">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[220px] flex-shrink-0 sticky top-[70px]">
          <Sidebar />
        </div>

        {/* Feed */}
        <div className="flex-1 min-w-0 max-w-[600px]">
          <Feed />
        </div>

        {/* Right bar */}
        <Rightbar />
      </main>
    </div>
  );
};

export default Home;
