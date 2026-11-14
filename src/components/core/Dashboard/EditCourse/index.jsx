import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result.courseDetails))
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-richblack-5">
        {course?.courseName && !loading ? `Edit: ${course.courseName}` : "Edit course"}
      </h1>
      <div className="mt-8 max-w-3xl">
        {loading ? (
          <p className="text-richblack-50">Loading the course...</p>
        ) : course ? (
          <RenderSteps />
        ) : (
          <div>
            <p className="text-lg text-richblack-5">
              This course doesn't exist, or it isn't one of yours.
            </p>
            <Link
              to="/dashboard/my-courses"
              className="mt-4 inline-block font-bold text-yellow-50 hover:underline"
            >
              Back to My courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
