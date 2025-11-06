import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; // Also good to add .jsx here
import DashboardPage from '../../pages/DashboardPage.jsx';
import ChatPage from '../../pages/ChatPage.jsx';
import SummarizePage from '../../pages/SummarizePage.jsx';
import ComparePage from '../../pages/ComparePage.jsx';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      
      <main className="flex-grow p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} /> 
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/summarize" element={<SummarizePage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppLayout;