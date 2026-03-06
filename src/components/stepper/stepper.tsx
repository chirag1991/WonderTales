import { NavLink } from 'react-router-dom'

const Stepper = () => {
  return (
    <div className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <NavLink
        to="/ingredients"
        className={({ isActive }) =>
          `inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
            isActive
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50'
              : 'hover:bg-white/50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-50'
          }`
        }
      >
        <span className="flex items-center gap-2">
          <span>🎭</span>
          <span>Hero</span>
        </span>
      </NavLink>
      <NavLink
        to="/story"
        className={({ isActive }) =>
          `inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
            isActive
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50'
              : 'hover:bg-white/50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-50'
          }`
        }
      >
        <span className="flex items-center gap-2">
          <span>📖</span>
          <span>Story</span>
        </span>
      </NavLink>
    </div>
  )
}

export default Stepper
