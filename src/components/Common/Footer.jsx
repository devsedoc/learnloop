import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi"
import { Link } from "react-router-dom"

import Logo from "../../assets/Logo/learnloop.svg"

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/signup" },
      { label: "Dashboard", to: "/dashboard/my-profile" },
    ],
  },
]

const socials = [
  { icon: FiGithub, href: "https://github.com/devsedoc", label: "GitHub" },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/devangsharmaa",
    label: "LinkedIn",
  },
  {
    icon: FiMail,
    href: "mailto:devangsharma200623@gmail.com",
    label: "Email",
  },
]

function Footer() {
  return (
    <footer className="border-t border-richblack-800 bg-richblack-900">
      <div className="mx-auto grid w-11/12 max-w-maxContent gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={Logo} alt="Learnloop" width={168} height={32} />
          <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-richblack-100">
            A course platform for students and instructors. Built with React,
            Node.js, Express and MongoDB.
          </p>
          <div className="mt-5 flex gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-xl text-richblack-100 transition-all duration-200 hover:text-yellow-50"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <p className="text-sm font-bold text-richblack-100">
              {column.heading}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-richblack-50 transition-all duration-200 hover:text-yellow-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-richblack-800">
        <p className="mx-auto w-11/12 max-w-maxContent py-5 text-sm text-richblack-100">
          © 2026 Learnloop. Built by Devang Sharma.
        </p>
      </div>
    </footer>
  )
}

export default Footer
