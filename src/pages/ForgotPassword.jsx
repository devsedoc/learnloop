import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AuthCard, BackLink, Field, SubmitButton } from "../components/core/Auth/AuthParts"
import { getPasswordResetToken } from "../services/operations/authAPI"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (loading) return
    dispatch(getPasswordResetToken(email.trim(), setEmailSent))
  }

  return (
    <AuthCard
      title={emailSent ? "Check your email" : "Reset your password"}
      footer={<BackLink to="/login">Back to log in</BackLink>}
    >
      {emailSent ? (
        <>
          <p className="mt-3 leading-relaxed text-richblack-50">
            We sent a link to choose a new password to{" "}
            <span className="font-medium text-richblack-5">{email}</span>. It can take a few
            minutes, so check your spam folder too.
          </p>
          <form onSubmit={handleOnSubmit} className="mt-6 flex flex-col gap-3">
            <SubmitButton loading={loading} loadingText="Sending...">
              Send the link again
            </SubmitButton>
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
            >
              Use a different email
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-3 leading-relaxed text-richblack-50">
            Enter the email you signed up with and we'll send you a link to choose
            a new password.
          </p>
          <form onSubmit={handleOnSubmit} className="mt-6 flex flex-col gap-5">
            <Field id="forgot-email" label="Email">
              <input
                required
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-style w-full"
              />
            </Field>
            <SubmitButton loading={loading} loadingText="Sending...">
              Send reset link
            </SubmitButton>
          </form>
        </>
      )}
    </AuthCard>
  )
}
