import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { totalItems } = useSelector((state) => state.cart)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-richblack-5">Cart</h1>

      {totalItems > 0 ? (
        <>
          <p className="mt-2 text-richblack-100">
            {totalItems} {totalItems === 1 ? "course" : "courses"}
          </p>
          <div className="mt-8 flex flex-col items-start gap-8 lg:flex-row">
            <RenderCartCourses />
            <RenderTotalAmount />
          </div>
        </>
      ) : (
        <div className="mt-8 border-t border-richblack-700 pt-8">
          <p className="text-lg text-richblack-5">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-lg bg-yellow-50 px-5 py-2.5 font-medium text-richblack-900 transition-colors duration-150 hover:bg-yellow-25 active:bg-yellow-100"
          >
            Browse courses
          </Link>
        </div>
      )}
    </div>
  )
}
