import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../Common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

const smallBtn =
  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteSection = async (sectionId) => {
    setConfirmationModal(null)
    const result = await deleteSection({ sectionId, courseId: course._id, token })
    if (result) dispatch(setCourse(result))
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    setConfirmationModal(null)
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      const courseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      dispatch(setCourse({ ...course, courseContent }))
    }
  }

  return (
    <>
      <ol className="space-y-4">
        {course?.courseContent?.map((section, i) => (
          <li key={section._id} className="rounded-lg border border-richblack-700">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-richblack-700 py-3 pl-5 pr-3">
              <p className="font-medium text-richblack-5">
                <span className="text-richblack-100">Section {i + 1}:</span>{" "}
                {section.sectionName}
              </p>
              <div className="flex">
                <button
                  type="button"
                  className={`${smallBtn} text-richblack-50`}
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className={`${smallBtn} text-pink-200`}
                  onClick={() =>
                    setConfirmationModal({
                      text1: `Delete "${section.sectionName}"?`,
                      text2:
                        section.subSection.length > 0
                          ? `Its ${section.subSection.length} ${
                              section.subSection.length === 1 ? "lecture is" : "lectures are"
                            } deleted too. This can't be undone.`
                          : "This can't be undone.",
                      btn1Text: "Delete section",
                      btn2Text: "Cancel",
                      danger: true,
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>

            <ul>
              {section.subSection.map((lecture) => (
                <li
                  key={lecture._id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-richblack-800 py-2 pl-5 pr-3"
                >
                  <button
                    type="button"
                    onClick={() => setViewSubSection(lecture)}
                    className="min-w-0 text-left text-richblack-25 hover:text-richblack-5 hover:underline"
                  >
                    {lecture.title}
                  </button>
                  <div className="flex">
                    <button
                      type="button"
                      className={`${smallBtn} text-richblack-50`}
                      onClick={() => setEditSubSection({ ...lecture, sectionId: section._id })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`${smallBtn} text-pink-200`}
                      onClick={() =>
                        setConfirmationModal({
                          text1: `Delete "${lecture.title}"?`,
                          text2: "The video is removed from the course. This can't be undone.",
                          btn1Text: "Delete lecture",
                          btn2Text: "Cancel",
                          danger: true,
                          btn1Handler: () => handleDeleteSubSection(lecture._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-3 py-2">
              <button
                type="button"
                onClick={() => setAddSubsection(section._id)}
                className={`${smallBtn} text-yellow-50`}
              >
                Add lecture
              </button>
            </div>
          </li>
        ))}
      </ol>

      {addSubSection ? (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add />
      ) : viewSubSection ? (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view />
      ) : editSubSection ? (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit />
      ) : null}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
