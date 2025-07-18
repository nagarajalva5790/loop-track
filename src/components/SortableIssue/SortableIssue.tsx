
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../../types';
import styles from './SortableIssue.module.css';

interface SortableIssueProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
  children: React.ReactNode;
}

export const SortableIssue: React.FC<SortableIssueProps> = ({ issue, onClick, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: issue.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1000 : 'auto',
  };
  let className = styles['sortable-issue'];
  if (isDragging) className += ' ' + styles['dragging'];
  else if (isOver) className += ' ' + styles['over'];
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
      onClick={() => onClick(issue)}
    >
      {children}
    </div>
  );
};
