import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"

const details = [
  {
    term: "Separate student and instructor accounts",
    text: "Each role has its own dashboard, and the API checks the role on every protected route.",
  },
  {
    term: "Payments through Razorpay",
    text: "The server verifies the payment signature before a course is unlocked.",
  },
  {
    term: "Saved progress",
    text: "Finished lectures are recorded per student, so a course reopens where it was left.",
  },
  {
    term: "Reviews from enrolled students only",
    text: "A course can be rated only by someone who has bought it.",
  },
]

const learnerSteps = [
  "Create an account and confirm it with the code sent to your email",
  "Choose a course and pay",
  "Watch the lectures and mark them complete",
  "Rate the course when you finish",
]

const instructorSteps = [
  "Sign up as an instructor",
  "Add sections and lectures to a new course",
  "Upload the videos and publish",
  "Check enrolments and income on your dashboard",
]

function StepList({ title, steps }) {
  return (
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <ol className="mt-5 flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4 text-richblack-25">
            <span className="w-5 shrink-0 font-mono text-richblack-200">
              {i + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Home() {
  const [topics, setTopics] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setTopics(
          (res?.data?.data || []).filter((c) => c?.courses?.length > 0)
        )
      } catch (error) {
        setTopics([])
      }
    })()
  }, [])

  return (
    <div className="text-richblack-5">
      {/* Intro */}
      <section className="border-b border-richblack-700">
        <div className="mx-auto w-11/12 max-w-maxContent py-16 lg:py-20">
          <h1 className="max-w-[720px] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Take a video course, or publish one of your own.
          </h1>
          <p className="mt-5 max-w-[600px] text-lg leading-relaxed text-richblack-50">
            Learnloop is a course platform. Students buy courses and work
            through them lecture by lecture. Instructors build courses, upload
            the videos and see who has enrolled.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="rounded-lg bg-yellow-50 px-6 py-3 text-base font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
            >
              Create an account
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-richblack-400 px-6 py-3 text-base font-bold text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Topics, shown only when the catalogue has courses */}
      {topics.length > 0 && (
        <section className="border-b border-richblack-700">
          <div className="mx-auto w-11/12 max-w-maxContent py-12">
            <h2 className="text-2xl font-extrabold">Courses by topic</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {topics.map((topic) => (
                <li key={topic._id}>
                  <Link
                    to={`/catalog/${topic.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`}
                    className="block rounded-lg border border-richblack-400 px-5 py-3 text-richblack-5 transition-colors duration-150 hover:bg-richblack-800"
                  >
                    {topic.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-b border-richblack-700">
        <div className="mx-auto w-11/12 max-w-maxContent py-14">
          <h2 className="text-2xl font-extrabold sm:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <StepList title="If you are learning" steps={learnerSteps} />
            <StepList title="If you are teaching" steps={instructorSteps} />
          </div>
        </div>
      </section>

      {/* What is in the app */}
      <section className="border-b border-richblack-700">
        <div className="mx-auto w-11/12 max-w-maxContent py-14">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            What is in the app
          </h2>
          <dl className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
            {details.map(({ term, text }) => (
              <div key={term} className="border-l-2 border-yellow-50 pl-5">
                <dt className="font-bold">{term}</dt>
                <dd className="mt-1 leading-relaxed text-richblack-50">
                  {text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto w-11/12 max-w-maxContent py-14">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Reviews from students
        </h2>
        <ReviewSlider />
      </section>

      <Footer />
    </div>
  )
}

export default Home
