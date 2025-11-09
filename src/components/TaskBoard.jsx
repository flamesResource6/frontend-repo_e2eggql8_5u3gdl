import { useMemo, useState } from 'react'
import TaskCard from './TaskCard'

const flow = ['Backlog', 'To Do', 'In Progress', 'Done', 'Postponed', 'Cancelled']

export default function TaskBoard({ tasks, onAdvance, onGuardrail }) {
  const columns = useMemo(() => flow.map((s) => ({ key: s, title: s })), [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="bg-gray-50 rounded-xl border p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">{col.title}</h3>
            <span className="text-xs text-gray-400">{tasks.filter(t => t.status === col.key).length}</span>
          </div>
          <div className="space-y-3 min-h-[80px]">
            {tasks.filter(t => t.status === col.key).map((t) => (
              <TaskCard key={t.id} task={t} onChangeStatus={(task) => {
                if (['Postponed','Cancelled'].includes(task.status)) {
                  onGuardrail(task)
                } else {
                  onAdvance(task)
                }
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
