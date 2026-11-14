import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

function firstLecturePath(course) {
  const section = course.courseContent?.[0]
  const lecture = section?.subSection?.[0]
  if (!section || !lecture) return null
  return `/view-course/${course._id}/section/${section._id}/sub-section/${lecture._id}`
}

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  // null while loading. On failure the API shows its own toast and returns [].
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      const res = await getUserEnrolledCourses(token)
      setCourses((res || []).filter((c) => c.status !== "Draft"))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-richblack-5">Enrolled courses</h1>

      {courses === null ? (
        <p className="mt-8 text-richblack-50">Loading your courses...</p>
      ) : courses.length === 0 ? (
        <div className="mt-8 border-t border-richblack-700 pt-8">
          <p className="text-lg text-richblack-5">
            You are not enrolled in any course yet.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-lg bg-yellow-50 px-5 py-2.5 font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="mt-8 border-t border-richblack-700">
          {courses.map((course) => {
            const progress = Math.round(course.progressPercentage || 0)
            const path = firstLecturePath(course)
            const action =
              progress === 0 ? "Start" : progress >= 100 ? "Watch again" : "Continue"
            return (
              <li
                key={course._id}
                className="flex flex-col gap-4 border-b border-richblack-800 py-5 sm:flex-row sm:items-center"
              >
                <img
                  src={course.thumbnail}
                  alt=""
                  className="aspect-video w-full shrink-0 rounded-md object-cover sm:w-40"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-richblack-5">{course.courseName}</p>
                  <p className="mt-1 text-sm text-richblack-100">
                    {course.totalDuration ? `${course.totalDuration} of video` : "No lectures yet"}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="h-2 flex-1 overflow-hidden rounded-full bg-richblack-700 sm:max-w-xs"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${course.courseName} progress`}
                    >
                      <div
                        className="h-full rounded-full bg-yellow-50"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-richblack-50">{progress}%</span>
                  </div>
                </div>
                {path ? (
                  <Link
                    to={path}
                    className="shrink-0 rounded-lg border border-richblack-400 px-5 py-2.5 text-center font-bold text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
                  >
                    {action}
                  </Link>
                ) : (
                  <span className="shrink-0 text-sm text-richblack-100">
                    The instructor hasn't added lectures yet.
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
