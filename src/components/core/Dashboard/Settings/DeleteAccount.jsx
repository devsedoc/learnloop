import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import ConfirmationModal from "../../../Common/ConfirmationModal"
import SettingsSection from "./SettingsSection"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (deleting) return
    setDeleting(true)
    setConfirmationModal(null)
    await dispatch(deleteProfile(token, navigate))
    setDeleting(false)
  }

  return (
    <SettingsSection
      title="Delete account"
      description="Removes your profile, your enrolments and your progress."
    >
      <p className="text-richblack-50">
        You lose access to every course you are enrolled in, including paid
        ones. The account can't be restored afterwards.
      </p>
      <button
        type="button"
        disabled={deleting}
        onClick={() =>
          setConfirmationModal({
            text1: "Delete your account?",
            text2:
              "Your profile, enrolments and progress are removed for good. This can't be undone.",
            btn1Text: "Delete account",
            danger: true,
            btn2Text: "Cancel",
            btn1Handler: handleDeleteAccount,
            btn2Handler: () => setConfirmationModal(null),
          })
        }
        className="mt-5 rounded-lg border border-pink-400 px-5 py-2.5 font-bold text-pink-200 transition-colors duration-150 hover:bg-pink-900 active:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete my account"}
      </button>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </SettingsSection>
  )
}
