import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"

import IconBtn from "../../Common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const { sectionId, subSectionId } = useParams()
  const { courseSectionData, courseEntireData, totalNoOfLectures, completedLectures } =
    useSelector((state) => state.viewCourse)

  const done = completedLectures?.length || 0
  const percent = totalNoOfLectures ? Math.round((done / totalNoOfLectures) * 100) : 0

  return (
    <aside className="flex flex-col border-t border-richblack-700 bg-richblack-900 lg:h-full lg:w-[320px] lg:border-r lg:border-t-0">
      <div className="border-b border-richblack-700 p-5">
        <Link
          to="/dashboard/enrolled-courses"
          className="text-sm font-bold text-richblack-50 hover:text-richblack-5 hover:underline"
        >
          ← My courses
        </Link>
        <p className="mt-3 font-bold text-richblack-5">{courseEntireData?.courseName}</p>
        <div className="mt-3 flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-richblack-700"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div className="h-full rounded-full bg-yellow-50" style={{ width: `${percent}%` }} />
          </div>
          <span className="shrink-0 text-sm text-richblack-50">
            {done} of {totalNoOfLectures} done
          </span>
        </div>
        <IconBtn
          type="button"
          outline
          text="Rate this course"
          onclick={() => setReviewModal(true)}
          customClasses="mt-4 w-full justify-center"
        />
      </div>

      <nav aria-label="Course content" className="lg:flex-1 lg:overflow-y-auto">
        {courseSectionData.map((section) => (
          <details
            key={section._id}
            open={section._id === sectionId}
            className="group border-b border-richblack-800"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-sm font-bold text-richblack-5 hover:bg-richblack-800 [&::-webkit-details-marker]:hidden">
              <span>{section.sectionName}</span>
              <span
                aria-hidden
                className="text-richblack-100 transition-transform duration-150 group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <ol className="pb-2">
              {section.subSection.map((lecture) => {
                const current = lecture._id === subSectionId
                const complete = completedLectures.includes(lecture._id)
                return (
                  <li key={lecture._id}>
                    <Link
                      to={`/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${lecture._id}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-start gap-3 py-2 pl-5 pr-4 text-sm transition-colors duration-150 ${
                        current
                          ? "bg-richblack-800 font-bold text-yellow-50"
                          : "text-richblack-50 hover:bg-richblack-800 hover:text-richblack-5"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[10px] leading-none ${
                          complete
                            ? "border-yellow-50 bg-yellow-50 text-richblack-900"
                            : "border-richblack-400"
                        }`}
                      >
                        {complete ? "✓" : ""}
                      </span>
                      <span>
                        {lecture.title}
                        {complete && <span className="sr-only"> (completed)</span>}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </details>
        ))}
      </nav>
    </aside>
  )
}
