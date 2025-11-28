import React from 'react';
import { AppSideMenu } from './';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      <AppSideMenu />
      <main className="ml-[20rem] h-screen p-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
