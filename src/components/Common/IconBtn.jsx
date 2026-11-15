export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center gap-x-2 rounded-lg px-5 py-2.5 font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        outline
          ? "border border-richblack-400 bg-transparent text-richblack-5 hover:bg-richblack-800 active:bg-richblack-700"
          : "bg-yellow-50 text-richblack-900 hover:bg-yellow-25 active:bg-yellow-100"
      } ${customClasses || ""}`}
      type={type}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}
