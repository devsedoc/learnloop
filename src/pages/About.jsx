import { Link } from "react-router-dom"

import Footer from "../components/Common/Footer"
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm"

const stack = [
  {
    title: "Front end",
    text: "React with Redux Toolkit for state, React Router for pages and Tailwind CSS for styling.",
  },
  {
    title: "Back end",
    text: "A Node.js and Express REST API with separate routes for auth, courses, payments and profiles.",
  },
  {
    title: "Data",
    text: "MongoDB with Mongoose models for users, courses, sections, lectures, progress and ratings.",
  },
  {
    title: "Accounts",
    text: "Email one-time codes at sign-up, bcrypt-hashed passwords, JWT sessions and role-based middleware.",
  },
  {
    title: "Payments",
    text: "Razorpay checkout, with the payment signature verified on the server before enrolment.",
  },
  {
    title: "Hosting",
    text: "Front end on Vercel, API on Render, database on MongoDB Atlas and media on Cloudinary.",
  },
]

const roles = [
  {
    name: "Students",
    points: [
      "Browse courses by category",
      "Add courses to a cart and pay",
      "Watch lectures and mark them complete",
      "Rate and review enrolled courses",
    ],
  },
  {
    name: "Instructors",
    points: [
      "Create courses with sections and lectures",
      "Upload thumbnails and lecture video",
      "Save drafts and publish when ready",
      "See enrolments and income per course",
    ],
  },
]

function About() {
  return (
    <div className="text-richblack-5">
      {/* Intro */}
      <section className="border-b border-richblack-700">
        <div className="mx-auto w-11/12 max-w-maxContent py-14 lg:py-16">
          <h1 className="max-w-[760px] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            About Learnloop
          </h1>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-richblack-50">
            Learnloop lets instructors publish video courses and lets students
            buy them, follow them and track how far they have got. This page
            explains what it does and how it is put together.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto grid w-11/12 max-w-maxContent gap-5 py-14 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.name}
            className="rounded-xl border border-richblack-700 bg-richblack-800 p-8"
          >
            <h2 className="text-2xl font-extrabold">{role.name} can</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {role.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-50"></span>
                  <span className="text-richblack-50">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* How it is built */}
      <section className="border-y border-richblack-800 bg-richblack-800">
        <div className="mx-auto w-11/12 max-w-maxContent py-14">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How it is built
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map(({ title, text }) => (
              <div key={title}>
                <p className="font-bold">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-richblack-50">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Builder + contact */}
      <section className="mx-auto grid w-11/12 max-w-maxContent gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Devang Sharma
          </h2>
          <p className="mt-4 leading-relaxed text-richblack-50">
            I am a Computer Science and Business Systems student at Dayananda
            Sagar College of Engineering, Bengaluru, and I work on Learnloop
            to get better at full-stack development.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/devsedoc/studynotion-edtech"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-richblack-400 px-5 py-3 font-bold transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
            >
              View the code
            </a>
            <Link
              to="/signup"
              className="rounded-lg bg-yellow-50 px-5 py-3 font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
            >
              Try it
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-8">
          <h3 className="text-xl font-extrabold">Send a message</h3>
          <p className="mt-2 text-sm text-richblack-100">
            Questions or feedback about the project are welcome.
          </p>
          <div className="mt-6">
            <ContactUsForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
