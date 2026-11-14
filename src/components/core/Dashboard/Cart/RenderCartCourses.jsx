import { useDispatch, useSelector } from "react-redux"

import { removeFromCart } from "../../../../slices/cartSlice"

const rupees = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "Free")

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()

  return (
    <ul className="w-full flex-1 border-t border-richblack-700">
      {cart.map((course) => {
        const reviews = course?.ratingAndReviews?.length || 0
        return (
          <li
            key={course._id}
            className="flex flex-col gap-4 border-b border-richblack-800 py-5 sm:flex-row"
          >
            <img
              src={course?.thumbnail}
              alt=""
              className="aspect-video w-full shrink-0 rounded-md object-cover sm:w-40"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-richblack-5">{course?.courseName}</p>
              <p className="mt-1 text-sm text-richblack-100">
                {course?.category?.name}
                {course?.category?.name && " · "}
                {reviews === 0
                  ? "No reviews yet"
                  : `${reviews} ${reviews === 1 ? "review" : "reviews"}`}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
              <p className="text-lg font-bold text-richblack-5">{rupees(course?.price)}</p>
              <button
                type="button"
                disabled={paymentLoading}
                onClick={() => dispatch(removeFromCart(course._id))}
                className="rounded-lg px-3 py-2 font-bold text-pink-200 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
