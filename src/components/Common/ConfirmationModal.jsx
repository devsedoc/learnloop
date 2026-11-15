import { useEffect } from "react"

import IconBtn from "./IconBtn"

// modalData: { text1, text2, btn1Text, btn2Text, btn1Handler, btn2Handler, danger? }
export default function ConfirmationModal({ modalData }) {
  // Escape works like Cancel.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && modalData?.btn2Handler?.()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modalData])

  return (
    <div
      className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black/70 px-4"
      onClick={modalData?.btn2Handler}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-[400px] rounded-lg border border-richblack-600 bg-richblack-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-title" className="text-xl font-medium text-richblack-5">
          {modalData?.text1}
        </p>
        {modalData?.text2 && (
          <p className="mt-2 text-richblack-50">{modalData.text2}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {modalData?.danger ? (
            <button
              type="button"
              onClick={modalData?.btn1Handler}
              className="rounded-lg bg-pink-200 px-5 py-2.5 font-medium text-richblack-900 transition-colors duration-150 hover:bg-pink-100 active:bg-pink-300"
            >
              {modalData?.btn1Text}
            </button>
          ) : (
            <IconBtn
              type="button"
              onclick={modalData?.btn1Handler}
              text={modalData?.btn1Text}
            />
          )}
          <IconBtn
            type="button"
            outline
            onclick={modalData?.btn2Handler}
            text={modalData?.btn2Text}
          />
        </div>
      </div>
    </div>
  )
}
