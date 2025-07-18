import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export const Navigation = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <nav className="jira-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 64 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.location.pathname = '/'}
        >
          <img src={process.env.PUBLIC_URL + '/loopTrack-logo.svg'} alt="LoopTrack Logo" style={{ width: 36, height: 36, marginRight: 8 }} />
          <span className="logo">LoopTrack</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, justifyContent: 'center' }}>
          <Link className="jira-nav-link" to="/board" style={{ fontSize: 18 }}>Board</Link>
          <Link className="jira-nav-link" to="/settings" style={{ fontSize: 18 }}>Settings</Link>
        </div>
        <button className="jira-nav-link" style={{ marginLeft: 'auto' }} onClick={() => setDark(d => !d)}>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
      <div style={{ position: 'fixed', bottom: 12, right: 18, fontSize: 13, color: '#64748b', zIndex: 9999, background: 'rgba(255,255,255,0.85)', padding: '4px 12px', borderRadius: 8, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)' }}>
        © 2025 nagarajalva5790@gmail.com
      </div>
    </>
  );
};