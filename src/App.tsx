import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage/IssueDetailPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';


import { Navigation } from './layouts/Navigation';

export const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/issue/:id" element={<IssueDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/board" />} />
      </Routes>
    </Router>
  );
}