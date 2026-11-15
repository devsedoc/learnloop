import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector(
    (state) => state.viewCourse
  )
  const [videoEnded, setVideoEnded] = useState(false)
  const [saving, setSaving] = useState(false)

  // Every lecture in course order, so previous / next is just index +/- 1.
  const lectures = useMemo(
    () =>
      courseSectionData.flatMap((section) =>
        section.subSection.map((lecture) => ({ ...lecture, sectionId: section._id }))
      ),
    [courseSectionData]
  )
  const index = lectures.findIndex((l) => l._id === subSectionId && l.sectionId === sectionId)
  const lecture = lectures[index]
  const prev = index > 0 ? lectures[index - 1] : null
  const next = index >= 0 && index < lectures.length - 1 ? lectures[index + 1] : null
  const complete = completedLectures.includes(subSectionId)

  useEffect(() => setVideoEnded(false), [subSectionId])

  const go = (l) =>
    navigate(`/view-course/${courseId}/section/${l.sectionId}/sub-section/${l._id}`)

  const markComplete = async () => {
    if (saving || complete) return
    setSaving(true)
    const res = await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token)
    if (res) dispatch(updateCompletedLectures(subSectionId))
    setSaving(false)
  }

  if (!lecture) {
    return (
      <div>
        <img
          src={courseEntireData?.thumbnail}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
        <p className="mt-6 text-richblack-50">
          This lecture isn't part of the course any more. Pick one from the course
          content.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg">
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={lecture.videoUrl}
        >
          <BigPlayButton position="center" />
          {videoEnded && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/80 p-4 text-center">
              <p className="text-lg font-medium text-richblack-5">
                {next ? `Up next: ${next.title}` : "That was the last lecture."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {next && <IconBtn type="button" text="Play next" onclick={() => go(next)} />}
                <IconBtn
                  type="button"
                  outline
                  text="Watch again"
                  onclick={() => {
                    playerRef.current?.seek(0)
                    playerRef.current?.play()
                    setVideoEnded(false)
                  }}
                />
              </div>
            </div>
          )}
        </Player>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-richblack-100">
            Lecture {index + 1} of {lectures.length}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-richblack-5">{lecture.title}</h1>
        </div>
        {complete ? (
          <p className="rounded-lg border border-richblack-700 px-4 py-2.5 text-sm font-medium text-yellow-50">
            ✓ Completed
          </p>
        ) : (
          <IconBtn
            type="button"
            text={saving ? "Saving..." : "Mark as complete"}
            disabled={saving}
            onclick={markComplete}
          />
        )}
      </div>

      {lecture.description && (
        <p className="mt-4 whitespace-pre-line text-richblack-50">{lecture.description}</p>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-richblack-700 pt-6">
        {prev ? (
          <IconBtn type="button" outline text={`← ${prev.title}`} onclick={() => go(prev)} />
        ) : (
          <span />
        )}
        {next && <IconBtn type="button" outline text={`${next.title} →`} onclick={() => go(next)} />}
      </div>
    </div>
  )
}
