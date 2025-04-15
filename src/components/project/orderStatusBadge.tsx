"use client";

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  // Define styles for different status types
  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    'Y': { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Complete' },
    'N': { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Pending' },
    'P': { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Processing' },
    'E': { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Error' },
  };

  // Get style for current status or use default
  const style = statusStyles[status] || { 
    bg: 'bg-gray-500/20', 
    text: 'text-gray-500',
    label: 'Unknown'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
