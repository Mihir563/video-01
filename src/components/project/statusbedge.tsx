interface StatusBadgeProps {
    status: 'pending' | 'processing' | 'completed' | 'failed';
  }
  
  export function StatusBadge({ status }: StatusBadgeProps) {
    const statusClasses = {
      'pending': 'bg-yellow-500/20 text-yellow-500',
      'processing': 'bg-blue-500/20 text-blue-500 animate-pulse',
      'completed': 'bg-primary/20 text-primary',
      'failed': 'bg-destructive/20 text-destructive'
    };
  
    const dotClasses = {
      'pending': 'bg-yellow-500',
      'processing': 'bg-blue-500',
      'completed': 'bg-primary',
      'failed': 'bg-destructive'
    };
  
    const statusLabels = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed'
    };
  
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[status]}`}></span>
        {statusLabels[status]}
      </span>
    );
  }