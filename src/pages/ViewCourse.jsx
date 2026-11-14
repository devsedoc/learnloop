import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [status, setStatus] = useState("loading") // loading | ready | error

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      const details = courseData?.courseDetails
      if (!details) {
        setStatus("error")
        return
      }
      dispatch(setCourseSectionData(details.courseContent))
      dispatch(setEntireCourseData(details))
      dispatch(setCompletedLectures(courseData.completedVideos || []))
      dispatch(
        setTotalNoOfLectures(
          details.courseContent.reduce((n, s) => n + s.subSection.length, 0)
        )
      )
      setStatus("ready")
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  if (status !== "ready") {
    return (
      <div className="mx-auto w-11/12 max-w-maxContent py-16">
        {status === "loading" ? (
          <p className="text-richblack-50">Loading the course...</p>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-richblack-5">
              This course couldn't be opened
            </h1>
            <p className="mt-3 text-richblack-50">
              You may not be enrolled in it, or it has been removed.
            </p>
            <Link
              to="/dashboard/enrolled-courses"
              className="mt-6 inline-block font-bold text-yellow-50 hover:underline"
            >
              Back to your courses
            </Link>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop: outline on the left, video on the right, each scrolling on its own.
          Phones: video first, outline below it. */}
      <div className="flex flex-col lg:h-[calc(100vh-4rem)] lg:flex-row">
        <div className="order-2 lg:order-1">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>
        <main className="order-1 min-w-0 flex-1 lg:order-2 lg:overflow-y-auto">
          <div className="mx-auto max-w-[1000px] px-4 py-6 sm:px-6">
            <Outlet />
          </div>
        </main>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
