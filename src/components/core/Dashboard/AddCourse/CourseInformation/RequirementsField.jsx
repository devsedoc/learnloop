import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({ name, label, register, setValue, errors }) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [list, setList] = useState([])

  useEffect(() => {
    if (editCourse) setList(course?.instructions || [])
    register(name, { validate: (value) => (value && value.length > 0) || false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  const add = () => {
    const value = requirement.trim()
    if (value) {
      setList([...list, value])
      setRequirement("")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="lable-style" htmlFor={name}>
        {label}
      </label>
      <p className="-mt-1 text-sm text-richblack-100">
        What students should know or have before starting, one item at a time.
      </p>
      {list.length > 0 && (
        <ul className="divide-y divide-richblack-700 rounded-lg border border-richblack-700">
          {list.map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-3 py-2 pl-4 pr-2">
              <span className="text-richblack-5">{item}</span>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-bold text-richblack-50 transition-colors duration-150 hover:bg-richblack-700 active:bg-richblack-600"
                onClick={() => setList(list.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          id={name}
          value={requirement}
          placeholder="For example, basic JavaScript"
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add()
            }
          }}
          className="form-style min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={add}
          disabled={!requirement.trim()}
          className="shrink-0 rounded-lg border border-richblack-400 px-5 font-bold text-richblack-5 transition-colors duration-150 hover:bg-richblack-800 active:bg-richblack-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {errors[name] && <p className="form-error">Add at least one requirement.</p>}
    </div>
  )
}
