import { NavLink } from 'react-router-dom'

const Stepper = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center gap-3 text-base font-semibold">
      <NavLink
        to="/ingredients"
        className={({ isActive }) =>
          `flex flex-1 items-center justify-between gap-3 rounded-full px-5 py-3 transition ${
            isActive
              ? 'bg-amber-200 text-amber-950 shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900'
          } dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white`
        }
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-amber-900 shadow-sm dark:bg-slate-950 dark:text-amber-200">
          1
        </span>
        <span className="flex-1 text-left">Ingredients</span>
      </NavLink>
      <NavLink
        to="/story"
        className={({ isActive }) =>
          `flex flex-1 items-center justify-between gap-3 rounded-full px-5 py-3 transition ${
            isActive
              ? 'bg-sky-200 text-sky-950 shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900'
          } dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white`
        }
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-sky-900 shadow-sm dark:bg-slate-950 dark:text-sky-200">
          2
        </span>
        <span className="flex-1 text-left">Your Story</span>
      </NavLink>
    </div>
  )
}

export default Stepper
