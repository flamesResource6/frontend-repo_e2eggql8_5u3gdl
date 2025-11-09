import { Plus, Rocket, Settings, Bell } from 'lucide-react'

export default function HeaderBar({ onQuickAdd, onToggleFocus, notifications = 0 }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white">
            <Rocket size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">IntelliTasks</h1>
            <p className="text-xs text-gray-500 -mt-0.5">Next‑gen intelligent task manager</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFocus}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium hover:bg-gray-50"
          >
            Focus Mode
          </button>
          <button
            onClick={onQuickAdd}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            <Plus size={16} /> Quick Capture
          </button>
          <button className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-gray-50">
            <Bell size={18} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <button className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-gray-50">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
