import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../Common/ConfirmationModal"

const rupees = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "Free")

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleCourseDelete = async (courseId) => {
    // Guard against a second click while the first delete is still running.
    if (deletingId) return
    setDeletingId(courseId)
    setConfirmationModal(null)
    await deleteCourse({ courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) setCourses(result)
    setDeletingId(null)
  }

  const askToDelete = (course) =>
    setConfirmationModal({
      text1: `Delete "${course.courseName}"?`,
      text2:
        "Its sections and lectures are removed too, and enrolled students lose access. This can't be undone.",
      btn1Text: "Delete course",
      danger: true,
      btn2Text: "Cancel",
      btn1Handler: () => handleCourseDelete(course._id),
      btn2Handler: () => setConfirmationModal(null),
    })

  if (!courses.length) {
    return (
      <div className="border-t border-richblack-700 pt-8">
        <p className="text-lg text-richblack-5">You have not created a course yet.</p>
        <p className="mt-2 text-richblack-100">
          Start with a title and a price. You can add sections and lectures after
          that, and publish when it's ready.
        </p>
        <Link
          to="/dashboard/add-course"
          className="mt-5 inline-block rounded-lg bg-yellow-50 px-5 py-2.5 font-bold text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
        >
          Create your first course
        </Link>
      </div>
    )
  }

  return (
    <>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-richblack-700 text-sm text-richblack-100">
            <th className="py-3 font-normal">Course</th>
            <th className="hidden py-3 font-normal md:table-cell">Status</th>
            <th className="hidden py-3 text-right font-normal md:table-cell">Price</th>
            <th className="py-3 text-right font-normal">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const isDraft = course.status === COURSE_STATUS.DRAFT
            const isDeleting = deletingId === course._id
            return (
              <tr
                key={course._id}
                className={`border-b border-richblack-800 align-top ${
                  isDeleting ? "opacity-50" : ""
                }`}
              >
                <td className="py-5 pr-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="aspect-video w-full shrink-0 rounded-md object-cover sm:w-40"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-richblack-5">{course.courseName}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-richblack-100">
                        {course.courseDescription}
                      </p>
                      <p className="mt-2 text-sm text-richblack-100">
                        Created {formatDate(course.createdAt)}
                      </p>
                      {/* Phones: status and price move under the name */}
                      <p className="mt-1 text-sm md:hidden">
                        <span className={isDraft ? "text-richblack-50" : "text-yellow-50"}>
                          {isDraft ? "Draft" : "Published"}
                        </span>
                        <span className="text-richblack-100">
                          {" "}
                          · {rupees(course.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden py-5 pr-4 md:table-cell">
                  <span className={isDraft ? "text-richblack-50" : "text-yellow-50"}>
                    {isDraft ? "Draft" : "Published"}
                  </span>
                </td>
                <td className="hidden py-5 pr-4 text-right text-richblack-25 md:table-cell">
                  {rupees(course.price)}
                </td>
                <td className="py-5 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      disabled={!!deletingId}
                      onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                      className="rounded-lg px-3 py-2 font-bold text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={!!deletingId}
                      onClick={() => askToDelete(course)}
                      className="rounded-lg px-3 py-2 font-bold text-pink-200 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
