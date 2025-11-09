import { useMemo, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import TaskBoard from './components/TaskBoard'
import AnalyticsPanel from './components/AnalyticsPanel'
import TaskPriorityBadge from './components/TaskPriorityBadge'

// Demo data to showcase the UX only. Backend with AI + DB can be wired next.
const initialTasks = [
  {
    id: 't1',
    title: 'Design onboarding flow',
    description: 'Create wireframes and final designs for user onboarding experience.',
    assignee: 'Alex',
    due: '2025-11-12 17:00',
    created: '2025-11-08',
    priority: 'High',
    status: 'To Do',
  },
  {
    id: 't2',
    title: 'Implement calendar sync',
    description: 'Integrate Google Calendar for predictive time blocking.',
    assignee: 'Jordan',
    due: '2025-11-10 09:00',
    created: '2025-11-07',
    priority: 'Critical',
    status: 'In Progress',
  },
  {
    id: 't3',
    title: 'Draft daily digest template',
    description: 'Email layout for critical tasks, overdue items and stuck tasks.',
    assignee: 'Taylor',
    due: '2025-11-11 12:00',
    created: '2025-11-07',
    priority: 'Medium',
    status: 'Backlog',
  },
  {
    id: 't4',
    title: 'Vendor contract review',
    description: 'Legal review of vendor contract and SLAs.',
    assignee: 'Sam',
    due: '2025-11-09 18:00',
    created: '2025-11-08',
    priority: 'Low',
    status: 'Postponed',
  },
]

const flow = ['Backlog','To Do','In Progress','Done','Postponed','Cancelled']

function getNextStatus(current) {
  const idx = flow.indexOf(current)
  if (idx === -1) return current
  // If at "In Progress", next could be Done | Postponed | Cancelled — we default to Done for demo
  if (current === 'In Progress') return 'Done'
  if (idx < flow.length - 1) return flow[idx + 1]
  return current
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [showFocus, setShowFocus] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [guardrailTask, setGuardrailTask] = useState(null)
  const [reason, setReason] = useState('')

  const stats = useMemo(() => ({
    completed: tasks.filter(t => t.status === 'Done').length,
    overdue: tasks.filter(t => ['To Do','In Progress'].includes(t.status)).filter(t => new Date(t.due) < new Date()).length,
    stuck: tasks.filter(t => t.status === 'In Progress').length,
    postponedReasons: [
      { reason: 'Waiting on dependency', count: 3 },
      { reason: 'Scope change', count: 2 },
    ],
  }), [tasks])

  function handleAdvance(task) {
    const next = getNextStatus(task.status)
    if (['Postponed','Cancelled'].includes(next)) {
      setGuardrailTask({ ...task, next })
      return
    }
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t))
  }

  function handleGuardrail(task) {
    // Force a reason modal if moving to Postponed/Cancelled
    setGuardrailTask({ ...task, next: task.status })
  }

  function confirmReason() {
    if (!reason.trim()) return
    setTasks(prev => prev.map(t => t.id === guardrailTask.id ? { ...t, status: guardrailTask.next, reasonLog: [...(t.reasonLog || []), { reason, at: new Date().toISOString() }] } : t))
    setReason('')
    setGuardrailTask(null)
  }

  function quickAdd(task) {
    setTasks(prev => [
      { ...task, id: `t${prev.length + 1}`, created: new Date().toISOString().slice(0,10), status: 'Backlog' },
      ...prev,
    ])
    setQuickAddOpen(false)
  }

  const currentFocus = useMemo(() => tasks.find(t => t.status === 'In Progress'), [tasks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50">
      <HeaderBar onQuickAdd={() => setQuickAddOpen(true)} onToggleFocus={() => setShowFocus(v => !v)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {showFocus && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            {currentFocus ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Focus Mode: {currentFocus.title}</h2>
                  <TaskPriorityBadge level={currentFocus.priority} />
                </div>
                <p className="mt-2 text-gray-600">{currentFocus.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm" onClick={() => handleAdvance(currentFocus)}>Mark next</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No task is currently In Progress.</p>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskBoard tasks={tasks} onAdvance={handleAdvance} onGuardrail={handleGuardrail} />
          </div>
          <div className="space-y-6">
            <AnalyticsPanel stats={stats} />
            <section className="bg-white rounded-xl border p-4 shadow-sm">
              <h2 className="font-semibold mb-2">Activity Stream</h2>
              <p className="text-sm text-gray-600">All updates, reasons and status changes will appear here when connected to the backend.</p>
            </section>
          </div>
        </div>
      </main>

      {quickAddOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-end sm:items-center justify-center p-4" onClick={() => setQuickAddOpen(false)}>
          <div className="bg-white rounded-xl w-full sm:max-w-md p-4 shadow-xl border" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Quick Capture</h3>
            <QuickCaptureForm onSubmit={quickAdd} onCancel={() => setQuickAddOpen(false)} />
          </div>
        </div>
      )}

      {guardrailTask && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-end sm:items-center justify-center p-4" onClick={() => setGuardrailTask(null)}>
          <div className="bg-white rounded-xl w-full sm:max-w-md p-4 shadow-xl border" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold">Provide a reason</h3>
            <p className="text-sm text-gray-600 mt-1">Changing status to {guardrailTask.next} requires a reason.</p>
            <textarea value={reason} onChange={e => setReason(e.target.value)} className="mt-3 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={3} placeholder="Why is this being postponed or cancelled?" />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm" onClick={() => setGuardrailTask(null)}>Cancel</button>
              <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700" onClick={confirmReason}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QuickCaptureForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('')
  const [due, setDue] = useState('')
  const [priority, setPriority] = useState('Medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title, description, assignee, due, priority })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm text-gray-700">Task Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="e.g., Draft PRD for v2" />
      </div>
      <div>
        <label className="text-sm text-gray-700">Detailed Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Key context, goals, constraints..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-700">Assignee</label>
          <input value={assignee} onChange={e => setAssignee(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Name" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Due Date & Time</label>
          <input type="datetime-local" value={due} onChange={e => setDue(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-700">Task‑Focus</label>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm">Close</button>
        <button type="submit" className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Add Task</button>
      </div>
    </form>
  )
}
