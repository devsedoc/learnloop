import { useEffect, useState } from "react"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import { RatingLine } from "../components/core/Catalog/Course_Card"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// Instructors usually type one point per line in a plain text box.
// Show those lines as a list; anything already written as markdown renders as is.
function LearnList({ text }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  const looksLikeMarkdown = lines.some((l) => /^([-*+]|\d+\.|#)\s/.test(l))
  return (
    <div className="mt-4 space-y-3 text-richblack-50 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc">
      {lines.length > 1 && !looksLikeMarkdown ? (
        <ul className="space-y-2">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : (
        <ReactMarkdown>{text}</ReactMarkdown>
      )}
    </div>
  )
}

export default function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    setResponse(null)
    ;(async () => {
      try {
        setResponse(await fetchCourseDetails(courseId))
      } catch {
        setResponse({ success: false })
      }
    })()
  }, [courseId])

  if (!response) {
    return (
      <div className="mx-auto w-11/12 max-w-maxContent py-16 text-richblack-50">
        Loading the course...
      </div>
    )
  }

  if (!response.success || !response.data?.courseDetails) {
    return (
      <>
        <div className="mx-auto w-11/12 max-w-maxContent py-16">
          <h1 className="text-3xl font-extrabold text-richblack-5">Course not found</h1>
          <p className="mt-3 text-richblack-50">
            It may have been removed, or the link is wrong.
          </p>
          <Link to="/" className="mt-6 inline-block font-bold text-yellow-50 hover:underline">
            Back to the home page
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const course = response.data.courseDetails
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent = [],
    ratingAndReviews = [],
    instructor = {},
    studentsEnroled = [],
    instructions = [],
    category,
    createdAt,
  } = course
  const lectures = courseContent.reduce((n, s) => n + (s.subSection?.length || 0), 0)
  const instructorName = `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()

  const requireLogin = (action) =>
    setConfirmationModal({
      text1: "Log in to continue",
      text2: `You need an account to ${action}.`,
      btn1Text: "Log in",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })

  const handleBuyCourse = async () => {
    if (!token) {
      requireLogin("buy this course")
      return
    }
    if (buying) return
    setBuying(true)
    try {
      await BuyCourse(token, [courseId], user, navigate, dispatch)
    } finally {
      setBuying(false)
    }
  }

  const card = (
    <CourseDetailsCard
      course={course}
      requireLogin={requireLogin}
      handleBuyCourse={handleBuyCourse}
      buying={buying}
    />
  )

  return (
    <>
      <section className="border-b border-richblack-700">
        <div className="mx-auto grid w-11/12 max-w-maxContent gap-8 py-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-richblack-100">
              <Link to="/" className="hover:text-richblack-5 hover:underline">
                Home
              </Link>
              {category?.name && (
                <>
                  {" / "}
                  <Link
                    to={`/catalog/${category.name.split(" ").join("-").toLowerCase()}`}
                    className="hover:text-richblack-5 hover:underline"
                  >
                    {category.name}
                  </Link>
                </>
              )}
            </nav>
            <img
              src={course.thumbnail}
              alt=""
              className="mt-5 aspect-video w-full rounded-lg object-cover lg:hidden"
            />
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-richblack-5 sm:text-4xl">
              {courseName}
            </h1>
            <p className="mt-4 text-lg text-richblack-50">{courseDescription}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li>
                <RatingLine reviews={ratingAndReviews} />
              </li>
              <li className="text-richblack-50">
                {plural(studentsEnroled.length, "student", "students")}
              </li>
              <li className="text-richblack-50">Published {formatDate(createdAt).split(" |")[0]}</li>
            </ul>
            {instructorName && (
              <p className="mt-3 text-richblack-50">
                By <span className="font-bold text-richblack-5">{instructorName}</span>
              </p>
            )}
          </div>

          {/* Desktop: card beside the header and sticky while scrolling. */}
          <div className="hidden lg:block">
            <div className="sticky top-6">{card}</div>
          </div>
          {/* Phones and tablets: card right under the header. */}
          <div className="lg:hidden">{card}</div>
        </div>
      </section>

      <div className="mx-auto w-11/12 max-w-maxContent lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="min-w-0 space-y-12 py-10">
          {whatYouWillLearn && (
            <section>
              <h2 className="text-2xl font-extrabold text-richblack-5">What you'll learn</h2>
              <LearnList text={whatYouWillLearn} />
            </section>
          )}

          {instructions.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold text-richblack-5">Before you start</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-richblack-50">
                {instructions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-extrabold text-richblack-5">Course content</h2>
            <p className="mt-2 text-richblack-100">
              {plural(courseContent.length, "section", "sections")} ·{" "}
              {plural(lectures, "lecture", "lectures")}
              {response.data?.totalDuration ? ` · ${response.data.totalDuration} in total` : ""}
            </p>
            <div className="mt-4 divide-y divide-richblack-700 rounded-lg border border-richblack-700">
              {courseContent.map((section, i) => (
                <details key={section._id} open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-richblack-800 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-richblack-5">
                      <span
                        aria-hidden
                        className="mr-2 inline-block text-richblack-100 transition-transform duration-150 group-open:rotate-90"
                      >
                        ›
                      </span>
                      {section.sectionName}
                    </span>
                    <span className="shrink-0 text-sm text-richblack-100">
                      {plural(section.subSection?.length || 0, "lecture", "lectures")}
                    </span>
                  </summary>
                  <ol className="border-t border-richblack-800 px-5 py-2">
                    {section.subSection?.map((lecture) => (
                      <li key={lecture._id} className="py-2 pl-5 text-richblack-50">
                        {lecture.title}
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </section>

          {instructorName && (
            <section>
              <h2 className="text-2xl font-extrabold text-richblack-5">Instructor</h2>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={
                    instructor.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt=""
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg font-bold text-richblack-5">{instructorName}</p>
              </div>
              {instructor?.additionalDetails?.about && (
                <p className="mt-4 text-richblack-50">{instructor.additionalDetails.about}</p>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
