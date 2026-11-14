import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"
import SettingsSection from "./SettingsSection"

const MAX_SIZE_MB = 5

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    e.target.value = "" // lets the same file be picked again after a cancel
    if (!file) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`That image is over ${MAX_SIZE_MB} MB. Pick a smaller one.`)
      return
    }
    setError("")
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewSource(reader.result)
    reader.readAsDataURL(file)
  }

  const cancel = () => {
    setImageFile(null)
    setPreviewSource(null)
    setError("")
  }

  const handleFileUpload = async () => {
    if (!imageFile || loading) return
    setLoading(true)
    const formData = new FormData()
    formData.append("displayPicture", imageFile)
    await dispatch(updateDisplayPicture(token, formData))
    // On success the new photo comes from the user record; on failure the
    // toast explains it and the old photo shows again.
    setLoading(false)
    setImageFile(null)
    setPreviewSource(null)
  }

  return (
    <SettingsSection
      title="Profile photo"
      description={`PNG, JPG or GIF, up to ${MAX_SIZE_MB} MB.`}
    >
      <div className="flex flex-wrap items-center gap-5">
        <img
          src={previewSource || user?.image}
          alt=""
          className="aspect-square w-20 rounded-full object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/gif, image/jpeg"
        />
        {imageFile ? (
          <div className="flex flex-wrap gap-3">
            <IconBtn
              text={loading ? "Saving..." : "Save photo"}
              onclick={handleFileUpload}
              disabled={loading}
            />
            <IconBtn text="Cancel" outline onclick={cancel} disabled={loading} />
          </div>
        ) : (
          <IconBtn
            text="Choose a photo"
            outline
            onclick={() => fileInputRef.current.click()}
          />
        )}
      </div>
      {error && <p className="form-error mt-3">{error}</p>}
    </SettingsSection>
  )
}
