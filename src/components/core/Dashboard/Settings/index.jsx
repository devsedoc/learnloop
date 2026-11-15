import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold text-richblack-5">Settings</h1>
      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <DeleteAccount />
    </div>
  )
}
