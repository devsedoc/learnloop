import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import Footer from "../components/Common/Footer"
import CourseCard from "../components/core/Catalog/Course_Card"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"

const slug = (name) => name.split(" ").join("-").toLowerCase()

function CourseGrid({ courses }) {
  return (
    <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  )
}

export default function Catalog() {
  const { catalogName } = useParams()
  // "loading" | "not-found" | "error" | data object
  const [page, setPage] = useState("loading")

  useEffect(() => {
    let cancelled = false
    setPage("loading")
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category = res?.data?.data?.find((c) => slug(c.name) === catalogName)
        if (!category) {
          if (!cancelled) setPage("not-found")
          return
        }
        const data = await getCatalogPageData(category._id)
        if (!cancelled) setPage(data?.success ? data.data : "error")
      } catch {
        if (!cancelled) setPage("error")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [catalogName])

  if (page === "loading") {
    return (
      <div className="mx-auto w-11/12 max-w-maxContent py-16 text-richblack-50">
        Loading courses...
      </div>
    )
  }

  if (page === "not-found" || page === "error") {
    return (
      <>
        <div className="mx-auto w-11/12 max-w-maxContent py-16">
          <h1 className="text-3xl font-semibold text-richblack-5">
            {page === "not-found" ? "No such topic" : "Courses couldn't be loaded"}
          </h1>
          <p className="mt-3 text-richblack-50">
            {page === "not-found"
              ? "This topic doesn't exist, or it has been renamed."
              : "Check your connection and refresh the page."}
          </p>
          <Link to="/" className="mt-6 inline-block font-medium text-yellow-50 hover:underline">
            Back to the home page
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const { selectedCategory, differentCategory, mostSellingCourses } = page
  const courses = selectedCategory?.courses || []
  const others = differentCategory?.courses || []
  const bestSellers = (mostSellingCourses || []).slice(0, 3)

  return (
    <>
      <section className="border-b border-richblack-700">
        <div className="mx-auto w-11/12 max-w-maxContent py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-richblack-100">
            <Link to="/" className="hover:text-richblack-5 hover:underline">
              Home
            </Link>{" "}
            / <span className="text-richblack-5">{selectedCategory?.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-semibold text-richblack-5 sm:text-4xl">
            {selectedCategory?.name}
          </h1>
          {selectedCategory?.description && (
            <p className="mt-3 max-w-[720px] text-lg text-richblack-50">
              {selectedCategory.description}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto w-11/12 max-w-maxContent py-12">
        <h2 className="text-2xl font-semibold text-richblack-5">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </h2>
        {courses.length ? (
          <CourseGrid courses={courses} />
        ) : (
          <p className="mt-4 text-richblack-50">
            No published courses in this topic yet.
          </p>
        )}
      </section>

      {others.length > 0 && (
        <section className="border-t border-richblack-700">
          <div className="mx-auto w-11/12 max-w-maxContent py-12">
            <h2 className="text-2xl font-semibold text-richblack-5">
              Also on Learnloop: {differentCategory.name}
            </h2>
            <CourseGrid courses={others.slice(0, 3)} />
            <Link
              to={`/catalog/${slug(differentCategory.name)}`}
              className="mt-8 inline-block font-medium text-yellow-50 hover:underline"
            >
              See all {differentCategory.name} courses
            </Link>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="border-t border-richblack-700">
          <div className="mx-auto w-11/12 max-w-maxContent py-12">
            <h2 className="text-2xl font-semibold text-richblack-5">
              Most enrolled across all topics
            </h2>
            <CourseGrid courses={bestSellers} />
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
