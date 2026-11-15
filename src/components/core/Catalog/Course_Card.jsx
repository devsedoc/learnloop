import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"

export const rupees = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "Free")

export function RatingLine({ reviews }) {
  const count = reviews?.length || 0
  if (!count) return <span className="text-richblack-100">No reviews yet</span>
  return (
    <span className="text-richblack-50">
      <span className="font-medium text-yellow-50">★ {GetAvgRating(reviews).toFixed(1)}</span>{" "}
      ({count} {count === 1 ? "review" : "reviews"})
    </span>
  )
}

export default function Course_Card({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-50"
    >
      <img
        src={course?.thumbnail}
        alt=""
        className="aspect-video w-full rounded-lg object-cover"
      />
      <div className="mt-3 space-y-1">
        <p className="font-medium text-richblack-5 group-hover:underline">
          {course?.courseName}
        </p>
        <p className="text-sm text-richblack-100">
          {course?.instructor?.firstName} {course?.instructor?.lastName}
        </p>
        <p className="text-sm">
          <RatingLine reviews={course?.ratingAndReviews} />
        </p>
        <p className="pt-1 font-medium text-richblack-5">{rupees(course?.price)}</p>
      </div>
    </Link>
  )
}
