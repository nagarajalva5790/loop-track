import React, { useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Issue, IssueStatus } from '../../types';
import { BoardColumn } from '../BoardColumn';
import styles from './DnDBoard.module.css';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

type DnDBoardProps = {
    issues?: Issue[];
};

const STATUSES: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];

export const DnDBoard: React.FC<DnDBoardProps> = ({ issues: propIssues }) => {
    const { issues: storeIssues, moveIssue, setIssues, userRole } = useStore();
    const issues = propIssues || storeIssues;
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
    const navigate = useNavigate();

    // Memoize issues by status for performance
    const issuesByStatus = useMemo(
        () =>
            STATUSES.reduce<Record<IssueStatus, Issue[]>>(
                (acc, status) => ({
                    ...acc,
                    [status]: issues.filter(i => i.status === status),
                }),
                { Backlog: [], 'In Progress': [], Done: [] }
            ),
        [issues]
    );

    // Create droppables for each status
    const droppables: Record<IssueStatus, ReturnType<typeof useDroppable>> = {
        Backlog: useDroppable({ id: 'Backlog' }),
        'In Progress': useDroppable({ id: 'In Progress' }),
        Done: useDroppable({ id: 'Done' }),
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;

        if (STATUSES.includes(overId)) {
            const activeIssue = issues.find(i => i.id === activeId);
            if (activeIssue && activeIssue.status !== overId) {
                moveIssue(activeId, overId as IssueStatus);
            }
            return;
        }

        const activeIssue = issues.find(i => i.id === activeId);
        const overIssue = issues.find(i => i.id === overId);
        if (!activeIssue || !overIssue) return;

        if (activeIssue.status === overIssue.status) {
            const colIssues = issuesByStatus[activeIssue.status];
            const oldIndex = colIssues.findIndex(i => i.id === activeId);
            const newIndex = colIssues.findIndex(i => i.id === overId);
            const newCol = arrayMove(colIssues, oldIndex, newIndex).map(
                (issue, idx) => ({ ...issue, userDefinedRank: colIssues.length - idx })
            );
            const rest = issues.filter(i => i.status !== activeIssue.status);
            setIssues([...rest, ...newCol]);
        } else {
            moveIssue(activeId, overIssue.status);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className={styles.boardColumns}>
                {STATUSES.map(status => (
                    <div
                        key={status}
                        ref={droppables[status].setNodeRef}
                        className={styles.dndColumn}
                    >
                        <SortableContext
                            items={issuesByStatus[status].map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <BoardColumn
                                status={status}
                                issues={issuesByStatus[status]}
                                onMove={userRole === 'admin' ? moveIssue : () => {}}
                                onClick={issue => navigate(`/issue/${issue.id}`)}
                                sortable
                            />
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    );
};
