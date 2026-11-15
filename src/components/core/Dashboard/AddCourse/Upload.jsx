import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData || editData || "")
  const [rejected, setRejected] = useState("")

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: video ? { "video/*": [".mp4"] } : { "image/*": [".jpeg", ".jpg", ".png"] },
    multiple: false,
    noClick: true,
    onDrop: (accepted, rejections) => {
      if (rejections.length) {
        setRejected(video ? "Use an MP4 video." : "Use a JPG or PNG image.")
        return
      }
      const file = accepted[0]
      if (!file) return
      setRejected("")
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewSource(reader.result)
      reader.readAsDataURL(file)
    },
  })

  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  const kind = video ? "video" : "image"

  return (
    <div className="flex flex-col gap-2">
      <p className="lable-style">{label}</p>
      {!viewData && (
        <p className="-mt-1 text-sm text-richblack-100">
          {video ? "MP4." : "JPG or PNG, 16:9, for example 1024 × 576."}
        </p>
      )}
      {previewSource ? (
        <div>
          {video ? (
            <Player aspectRatio="16:9" playsInline src={previewSource} />
          ) : (
            <img
              src={previewSource}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
          {!viewData && (
            <button
              type="button"
              onClick={() => {
                setPreviewSource("")
                setSelectedFile(null)
                setValue(name, null)
              }}
              className="mt-3 rounded-lg border border-richblack-400 px-4 py-2 text-sm font-medium text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
            >
              Replace {kind}
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-150 ${
            isDragActive
              ? "border-yellow-50 bg-richblack-800"
              : "border-richblack-500"
          }`}
        >
          <input {...getInputProps()} id={name} />
          <p className="text-richblack-50">
            {isDragActive ? `Drop the ${kind} here` : `Drag a ${kind} here, or`}
          </p>
          {!isDragActive && (
            <button
              type="button"
              onClick={open}
              className="rounded-lg border border-richblack-400 px-4 py-2 font-medium text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700"
            >
              Choose a file
            </button>
          )}
        </div>
      )}
      {rejected && <p className="form-error">{rejected}</p>}
      {errors[name] && !rejected && (
        <p className="form-error">Add {video ? "a video" : "an image"}.</p>
      )}
    </div>
  )
}
