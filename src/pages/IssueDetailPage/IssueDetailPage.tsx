import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';


export const IssueDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { issues, updateIssue, addRecentlyAccessed } = useStore();
    const userRole = useStore(s => s.userRole);

    const issue = useMemo(() => issues.find(i => i.id === id), [issues, id]);

    useEffect(() => {
        if (issue) addRecentlyAccessed(issue);
    }, [issue, addRecentlyAccessed]);

    const handleResolve = useCallback(() => {
        if (!issue) return;
        updateIssue(issue.id, { status: 'Done' });
        navigate('/board');
    }, [issue, updateIssue, navigate]);

    if (!issue) return <div className="detail-container">Issue not found</div>;

    const {
        title,
        status,
        priority,
        severity,
        assignee,
        createdAt,
        tags,
    } = issue;

    return (
        <div className="detail-container">
            <h2>{title}</h2>
            <div className="meta">Status: {status}</div>
            <div className="meta">Priority: {priority}</div>
            <div className="meta">Severity: {severity}</div>
            <div className="meta">Assignee: {assignee}</div>
            <div className="meta">Created: {new Date(createdAt).toLocaleString()}</div>
            <div className="tags">Tags: {tags.join(', ')}</div>
            {userRole === 'admin' && status !== 'Done' && (
                <button className="resolve-btn" onClick={handleResolve}>
                    Mark as Resolved
                </button>
            )}
        </div>
    );
};
