import { CalendarDays, User, Clock, ChevronRight, PauseCircle, XCircle, CheckCircle2 } from 'lucide-react'
import TaskPriorityBadge from './TaskPriorityBadge'

const statusColors = {
  Backlog: 'border-gray-200',
  'To Do': 'border-sky-200',
  'In Progress': 'border-indigo-300',
  Done: 'border-emerald-300',
  Postponed: 'border-amber-300',
  Cancelled: 'border-rose-300',
}

export default function TaskCard({ task, onChangeStatus }) {
  const color = statusColors[task.status] || 'border-gray-200'
  return (
    <div className={`bg-white border ${color} rounded-lg p-4 shadow-sm hover:shadow transition`}> 
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
            <TaskPriorityBadge level={task.priority} compact />
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <button
          onClick={() => onChangeStatus(task)}
          className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
          title="Advance status"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <div className="inline-flex items-center gap-1"><User size={14} />{task.assignee}</div>
        <div className="inline-flex items-center gap-1"><CalendarDays size={14} />{task.due}</div>
        <div className="inline-flex items-center gap-1"><Clock size={14} />Created {task.created}</div>
      </div>
      {task.status === 'In Progress' && (
        <div className="mt-3 text-xs text-indigo-700 bg-indigo-50 rounded-md px-2 py-1 inline-flex items-center gap-1">
          <Clock size={14} /> In progress
        </div>
      )}
      {task.status === 'Postponed' && (
        <div className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1 inline-flex items-center gap-1">
          <PauseCircle size={14} /> Postponed
        </div>
      )}
      {task.status === 'Cancelled' && (
        <div className="mt-3 text-xs text-rose-700 bg-rose-50 rounded-md px-2 py-1 inline-flex items-center gap-1">
          <XCircle size={14} /> Cancelled
        </div>
      )}
      {task.status === 'Done' && (
        <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 rounded-md px-2 py-1 inline-flex items-center gap-1">
          <CheckCircle2 size={14} /> Completed
        </div>
      )}
    </div>
  )
}
