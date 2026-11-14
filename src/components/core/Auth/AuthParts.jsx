import { useState } from "react"
import { Link } from "react-router-dom"

// The centred card every auth screen sits in.
export function AuthCard({ title, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <div className="w-full max-w-[480px] rounded-xl border border-richblack-700 bg-richblack-800 p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold leading-tight text-richblack-5">{title}</h1>
        {children}
        {footer && <div className="mt-6 border-t border-richblack-700 pt-5 text-sm">{footer}</div>}
      </div>
    </div>
  )
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="font-bold text-richblack-50 hover:text-richblack-5 hover:underline">
      ← {children}
    </Link>
  )
}

export function Field({ id, label, children, aside }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="lable-style">
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  )
}

// Password input with a text Show / Hide toggle.
export function PasswordInput({ id, name, value, onChange, autoComplete, minLength }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        required
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        className="form-style w-full pr-16"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-1 my-1 rounded-md px-3 text-sm font-bold text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  )
}

export function SubmitButton({ loading, children, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-lg bg-yellow-50 px-5 py-3 font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingText : children}
    </button>
  )
}
