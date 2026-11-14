import { useEffect, useState } from "react"
import OtpInput from "react-otp-input"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { AuthCard, BackLink, SubmitButton } from "../components/core/Auth/AuthParts"
import { sendOtp, signUp } from "../services/operations/authAPI"

const RESEND_SECONDS = 30

export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [wait, setWait] = useState(RESEND_SECONDS)
  const { signupData, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Only reachable after filling in the signup form.
    if (!signupData) navigate("/signup")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown before the code can be sent again.
  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const handleVerifyAndSignup = (e) => {
    e.preventDefault()
    if (loading) return
    if (otp.length !== 6) {
      setError("Enter all 6 digits.")
      return
    }
    const { accountType, firstName, lastName, email, password, confirmPassword } = signupData
    dispatch(
      signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate)
    )
  }

  const resend = () => {
    if (wait > 0 || loading) return
    // sendOtp navigates to /verify-email on success, which is this page.
    dispatch(sendOtp(signupData.email, navigate))
    setOtp("")
    setWait(RESEND_SECONDS)
  }

  if (!signupData) return null

  return (
    <AuthCard
      title="Check your email"
      footer={<BackLink to="/signup">Back to sign up</BackLink>}
    >
      <p className="mt-3 leading-relaxed text-richblack-50">
        We sent a 6-digit code to{" "}
        <span className="font-bold text-richblack-5">{signupData.email}</span>. Enter it
        below to create your account.
      </p>
      <form onSubmit={handleVerifyAndSignup} className="mt-6 flex flex-col gap-5">
        <fieldset>
          <legend className="lable-style">Verification code</legend>
          <div className="mt-2">
            <OtpInput
              value={otp}
              onChange={(v) => {
                setError("")
                setOtp(v.replace(/\D/g, ""))
              }}
              numInputs={6}
              shouldAutoFocus
              inputType="tel"
              renderInput={(props, i) => (
                <input
                  {...props}
                  aria-label={`Digit ${i + 1}`}
                  className="form-style !w-full min-w-0 !p-0 text-center text-xl font-bold"
                  style={{ ...props.style, width: undefined, aspectRatio: "1 / 1" }}
                />
              )}
              containerStyle={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}
            />
          </div>
          {error && <p className="form-error mt-2">{error}</p>}
        </fieldset>
        <SubmitButton loading={loading} loadingText="Checking...">
          Verify and create account
        </SubmitButton>
      </form>
      <p className="mt-4 text-sm text-richblack-50">
        No code?{" "}
        {wait > 0 ? (
          <span>You can ask for a new one in {wait}s.</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="font-bold text-yellow-50 hover:underline disabled:opacity-50"
          >
            Send a new code
          </button>
        )}
      </p>
    </AuthCard>
  )
}
