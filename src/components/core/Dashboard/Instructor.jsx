import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"

const rupees = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const [statsData, courseData] = await Promise.all([
        getInstructorData(token),
        fetchInstructorCourses(token),
      ])
      setStats(statsData || [])
      setCourses(courseData || [])
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalIncome = stats.reduce((sum, c) => sum + (c.totalAmountGenerated || 0), 0)
  const totalStudents = stats.reduce((sum, c) => sum + (c.totalStudentsEnrolled || 0), 0)

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-richblack-5">
        Dashboard
      </h1>

      {loading ? (
        <p className="mt-8 text-richblack-50">Loading your courses...</p>
      ) : courses.length === 0 ? (
        <div className="mt-8 border-t border-richblack-700 pt-8">
          <p className="text-lg text-richblack-5">
            You have not created a course yet.
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-5 inline-block rounded-lg bg-yellow-50 px-5 py-2.5 font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <>
          {/* Totals */}
          <dl className="mt-8 grid grid-cols-3 border-y border-richblack-700">
            {[
              ["Courses", courses.length],
              ["Students", totalStudents],
              ["Income", rupees(totalIncome)],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`py-5 ${i > 0 ? "border-l border-richblack-700 pl-5" : ""}`}
              >
                <dt className="text-sm text-richblack-100">{label}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-richblack-5 sm:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Per-course breakdown */}
          <div className="mt-10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-richblack-5">By course</h2>
            <Link
              to="/dashboard/my-courses"
              className="font-bold text-yellow-50 hover:underline"
            >
              Manage courses
            </Link>
          </div>
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="border-b border-richblack-700 text-sm text-richblack-100">
                <th className="py-3 font-normal">Course</th>
                <th className="hidden py-3 text-right font-normal sm:table-cell">Students</th>
                <th className="hidden py-3 text-right font-normal sm:table-cell">Price</th>
                <th className="hidden py-3 text-right font-normal sm:table-cell">Income</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const s = stats.find((x) => x._id === course._id) || {}
                const students =
                  s.totalStudentsEnrolled ?? course.studentsEnroled?.length ?? 0
                const price = course.price ? rupees(course.price) : "Free"
                const income = rupees(s.totalAmountGenerated)
                return (
                  <tr key={course._id} className="border-b border-richblack-800">
                    <td className="py-4 sm:pr-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt=""
                          className="h-12 w-20 shrink-0 rounded-md object-cover"
                        />
                        <div>
                          <p className="text-richblack-5">{course.courseName}</p>
                          {/* Phones: numbers sit under the name instead of in columns */}
                          <p className="mt-1 text-sm text-richblack-100 sm:hidden">
                            {students} {students === 1 ? "student" : "students"} ·{" "}
                            {price} · {income} earned
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 text-right text-richblack-25 sm:table-cell">
                      {students}
                    </td>
                    <td className="hidden py-4 text-right text-richblack-25 sm:table-cell">
                      {price}
                    </td>
                    <td className="hidden py-4 text-right text-richblack-25 sm:table-cell">
                      {income}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
