import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"
import SettingsSection from "./SettingsSection"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="lable-style">
        {label}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const details = user?.additionalDetails || {}

  const defaults = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: details.dateOfBirth || "",
    gender: details.gender || "",
    contactNumber: details.contactNumber || "",
    about: details.about || "",
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues: defaults })

  const submitProfileForm = async (data) => {
    const ok = await dispatch(updateProfile(token, data))
    if (ok) reset(data) // the saved values become the new baseline
  }

  return (
    <SettingsSection
      title="Personal details"
      description="Shown on your profile. Your email can't be changed here."
    >
      <form onSubmit={handleSubmit(submitProfileForm)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="firstName" label="First name" error={errors.firstName?.message}>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className="form-style"
              {...register("firstName", { required: "Enter your first name." })}
            />
          </Field>
          <Field id="lastName" label="Last name" error={errors.lastName?.message}>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className="form-style"
              {...register("lastName", { required: "Enter your last name." })}
            />
          </Field>
          <Field id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth?.message}>
            <input
              id="dateOfBirth"
              type="date"
              className="form-style [color-scheme:dark]"
              {...register("dateOfBirth", {
                required: "Enter your date of birth.",
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of birth can't be in the future.",
                },
              })}
            />
          </Field>
          <Field id="gender" label="Gender" error={errors.gender?.message}>
            <select
              id="gender"
              className="form-style"
              {...register("gender", { required: "Choose an option." })}
            >
              <option value="" disabled>
                Choose one
              </option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field id="contactNumber" label="Phone number" error={errors.contactNumber?.message}>
            <input
              id="contactNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile number"
              className="form-style"
              {...register("contactNumber", {
                required: "Enter your phone number.",
                // Accept "98765 43210" or "98765-43210"; store digits only.
                setValueAs: (v) => String(v || "").replace(/[\s-]/g, ""),
                pattern: {
                  value: /^\d{10,12}$/,
                  message: "Use 10 to 12 digits.",
                },
              })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field id="about" label="About" error={errors.about?.message}>
              <textarea
                id="about"
                rows={3}
                placeholder="A line or two about you"
                className="form-style resize-y"
                {...register("about", { required: "Write a short line about yourself." })}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <IconBtn
            type="submit"
            text={isSubmitting ? "Saving..." : "Save changes"}
            disabled={!isDirty || isSubmitting}
          />
          {isDirty && !isSubmitting && (
            <IconBtn
              type="button"
              text="Discard"
              outline
              onclick={() => reset()}
            />
          )}
        </div>
      </form>
    </SettingsSection>
  )
}
