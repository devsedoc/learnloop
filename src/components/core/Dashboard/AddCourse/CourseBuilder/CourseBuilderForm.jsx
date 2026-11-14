import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionId, setEditSectionId] = useState(null)
  const [nextError, setNextError] = useState("")
  const formRef = useRef(null)
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    if (loading) return
    setLoading(true)
    const result = editSectionId
      ? await updateSection(
          { sectionName: data.sectionName, sectionId: editSectionId, courseId: course._id },
          token
        )
      : await createSection({ sectionName: data.sectionName, courseId: course._id }, token)
    if (result) {
      dispatch(setCourse(result))
      setEditSectionId(null)
      setValue("sectionName", "")
      setNextError("")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionId(null)
    setValue("sectionName", "")
  }

  const startRename = (sectionId, sectionName) => {
    if (editSectionId === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionId(sectionId)
    setValue("sectionName", sectionName)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    setFocus("sectionName")
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      setNextError("Add at least one section first.")
      return
    }
    const empty = course.courseContent.find((s) => s.subSection.length === 0)
    if (empty) {
      setNextError(`"${empty.sectionName}" has no lectures yet. Add one, or delete the section.`)
      return
    }
    setNextError("")
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8">
      {course.courseContent.length > 0 ? (
        <NestedView handleChangeEditSectionName={startRename} />
      ) : (
        <p className="text-richblack-50">
          No sections yet. Name your first one below, for example "Getting
          started".
        </p>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-lg border border-richblack-700 p-5"
      >
        <label className="lable-style" htmlFor="sectionName">
          {editSectionId ? "Rename section" : "New section"}
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Section name"
            {...register("sectionName", {
              required: true,
              validate: (v) => v.trim().length > 0,
            })}
            className="form-style min-w-0 flex-1"
          />
          <div className="flex gap-3">
            <IconBtn
              type="submit"
              disabled={loading}
              outline
              text={loading ? "Saving..." : editSectionId ? "Save name" : "Add section"}
            />
            {editSectionId && (
              <IconBtn type="button" outline text="Cancel" onclick={cancelEdit} />
            )}
          </div>
        </div>
        {errors.sectionName && <p className="form-error mt-2">Give the section a name.</p>}
      </form>

      <div className="border-t border-richblack-700 pt-6">
        {nextError && <p className="form-error mb-4">{nextError}</p>}
        <div className="flex flex-wrap gap-3">
          <IconBtn type="button" disabled={loading} text="Continue to publish" onclick={goToNext} />
          <IconBtn type="button" outline text="Back to details" onclick={goBack} />
        </div>
      </div>
    </div>
  )
}
