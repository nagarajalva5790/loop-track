import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const RecentlyAccessedSidebar = ({ expanded, onClose }: { expanded: boolean, onClose: () => void }) => {
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyAccessed') || '[]');
    } catch {
      return [];
    }
  });

  // Listen for localStorage changes (in case other tabs update it)
  useEffect(() => {
    const handler = () => {
      try {
        setRecent(JSON.parse(localStorage.getItem('recentlyAccessed') || '[]'));
      } catch {
        setRecent([]);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Also update when sidebar is opened
  useEffect(() => {
    if (expanded) {
      try {
        setRecent(JSON.parse(localStorage.getItem('recentlyAccessed') || '[]'));
      } catch {
        setRecent([]);
      }
    }
  }, [expanded]);

  if (!expanded) return null;

  return (
    <aside
      className="sidebar"
      style={{
        right: 0,
        transition: 'right 0.3s',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
        zIndex: 1010,
      }}
    >
      <button
        className="sidebar-toggle-btn"
        aria-label="Hide Recently Accessed"
        onClick={onClose}
        style={{ position: 'absolute', left: -36, top: 12, zIndex: 1011 }}
      >⟨</button>
      <h4>Recently Accessed</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recent.length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic', marginTop: 16 }}>No recently accessed issues.</div>
        )}
        {recent.map((issue: any) => (
          <Link
            to={`/issue/${issue.id}`}
            key={issue.id}
            className="recent-issue-card"
            style={{
              display: 'block',
              background: '#f4f5f7',
              border: '1px solid #dfe1e6',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 4,
              textDecoration: 'none',
              color: '#222',
              boxShadow: '0 1px 4px rgba(7,71,166,0.07)',
              transition: 'box-shadow 0.18s, background 0.18s',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>{issue.title}</div>
            <div style={{ fontSize: 13, color: '#888', margin: '2px 0 2px 0' }}>
              Status: {issue.status} | Priority: {issue.priority} | Severity: {issue.severity}
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>Assignee: {issue.assignee}</div>
            <div style={{ fontSize: 13, color: '#f59e42' }}>Tags: {issue.tags?.join(', ')}</div>
          </Link>
        ))}
      </div>
    </aside>
  );
};
