import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-richblack-5">New course</h1>
      <div className="mt-8 flex items-start gap-10">
        <div className="min-w-0 max-w-3xl flex-1">
          <RenderSteps />
        </div>
        <aside className="sticky top-8 hidden w-[280px] shrink-0 border-l border-richblack-700 pl-6 xl:block">
          <h2 className="font-medium text-richblack-5">Before you start</h2>
          <ul className="mt-4 list-disc space-y-3 pl-4 text-sm text-richblack-50">
            <li>Set a price in rupees, or 0 to make the course free.</li>
            <li>Thumbnails look best at 16:9, for example 1024 × 576.</li>
            <li>
              A course is split into sections, and each section holds one or
              more video lectures.
            </li>
            <li>
              Every section needs at least one lecture before you can move on
              to publishing.
            </li>
            <li>
              The course stays a draft, hidden from students, until you publish
              it.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
