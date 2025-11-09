const levelStyles = {
  Critical: 'bg-rose-100 text-rose-700 ring-rose-200',
  High: 'bg-amber-100 text-amber-700 ring-amber-200',
  Medium: 'bg-blue-100 text-blue-700 ring-blue-200',
  Low: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

export default function TaskPriorityBadge({ level = 'Medium', compact = false }) {
  const style = levelStyles[level] || levelStyles.Medium
  return (
    <span className={`inline-flex items-center ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'} font-medium rounded-full ring-1 ${style}`}>
      {level}
    </span>
  )
}
