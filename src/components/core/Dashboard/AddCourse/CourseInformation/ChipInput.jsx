import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// Tags typed one at a time: Enter or a comma adds one.
export default function ChipInput({ label, name, placeholder, register, errors, setValue }) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) setChips(course?.tag || [])
    register(name, { validate: (value) => (value && value.length > 0) || false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const addChip = (input) => {
    const value = input.value.trim().replace(/,$/, "")
    if (value && !chips.includes(value)) setChips([...chips, value])
    input.value = ""
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addChip(event.target)
    } else if (event.key === "Backspace" && !event.target.value && chips.length) {
      setChips(chips.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="lable-style" htmlFor={name}>
        {label}
      </label>
      <p className="-mt-1 text-sm text-richblack-100">
        Words students might search for, such as React or JavaScript.
      </p>
      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <li
              key={chip}
              className="flex items-center gap-1 rounded-md bg-richblack-700 py-1 pl-3 pr-1 text-sm text-richblack-5"
            >
              {chip}
              <button
                type="button"
                aria-label={`Remove ${chip}`}
                className="rounded px-2 text-richblack-50 transition-colors duration-150 hover:bg-richblack-600 hover:text-richblack-5"
                onClick={() => setChips(chips.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onBlur={(e) => addChip(e.target)}
        className="form-style w-full"
      />
      {errors[name] && <p className="form-error">Add at least one tag.</p>}
    </div>
  )
}
