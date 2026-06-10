import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AccountSidebar from './_components/AccountSidebar';

export default function AccountLayout({
  children,
}: {
  children : React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAFAFA] py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <AccountSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
