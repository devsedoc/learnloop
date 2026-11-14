import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

import { formattedDate } from "../../../utils/dateFormatter"

function Field({ label, value, placeholder }) {
  return (
    <div>
      <dt className="text-sm text-richblack-100">{label}</dt>
      <dd className={`mt-1 ${value ? "text-richblack-5" : "text-richblack-100"}`}>
        {value || placeholder}
      </dd>
    </div>
  )
}

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const details = user?.additionalDetails || {}

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-richblack-5">Profile</h1>
        <Link
          to="/dashboard/settings"
          className="rounded-lg border border-richblack-400 px-5 py-2.5 font-bold text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
        >
          Edit profile
        </Link>
      </div>

      <section className="mt-8 flex items-center gap-5 border-b border-richblack-700 pb-8">
        <img
          src={user?.image}
          alt=""
          className="aspect-square w-16 shrink-0 rounded-full object-cover md:w-20"
        />
        <div className="min-w-0">
          <p className="text-xl font-bold text-richblack-5">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="break-all text-richblack-50">{user?.email}</p>
        </div>
      </section>

      <section className="border-b border-richblack-700 py-8">
        <h2 className="text-lg font-bold text-richblack-5">About</h2>
        <p
          className={`mt-3 max-w-[620px] leading-relaxed ${
            details.about ? "text-richblack-5" : "text-richblack-100"
          }`}
        >
          {details.about || "Nothing here yet. Add a short bio in Settings."}
        </p>
      </section>

      <section className="py-8">
        <h2 className="text-lg font-bold text-richblack-5">Personal details</h2>
        <dl className="mt-5 grid max-w-[620px] gap-x-10 gap-y-6 sm:grid-cols-2">
          <Field label="First name" value={user?.firstName} />
          <Field label="Last name" value={user?.lastName} />
          <Field label="Email" value={user?.email} />
          <Field
            label="Phone number"
            value={details.contactNumber}
            placeholder="Not added"
          />
          <Field label="Gender" value={details.gender} placeholder="Not added" />
          <Field
            label="Date of birth"
            value={details.dateOfBirth && formattedDate(details.dateOfBirth)}
            placeholder="Not added"
          />
        </dl>
      </section>
    </>
  )
}
