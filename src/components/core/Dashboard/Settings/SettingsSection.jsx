// Each settings block is a row: what it is on the left, the controls on the right.
export default function SettingsSection({ title, description, children }) {
  return (
    <section className="grid gap-6 border-t border-richblack-700 py-8 lg:grid-cols-[240px_1fr] lg:gap-10">
      <div>
        <h2 className="text-lg font-bold text-richblack-5">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-richblack-100">{description}</p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
