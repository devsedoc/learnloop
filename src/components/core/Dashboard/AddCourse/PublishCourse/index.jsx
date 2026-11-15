import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../Common/IconBtn"

const options = [
  {
    value: COURSE_STATUS.DRAFT,
    title: "Keep as draft",
    text: "Only you can see it. You can keep editing and publish later.",
  },
  {
    value: COURSE_STATUS.PUBLISHED,
    title: "Publish",
    text: "Students can find it in the catalogue and enrol.",
  },
]

export default function PublishCourse() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [status, setStatus] = useState(course?.status || COURSE_STATUS.DRAFT)
  const [loading, setLoading] = useState(false)

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const save = async (e) => {
    e.preventDefault()
    if (loading) return
    if (status === course?.status) {
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", course._id)
    formData.append("status", status)
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    setLoading(false)
    if (result) goToCourses()
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <fieldset>
        <legend className="lable-style">Who can see "{course?.courseName}"?</legend>
        <div className="mt-3 space-y-3">
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors duration-150 ${
                status === o.value
                  ? "border-yellow-50 bg-richblack-800"
                  : "border-richblack-700 hover:bg-richblack-800"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={o.value}
                checked={status === o.value}
                onChange={() => setStatus(o.value)}
                className="mt-1 h-4 w-4 accent-yellow-50"
              />
              <span>
                <span className="block font-medium text-richblack-5">{o.title}</span>
                <span className="mt-1 block text-sm text-richblack-50">{o.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-richblack-700 pt-6">
        <IconBtn
          type="submit"
          disabled={loading}
          text={loading ? "Saving..." : status === COURSE_STATUS.PUBLISHED ? "Publish course" : "Save draft"}
        />
        <IconBtn
          type="button"
          outline
          disabled={loading}
          text="Back to sections"
          onclick={() => dispatch(setStep(2))}
        />
      </div>
    </form>
  )
}
