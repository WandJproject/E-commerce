import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    const result = register(form)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate('/')
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-neutral-500 mb-6 text-sm">Join ShopEase to start shopping</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2">{error}</p>}
        <div>
          <label className="text-sm font-medium block mb-1">Full Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field"
            placeholder="Jane Doe"
          />
        </div>
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
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary w-full">Create Account</button>
      </form>

      <p className="text-sm text-center text-neutral-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-medium hover:underline">Login</Link>
      </p>
    </div>
  )
}
