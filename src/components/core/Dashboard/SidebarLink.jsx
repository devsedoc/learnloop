import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

// iconName is still passed by callers but no longer rendered:
// a text-only sidebar reads more clearly than one icon per row.
export default function SidebarLink({ link }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const active = matchPath({ path: link.path }, location.pathname)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`whitespace-nowrap rounded-lg px-3 py-2.5 transition-colors duration-150 active:bg-richblack-700 ${
        active
          ? "bg-richblack-800 font-bold text-yellow-50"
          : "text-richblack-50 hover:bg-richblack-800"
      }`}
    >
      {link.name}
    </NavLink>
  )
}
