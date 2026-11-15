import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (!loading) setModalData(null)
  }

  // Escape closes, unless an upload is running.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const replaceSection = (sectionId, updatedSection) => {
    const courseContent = course.courseContent.map((section) =>
      section._id === sectionId ? updatedSection : section
    )
    dispatch(setCourse({ ...course, courseContent }))
  }

  const onSubmit = async (data) => {
    if (view || loading) return

    if (edit) {
      const v = getValues()
      const formData = new FormData()
      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)
      let changed = false
      if (v.lectureTitle !== modalData.title) {
        formData.append("title", v.lectureTitle)
        changed = true
      }
      if (v.lectureDesc !== modalData.description) {
        formData.append("description", v.lectureDesc)
        changed = true
      }
      if (v.lectureVideo !== modalData.videoUrl) {
        formData.append("video", v.lectureVideo)
        changed = true
      }
      if (!changed) {
        setMessage("Nothing has changed yet.")
        return
      }
      setLoading(true)
      const result = await updateSubSection(formData, token)
      setLoading(false)
      if (result) {
        replaceSection(modalData.sectionId, result)
        setModalData(null)
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    setLoading(true)
    const result = await createSubSection(formData, token)
    setLoading(false)
    if (result) {
      replaceSection(modalData, result)
      setModalData(null)
    }
  }

  const title = view ? modalData.title : edit ? "Edit lecture" : "New lecture"

  return (
    <div
      className="fixed inset-0 z-[1000] !mt-0 overflow-y-auto bg-black/70 px-4 py-10"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lecture-dialog-title"
        className="mx-auto w-full max-w-[680px] rounded-lg border border-richblack-600 bg-richblack-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-richblack-700 py-4 pl-6 pr-3">
          <h2 id="lecture-dialog-title" className="text-xl font-medium text-richblack-5">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-md px-3 py-1.5 font-medium text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 p-6">
          <Upload
            name="lectureVideo"
            label="Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {view ? (
            <p className="whitespace-pre-line text-richblack-50">{modalData.description}</p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="lable-style" htmlFor="lectureTitle">
                  Title
                </label>
                <input
                  disabled={loading}
                  id="lectureTitle"
                  {...register("lectureTitle", { required: true })}
                  className="form-style w-full"
                />
                {errors.lectureTitle && <p className="form-error">Give the lecture a title.</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="lable-style" htmlFor="lectureDesc">
                  Description
                </label>
                <textarea
                  disabled={loading}
                  id="lectureDesc"
                  rows={4}
                  {...register("lectureDesc", { required: true })}
                  className="form-style w-full resize-y"
                />
                {errors.lectureDesc && <p className="form-error">Add a short description.</p>}
              </div>
              {message && <p className="text-sm text-richblack-50">{message}</p>}
              <div className="flex flex-wrap gap-3">
                <IconBtn
                  type="submit"
                  disabled={loading}
                  text={loading ? "Uploading..." : edit ? "Save changes" : "Add lecture"}
                />
                <IconBtn type="button" outline disabled={loading} text="Cancel" onclick={close} />
              </div>
              {loading && (
                <p className="text-sm text-richblack-100">
                  Large videos can take a minute. Keep this window open.
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}
