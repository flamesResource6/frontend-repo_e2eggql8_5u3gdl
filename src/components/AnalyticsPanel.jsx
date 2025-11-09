import { BarChart2, TrendingUp, AlarmClock, Clock } from 'lucide-react'

export default function AnalyticsPanel({ stats }) {
  const { completed = 0, overdue = 0, stuck = 0, postponedReasons = [] } = stats || {}
  return (
    <section className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-indigo-600" size={18} />
          <h2 className="font-semibold">Insights</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">Completed this week</div>
          <div className="text-2xl font-semibold">{completed}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">Overdue</div>
          <div className="text-2xl font-semibold text-rose-600">{overdue}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">Stuck in progress</div>
          <div className="text-2xl font-semibold text-amber-600">{stuck}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><TrendingUp size={16}/> Common postponement reasons</h3>
        {postponedReasons.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet.</p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
            {postponedReasons.map((r, i) => (
              <li key={i} className="flex items-center gap-2"><AlarmClock size={14} className="text-amber-600"/> {r.reason} <span className="text-gray-400">×{r.count}</span></li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-lg border p-3 flex items-center gap-3">
        <Clock size={18} className="text-indigo-600"/>
        <p className="text-sm text-gray-600">Average time in each status and detailed analytics will appear here once enough activity is logged.</p>
      </div>
    </section>
  )
}
