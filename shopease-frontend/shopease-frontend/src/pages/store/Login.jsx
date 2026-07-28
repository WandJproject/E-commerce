import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(form)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate(result.user.role === 'admin' ? '/admin' : from, { replace: true })
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-neutral-500 mb-6 text-sm">Login to your ShopEase account</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2">{error}</p>}
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full">Login</button>
        <p className="text-xs text-neutral-400 text-center">
          Admin demo: admin@shopease.com / admin123
        </p>
      </form>

      <p className="text-sm text-center text-neutral-500 mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent font-medium hover:underline">Register</Link>
      </p>
    </div>
  )
}
