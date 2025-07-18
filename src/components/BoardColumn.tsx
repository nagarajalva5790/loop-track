import React from 'react';
import { SortableIssue } from './SortableIssue/SortableIssue';
import { Issue, IssueStatus } from '../types';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface Props {
    status: IssueStatus;
    issues: Issue[];
    onMove: (id: string, status: IssueStatus) => void;
    onClick: (issue: Issue) => void;
    sortable?: boolean;
}

const statusList: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];

const IssueCard: React.FC<{
    issue: Issue;
    status: IssueStatus;
    onMove: (id: string, status: IssueStatus) => void;
    onClick?: () => void;
}> = ({ issue, status, onMove, onClick }) => {
    const userRole = useStore(s => s.userRole);
    return (
        <div className="issue-card jira-card" onClick={onClick}>
            <div className="title">{issue.title}</div>
            <div className="meta">
                Assignee: {issue.assignee} | Severity: {issue.severity}
            </div>
            <div className="tags">Tags: {issue.tags.join(', ')}</div>
            {userRole === 'admin' && (
                <div className="card-actions">
                    {statusList
                        .filter(s => s !== status)
                        .map(s => (
                            <button
                                key={s}
                                className="move-btn"
                                onClick={e => {
                                    e.stopPropagation();
                                    onMove(issue.id, s);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export const BoardColumn: React.FC<Props> = ({
    status,
    issues,
    onMove,
    onClick,
    sortable,
}) => {
    const navigate = useNavigate();

    return (
        <div className="board-column jira-column">
            <h3>{status}</h3>
            {issues.map(issue =>
                sortable ? (
                    <SortableIssue key={issue.id} issue={issue} onClick={onClick}>
                        <IssueCard
                            issue={issue}
                            status={status}
                            onMove={onMove}
                            onClick={undefined}
                        />
                    </SortableIssue>
                ) : (
                    <IssueCard
                        key={issue.id}
                        issue={issue}
                        status={status}
                        onMove={onMove}
                        onClick={() => navigate(`/issue/${issue.id}`)}
                    />
                )
            )}
        </div>
    );
};
