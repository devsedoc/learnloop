import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"

const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"]

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [ratingError, setRatingError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { courseExperience: "" } })

  const close = () => !isSubmitting && setReviewModal(false)

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  const onSubmit = async (data) => {
    if (!rating) {
      setRatingError(true)
      return
    }
    await createRating(
      { courseId: courseEntireData._id, rating, review: data.courseExperience },
      token
    )
    setReviewModal(false)
  }

  const shown = hover || rating

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 overflow-y-auto bg-black/70 px-4 py-10" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="mx-auto w-full max-w-[560px] rounded-lg border border-richblack-600 bg-richblack-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-richblack-700 py-4 pl-6 pr-3">
          <h2 id="review-title" className="text-xl font-bold text-richblack-5">
            Rate {courseEntireData?.courseName}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-md px-3 py-1.5 font-bold text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <img src={user?.image} alt="" className="h-10 w-10 rounded-full object-cover" />
            <p className="text-sm text-richblack-50">
              Posting as <span className="font-bold text-richblack-5">{user?.firstName} {user?.lastName}</span>.
              Other students will see your name and review.
            </p>
          </div>

          <fieldset>
            <legend className="lable-style">Your rating</legend>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}, ${labels[n]}`}
                    aria-pressed={rating === n}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => {
                      setRating(n)
                      setRatingError(false)
                    }}
                    className={`px-1 text-3xl leading-none transition-colors duration-100 ${
                      n <= shown ? "text-yellow-50" : "text-richblack-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="text-sm text-richblack-50">{labels[shown] || "Pick 1 to 5 stars"}</span>
            </div>
            {ratingError && <p className="form-error mt-2">Pick a rating.</p>}
          </fieldset>

          <div className="flex flex-col gap-2">
            <label className="lable-style" htmlFor="courseExperience">
              Your review
            </label>
            <textarea
              id="courseExperience"
              rows={5}
              placeholder="What was useful? What could be better?"
              {...register("courseExperience", {
                validate: (v) => v.trim().length > 0 || "Write a few words about the course.",
              })}
              className="form-style w-full resize-y"
            />
            {errors.courseExperience && (
              <p className="form-error">{errors.courseExperience.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <IconBtn
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? "Posting..." : "Post review"}
              onclick={() => !rating && setRatingError(true)}
            />
            <IconBtn type="button" outline disabled={isSubmitting} text="Cancel" onclick={close} />
          </div>
        </form>
      </div>
    </div>
  )
}
