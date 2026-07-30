import React from 'react'
import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminHeader({ title, onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between bg-white border-b border-neutral-200 px-5 py-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-brand">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent-soft text-accent grid place-items-center font-semibold text-sm">
          {(user?.name || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-neutral-500">Administrator</p>
        </div>
      </div>
    </header>
  )
}
