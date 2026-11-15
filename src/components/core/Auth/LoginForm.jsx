import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"
import { Field, PasswordInput, SubmitButton } from "./AuthParts"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const { email, password } = formData

  const handleOnChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (loading) return
    dispatch(login(email.trim(), password, navigate))
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-5">
      <Field id="login-email" label="Email">
        <input
          required
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleOnChange}
          className="form-style w-full"
        />
      </Field>
      <Field
        id="login-password"
        label="Password"
        aside={
          <Link to="/forgot-password" className="text-sm font-medium text-yellow-50 hover:underline">
            Forgot password?
          </Link>
        }
      >
        <PasswordInput
          id="login-password"
          name="password"
          value={password}
          onChange={handleOnChange}
          autoComplete="current-password"
        />
      </Field>
      <SubmitButton loading={loading} loadingText="Logging in...">
        Log in
      </SubmitButton>
    </form>
  )
}

export default LoginForm
