import copy from "copy-to-clipboard"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import IconBtn from "../../Common/IconBtn"
import { rupees } from "../Catalog/Course_Card"

// Price and the buy / cart actions. Used once per page; the parent decides
// where it sits (beside the header on desktop, under it on phones).
export default function CourseDetailsCard({ course, requireLogin, handleBuyCourse, buying }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [copied, setCopied] = useState(false)

  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
  const enrolled = !!user && course?.studentsEnroled?.includes(user?._id)
  const inCart = cart?.some((c) => c._id === course._id)

  const handleAddToCart = () => {
    if (!token) {
      requireLogin("add this course to your cart")
      return
    }
    dispatch(addToCart(course))
  }

  const handleShare = () => {
    copy(window.location.href)
    setCopied(true)
    toast.success("Link copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-5">
      <img
        src={course.thumbnail}
        alt=""
        className="hidden aspect-video w-full rounded-md object-cover lg:block"
      />
      <p className="text-3xl font-semibold text-richblack-5 lg:mt-5">
        {rupees(course.price)}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {enrolled ? (
          <Link
            to="/dashboard/enrolled-courses"
            className="rounded-lg bg-yellow-50 px-5 py-3 text-center font-medium text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
          >
            Go to the course
          </Link>
        ) : isInstructor ? (
          <p className="text-sm text-richblack-50">
            Instructor accounts can't buy courses. Log in with a student account
            to enrol.
          </p>
        ) : (
          <>
            <IconBtn
              type="button"
              text={buying ? "Opening checkout..." : "Buy now"}
              disabled={buying}
              onclick={handleBuyCourse}
              customClasses="w-full justify-center py-3"
            />
            {inCart ? (
              <Link
                to="/dashboard/cart"
                className="rounded-lg border border-richblack-400 px-5 py-3 text-center font-medium text-richblack-5 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
              >
                In your cart. View cart
              </Link>
            ) : (
              <IconBtn
                type="button"
                outline
                text="Add to cart"
                onclick={handleAddToCart}
                customClasses="w-full justify-center py-3"
              />
            )}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
      >
        {copied ? "Link copied" : "Copy link to this course"}
      </button>
    </div>
  )
}
