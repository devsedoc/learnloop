import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"

export function FormField({ id, label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="lable-style">
        {label}
      </label>
      {hint && <p className="-mt-1 text-sm text-richblack-100">{hint}</p>}
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    ;(async () => {
      const list = await fetchCourseCategories()
      setCategories(list || [])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The category <select> only accepts a value once its options exist,
  // so pre-select it after the categories have loaded.
  useEffect(() => {
    if (editCourse && categories?.length) {
      setValue("courseCategory", course.category?._id || course.category)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  const originalCategory = course?.category?._id || course?.category

  const changedFields = () => {
    const v = getValues()
    return {
      courseName: v.courseTitle !== course.courseName,
      courseDescription: v.courseShortDesc !== course.courseDescription,
      price: v.coursePrice !== course.price,
      tag: v.courseTags.toString() !== course.tag.toString(),
      whatYouWillLearn: v.courseBenefits !== course.whatYouWillLearn,
      category: v.courseCategory !== originalCategory,
      instructions:
        v.courseRequirements.toString() !== course.instructions.toString(),
      thumbnailImage: v.courseImage !== course.thumbnail,
    }
  }

  const onSubmit = async (data) => {
    if (saving) return

    if (editCourse) {
      const changed = changedFields()
      if (!Object.values(changed).some(Boolean)) {
        // Nothing to save, just move on.
        dispatch(setStep(2))
        return
      }
      const formData = new FormData()
      formData.append("courseId", course._id)
      if (changed.courseName) formData.append("courseName", data.courseTitle)
      if (changed.courseDescription)
        formData.append("courseDescription", data.courseShortDesc)
      if (changed.price) formData.append("price", data.coursePrice)
      if (changed.tag) formData.append("tag", JSON.stringify(data.courseTags))
      if (changed.whatYouWillLearn)
        formData.append("whatYouWillLearn", data.courseBenefits)
      if (changed.category) formData.append("category", data.courseCategory)
      if (changed.instructions)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
      if (changed.thumbnailImage)
        formData.append("thumbnailImage", data.courseImage)

      setSaving(true)
      const result = await editCourseDetails(formData, token)
      setSaving(false)
      if (result) {
        dispatch(setCourse(result))
        dispatch(setStep(2))
      }
      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setSaving(true)
    const result = await addCourseDetails(formData, token)
    setSaving(false)
    if (result) {
      dispatch(setCourse(result))
      dispatch(setStep(2))
    }
  }

  const onInvalid = () =>
    toast.error("Some fields need fixing. They're marked below.")

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-7">
      <p className="text-sm text-richblack-100">All fields are required.</p>

      <FormField id="courseTitle" label="Title" error={errors.courseTitle && "Give the course a title."}>
        <input
          id="courseTitle"
          placeholder="For example, React from the Ground Up"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
      </FormField>

      <FormField
        id="courseShortDesc"
        label="Short description"
        hint="One or two sentences shown on the course card."
        error={errors.courseShortDesc && "Add a short description."}
      >
        <textarea
          id="courseShortDesc"
          rows={3}
          {...register("courseShortDesc", { required: true })}
          className="form-style w-full resize-y"
        />
      </FormField>

      <div className="grid gap-7 sm:grid-cols-2">
        <FormField
          id="coursePrice"
          label="Price"
          hint="In rupees. Use 0 for a free course."
          error={errors.coursePrice?.message}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-richblack-100">
              ₹
            </span>
            <input
              id="coursePrice"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              {...register("coursePrice", {
                required: "Enter a price, or 0 for free.",
                valueAsNumber: true,
                validate: (v) =>
                  (Number.isFinite(v) && v >= 0) || "Enter a price of 0 or more.",
              })}
              className="form-style w-full !pl-8"
            />
          </div>
        </FormField>

        <FormField
          id="courseCategory"
          label="Category"
          hint="Where students will find it."
          error={errors.courseCategory && "Choose a category."}
        >
          <select
            id="courseCategory"
            defaultValue=""
            disabled={categories === null}
            {...register("courseCategory", { required: true })}
            className="form-style w-full"
          >
            <option value="" disabled>
              {categories === null ? "Loading categories..." : "Choose one"}
            </option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Type a tag and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <Upload
        name="courseImage"
        label="Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <FormField
        id="courseBenefits"
        label="What students will learn"
        hint="Shown on the course page. A short paragraph or a few lines."
        error={errors.courseBenefits && "Describe what students will learn."}
      >
        <textarea
          id="courseBenefits"
          rows={4}
          {...register("courseBenefits", { required: true })}
          className="form-style w-full resize-y"
        />
      </FormField>

      <RequirementsField
        name="courseRequirements"
        label="Requirements"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex flex-wrap gap-3 border-t border-richblack-700 pt-6">
        <IconBtn
          type="submit"
          disabled={saving}
          text={saving ? "Saving..." : editCourse ? "Save and continue" : "Create draft and continue"}
        />
        {editCourse && (
          <IconBtn
            type="button"
            outline
            disabled={saving}
            onclick={() => dispatch(setStep(2))}
            text="Skip to sections"
          />
        )}
      </div>
    </form>
  )
}
