import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center text-richblack-50">
        Loading your dashboard...
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:h-[calc(100vh-4rem)] md:overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
