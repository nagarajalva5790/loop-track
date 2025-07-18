import { useEffect, useMemo, useState, useCallback } from 'react';
import { useStore } from '../store';
import { BoardColumn } from '../components/BoardColumn';
import { DnDBoard } from '../components/DnDBoard';
import { RecentlyAccessedSidebar } from '../components/RecentlyAccessedSidebar';
import { Issue, IssueStatus } from '../types';
import { currentUser } from '../constants/currentUser';
import dayjs from 'dayjs';

const getPriorityScore = (issue: Issue) => {
    const daysSinceCreated = dayjs().diff(dayjs(issue.createdAt), 'day');
    const userDefinedRank = issue.userDefinedRank || 0;
    return issue.severity * 10 - daysSinceCreated + userDefinedRank;
};

const sortIssues = (a: Issue, b: Issue) => {
    const scoreA = getPriorityScore(a);
    const scoreB = getPriorityScore(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
};

const statuses: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];

export const BoardPage = () => {
    const { issues, fetchIssues, moveIssue, loading, error, lastSync } = useStore();
    const [search, setSearch] = useState('');
    const [assignee, setAssignee] = useState('');
    const [severity, setSeverity] = useState('');
    const [undo, setUndo] = useState<{ issue: Issue; prevStatus: IssueStatus } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { fetchIssues(); }, [fetchIssues]);

    useEffect(() => {
        const interval = setInterval(fetchIssues, 10000);
        return () => clearInterval(interval);
    }, [fetchIssues]);

    const handleUndo = useCallback(() => {
        if (undo) {
            moveIssue(undo.issue.id, undo.prevStatus);
            setUndo(null);
        }
    }, [undo, moveIssue]);

    const assignees = useMemo(
        () => Array.from(new Set(issues.map(i => i.assignee).filter(Boolean))),
        [issues]
    );
    const severities = useMemo(
        () => Array.from(new Set(issues.map(i => String(i.severity)))),
        [issues]
    );

    const filtered = useMemo(() => {
        const searchLower = search.toLowerCase();
        const assigneeLower = assignee.toLowerCase();
        return issues
            .filter(i => {
                const searchMatch =
                    !search ||
                    i.title.toLowerCase().includes(searchLower) ||
                    (Array.isArray(i.tags) && i.tags.some(t => t.toLowerCase().includes(searchLower)));
                const assigneeMatch =
                    !assignee ||
                    (i.assignee && i.assignee.toLowerCase() === assigneeLower);
                const severityMatch = !severity || String(i.severity) === severity;
                return searchMatch && assigneeMatch && severityMatch;
            })
            .sort(sortIssues);
    }, [issues, search, assignee, severity]);

    return (
        <div className="board-container">
            <div className="board-main">
                <div className="board-toolbar">
                    <input
                        placeholder="Search title or tags..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select value={assignee} onChange={e => setAssignee(e.target.value)}>
                        <option value="">All Assignees</option>
                        {assignees.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <select value={severity} onChange={e => setSeverity(e.target.value)}>
                        <option value="">All Severities</option>
                        {severities.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <span className="last-sync">Last sync: {lastSync}</span>
                </div>
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading-message">Loading...</div>}
                {currentUser.role === 'admin' ? (
                    <DnDBoard issues={filtered} />
                ) : (
                    <div className="board-columns">
                        {statuses.map(status => (
                            <BoardColumn
                                key={status}
                                status={status}
                                issues={filtered.filter(i => i.status === status)}
                                onMove={() => {}}
                                onClick={() => {}}
                            />
                        ))}
                    </div>
                )}
                {undo && (
                    <div className="undo-toast">
                        Issue moved. <button className="undo-btn" onClick={handleUndo}>Undo</button>
                    </div>
                )}
            </div>
            <button
                className="sidebar-toggle-btn"
                aria-label={sidebarOpen ? 'Hide Recently Accessed' : 'Show Recently Accessed'}
                onClick={() => setSidebarOpen(o => !o)}
                style={{
                    position: 'fixed',
                    right: sidebarOpen ? 270 : 0,
                    top: 80,
                    zIndex: 1010,
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'right 0.3s, transform 0.3s',
                }}
            >
                {sidebarOpen ? '⟨' : '⟩'}
            </button>
            <RecentlyAccessedSidebar expanded={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
    );
};
