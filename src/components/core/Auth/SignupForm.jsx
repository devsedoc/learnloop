import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { Field, PasswordInput, SubmitButton } from "./AuthParts"

const roles = [
  { type: ACCOUNT_TYPE.STUDENT, title: "Student", text: "Buy and take courses" },
  { type: ACCOUNT_TYPE.INSTRUCTOR, title: "Instructor", text: "Publish your own courses" },
]

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { firstName, lastName, email, password, confirmPassword } = formData

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
    // Kept for the verify step. The form isn't cleared here, so if sending
    // the code fails nothing has to be typed again.
    dispatch(setSignupData({ ...formData, email: email.trim(), accountType }))
    dispatch(sendOtp(email.trim(), navigate))
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-5">
      <fieldset>
        <legend className="lable-style">I want to join as</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <label
              key={r.type}
              className={`cursor-pointer rounded-lg border p-3 transition-colors duration-150 focus-within:ring-2 focus-within:ring-yellow-50 ${
                accountType === r.type
                  ? "border-yellow-50 bg-richblack-700"
                  : "border-richblack-600 hover:bg-richblack-700"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={r.type}
                checked={accountType === r.type}
                onChange={() => setAccountType(r.type)}
                className="sr-only"
              />
              <span className="block font-bold text-richblack-5">{r.title}</span>
              <span className="mt-0.5 block text-sm text-richblack-50">{r.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="su-first" label="First name">
          <input
            required
            id="su-first"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={handleOnChange}
            className="form-style w-full"
          />
        </Field>
        <Field id="su-last" label="Last name">
          <input
            required
            id="su-last"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={handleOnChange}
            className="form-style w-full"
          />
        </Field>
      </div>

      <Field id="su-email" label="Email">
        <input
          required
          id="su-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleOnChange}
          className="form-style w-full"
        />
      </Field>

      <Field id="su-password" label="Password">
        <PasswordInput
          id="su-password"
          name="password"
          value={password}
          onChange={handleOnChange}
          autoComplete="new-password"
          minLength={8}
        />
        <p className="text-sm text-richblack-100">At least 8 characters.</p>
      </Field>
      <Field id="su-confirm" label="Confirm password">
        <PasswordInput
          id="su-confirm"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleOnChange}
          autoComplete="new-password"
        />
      </Field>

      {error && <p className="form-error">{error}</p>}
      <SubmitButton loading={loading} loadingText="Sending code...">
        Create account
      </SubmitButton>
      <p className="-mt-2 text-sm text-richblack-100">
        We'll email you a 6-digit code to confirm your address.
      </p>
    </form>
  )
}

export default SignupForm
