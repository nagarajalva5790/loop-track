import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../types';

interface SortableIssueProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
  children: React.ReactNode;
}

export const SortableIssue: React.FC<SortableIssueProps> = ({ issue, onClick, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: issue.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'box-shadow 0.2s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1)',
    opacity: isDragging ? 0.7 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 'auto',
    boxShadow: isDragging
      ? '0 8px 24px 0 rgba(254,119,67,0.25), 0 0 0 2px #FE7743'
      : isOver
        ? '0 2px 8px 0 rgba(254,119,67,0.10)'
        : '0 1px 4px 0 rgba(0,0,0,0.06)',
    borderRadius: 8,
    background: isDragging ? '#fffbe9' : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging-card' : ''}
      {...attributes}
      {...listeners}
      onClick={() => onClick(issue)}
    >
      {children}
    </div>
  );
};
