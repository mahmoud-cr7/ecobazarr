/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from 'react';
import NavBar from '../navBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';

interface LayoutProps {
  // Define your props here
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Dynamic Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;