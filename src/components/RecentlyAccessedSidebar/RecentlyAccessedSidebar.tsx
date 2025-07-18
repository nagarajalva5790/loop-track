
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecentlyAccessedSidebar.module.css';

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
    <aside className={styles.sidebar}>
      <button
        className={styles['sidebar-toggle-btn']}
        aria-label="Hide Recently Accessed"
        onClick={onClose}
      >⟨</button>
      <h4>Recently Accessed</h4>
      <div className={styles['recent-issue-list']}>
        {recent.length === 0 && (
          <div className={styles['no-recent']}>No recently accessed issues.</div>
        )}
        {recent.map((issue: any) => (
          <Link
            to={`/issue/${issue.id}`}
            key={issue.id}
            className={styles['recent-issue-card']}
          >
            <div className={styles['recent-issue-title']}>{issue.title}</div>
            <div className={styles['recent-issue-meta']}>
              Status: {issue.status} | Priority: {issue.priority} | Severity: {issue.severity}
            </div>
            <div className={styles['recent-issue-assignee']}>Assignee: {issue.assignee}</div>
            <div className={styles['recent-issue-tags']}>Tags: {issue.tags?.join(', ')}</div>
          </Link>
        ))}
      </div>
      </aside>
    );
  }
