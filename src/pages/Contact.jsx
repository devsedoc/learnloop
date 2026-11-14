import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi"

import Footer from "../components/Common/Footer"
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm"

const channels = [
  {
    icon: FiMail,
    label: "Email",
    value: "devangsharma200623@gmail.com",
    href: "mailto:devangsharma200623@gmail.com",
  },
  {
    icon: FiGithub,
    label: "GitHub",
    value: "github.com/devsedoc",
    href: "https://github.com/devsedoc",
  },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/devangsharmaa",
    href: "https://www.linkedin.com/in/devangsharmaa",
  },
]

function Contact() {
  return (
    <div className="text-richblack-5">
      <section className="mx-auto grid w-11/12 max-w-maxContent gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-5 max-w-[440px] leading-relaxed text-richblack-50">
            Found a bug, have a question about a course, or want to talk about
            the project? Use the form or any of these.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4 transition-colors duration-150 hover:bg-richblack-700"
                >
                  <Icon className="text-xl text-yellow-50" />
                  <span>
                    <span className="block text-sm text-richblack-100">
                      {label}
                    </span>
                    <span className="block break-all text-richblack-25 ">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold">Send a message</h2>
          <p className="mt-2 text-sm text-richblack-100">
            You will get a confirmation email once it is sent.
          </p>
          <div className="mt-7">
            <ContactUsForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Contact
