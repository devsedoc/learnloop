import { Link } from "react-router-dom"

import { AuthCard } from "./AuthParts"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

// The form stays mounted while a request runs, so a failed login or signup
// keeps what was typed. The submit button shows the progress instead.
function Template({ title, description1, description2, formType }) {
  const isSignup = formType === "signup"
  return (
    <AuthCard
      title={title}
      footer={
        <p className="text-richblack-50">
          {isSignup ? "Already have an account? " : "New to Learnloop? "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="font-bold text-yellow-50 hover:underline"
          >
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      }
    >
      {(description1 || description2) && (
        <p className="mt-3 leading-relaxed text-richblack-50">
          {description1} {description2}
        </p>
      )}
      {isSignup ? <SignupForm /> : <LoginForm />}
    </AuthCard>
  )
}

export default Template
