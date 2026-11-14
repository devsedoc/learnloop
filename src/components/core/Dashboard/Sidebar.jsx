import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  const links = sidebarLinks.filter(
    (link) => !link.type || user?.accountType === link.type
  )

  return (
    <>
      {/* Phones: a scrollable row of tabs. Desktop: a left column. */}
      <aside className="border-b border-richblack-700 bg-richblack-900 md:h-[calc(100vh-4rem)] md:w-[240px] md:shrink-0 md:border-b-0 md:border-r">
        <div className="hidden px-6 pb-4 pt-8 md:block">
          <p className="truncate font-bold text-richblack-5">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-richblack-100">{user?.accountType}</p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:py-0">
          {links.map((link) => (
            <SidebarLink key={link.id} link={link} iconName={link.icon} />
          ))}
          <div className="my-3 hidden border-t border-richblack-700 md:block" />
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Log out?",
                text2: "You will need to log in again to see your courses.",
                btn1Text: "Log out",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-richblack-50 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
          >
            Log out
          </button>
        </nav>
      </aside>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
