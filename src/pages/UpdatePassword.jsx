import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import {
  AuthCard,
  BackLink,
  Field,
  PasswordInput,
  SubmitButton,
} from "../components/core/Auth/AuthParts"
import { resetPassword } from "../services/operations/authAPI"

export default function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id: tokenParam } = useParams()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setError("")
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (loading) return
    if (password !== confirmPassword) {
      setError("The two passwords don't match.")
      return
    }
    // The reset token is the last part of the link from the email.
    const token = tokenParam || window.location.pathname.split("/").at(-1)
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  return (
    <AuthCard
      title="Choose a new password"
      footer={<BackLink to="/login">Back to log in</BackLink>}
    >
      <p className="mt-3 leading-relaxed text-richblack-50">
        After this you can log in with the new password.
      </p>
      <form onSubmit={handleOnSubmit} className="mt-6 flex flex-col gap-5">
        <Field id="new-password" label="New password">
          <PasswordInput
            id="new-password"
            name="password"
            value={password}
            onChange={handleOnChange}
            autoComplete="new-password"
            minLength={8}
          />
          <p className="text-sm text-richblack-100">At least 8 characters.</p>
        </Field>
        <Field id="confirm-password" label="Confirm new password">
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            autoComplete="new-password"
          />
        </Field>
        {error && <p className="form-error">{error}</p>}
        <SubmitButton loading={loading} loadingText="Saving...">
          Save new password
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
