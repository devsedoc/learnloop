import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"
import SettingsSection from "./SettingsSection"

function PasswordField({ id, label, autoComplete, register, rules, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="lable-style">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className="form-style w-full pr-16"
          {...register(id, rules)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-1 my-1 rounded-md px-3 text-sm font-medium text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { oldPassword: "", newPassword: "" } })

  const submitPasswordForm = async (data) => {
    // On failure changePassword shows the server's message; keep what was typed.
    const ok = await changePassword(token, data)
    if (ok) reset()
  }

  return (
    <SettingsSection
      title="Password"
      description="Use at least 8 characters."
    >
      <form onSubmit={handleSubmit(submitPasswordForm)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            id="oldPassword"
            label="Current password"
            autoComplete="current-password"
            register={register}
            rules={{ required: "Enter your current password." }}
            error={errors.oldPassword?.message}
          />
          <PasswordField
            id="newPassword"
            label="New password"
            autoComplete="new-password"
            register={register}
            rules={{
              required: "Enter a new password.",
              minLength: { value: 8, message: "Use at least 8 characters." },
            }}
            error={errors.newPassword?.message}
          />
        </div>
        <div className="mt-6">
          <IconBtn
            type="submit"
            text={isSubmitting ? "Updating..." : "Update password"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </SettingsSection>
  )
}
