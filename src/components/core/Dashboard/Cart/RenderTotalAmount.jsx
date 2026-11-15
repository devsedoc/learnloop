import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI"
import IconBtn from "../../../Common/IconBtn"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // BuyCourse only sets paymentLoading once payment is being verified, so
  // track the order-creation step here to stop a double click making two orders.
  const [starting, setStarting] = useState(false)
  const busy = starting || paymentLoading

  const handleBuyCourse = async () => {
    if (busy) return
    setStarting(true)
    const courses = cart.map((course) => course._id)
    try {
      await BuyCourse(token, courses, user, navigate, dispatch)
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="w-full rounded-lg border border-richblack-700 bg-richblack-800 p-6 lg:w-[300px] lg:shrink-0">
      <p className="text-sm text-richblack-100">Total</p>
      <p className="mt-1 text-3xl font-semibold text-richblack-5">
        ₹{Number(total || 0).toLocaleString("en-IN")}
      </p>
      <IconBtn
        text={busy ? "Opening checkout..." : "Check out"}
        onclick={handleBuyCourse}
        disabled={busy}
        customClasses="mt-6 w-full justify-center"
      />
      <p className="mt-3 text-sm text-richblack-100">
        Payment is handled by Razorpay. You get access as soon as it goes through.
      </p>
    </div>
  )
}
