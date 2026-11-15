import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"

const steps = [
  { id: 1, title: "Details" },
  { id: 2, title: "Sections and lectures" },
  { id: 3, title: "Publish" },
]

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  return (
    <>
      <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-richblack-700 pb-4 text-sm">
        {steps.map((item) => {
          const state =
            step === item.id ? "current" : step > item.id ? "done" : "todo"
          return (
            <li
              key={item.id}
              aria-current={state === "current" ? "step" : undefined}
              className={
                state === "current"
                  ? "font-medium text-yellow-50"
                  : state === "done"
                  ? "text-richblack-5"
                  : "text-richblack-100"
              }
            >
              {item.id}. {item.title}
              {state === "done" && <span className="sr-only"> (done)</span>}
            </li>
          )
        })}
      </ol>
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  )
}
