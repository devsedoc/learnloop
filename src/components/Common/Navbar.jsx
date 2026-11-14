import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/learnloop.svg"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

// const subLinks = [
//   {
//     title: "Python",
//     link: "/catalog/python",
//   },
//   {
//     title: "javascript",
//     link: "/catalog/javascript",
//   },
//   {
//     title: "web-development",
//     link: "/catalog/web-development",
//   },
//   {
//     title: "Android Development",
//     link: "/catalog/Android Development",
//   },
// ];

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className="sticky top-0 z-[900] flex h-16 items-center justify-center border-b border-richblack-700 bg-richblack-900"
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={150} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-2">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-50 underline underline-offset-8"
                          : "text-richblack-25 hover:text-richblack-5"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg border border-richblack-600 bg-richblack-800 p-2 text-richblack-25 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                {loading ? (
                          <p className="p-3 text-center text-richblack-100">Loading...</p>
                        ) : subLinks?.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-xl bg-transparent px-4 py-3 hover:bg-richblack-700 hover:text-yellow-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="p-3 text-center text-richblack-100">No courses yet</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`rounded-lg px-3 py-2 ${
                        matchRoute(link?.path)
                          ? "text-yellow-50 underline underline-offset-8"
                          : "text-richblack-25 hover:text-richblack-5"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-lg px-4 py-2.5 font-bold text-richblack-5 hover:bg-richblack-800">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-lg bg-yellow-50 px-5 py-2.5 font-bold text-richblack-900 hover:bg-yellow-25 active:bg-yellow-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <AiOutlineMenu fontSize={24} fill="#D0D0D8" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-richblack-700 bg-richblack-900 px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-1 text-richblack-25">
            {NavbarLinks.filter((link) => link.path).map((link) => (
              <li key={link.title}>
                <Link to={link.path} className="block rounded-xl px-3 py-3">
                  {link.title}
                </Link>
              </li>
            ))}
            {subLinks
              ?.filter((subLink) => subLink?.courses?.length > 0)
              ?.map((subLink) => (
                <li key={subLink._id}>
                  <Link
                    to={`/catalog/${subLink.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`}
                    className="block rounded-xl px-3 py-3 text-richblack-100"
                  >
                    {subLink.name}
                  </Link>
                </li>
              ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-richblack-700 pt-4">
            {token === null ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-richblack-400 py-3 text-center font-bold text-richblack-5"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-yellow-50 py-3 text-center font-bold text-richblack-900"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard/my-profile"
                className="rounded-lg bg-yellow-50 py-3 text-center font-bold text-richblack-900"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
