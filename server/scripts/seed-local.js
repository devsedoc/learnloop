// Fills a LOCAL development database with test accounts and sample courses.
// Usage (from server/):  node scripts/seed-local.js
// It wipes the database first, and refuses to run unless MONGODB_URL points at this machine.

require("dotenv").config()
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const User = require("../models/User")
const Profile = require("../models/Profile")
const Category = require("../models/Category")
const Course = require("../models/Course")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const RatingAndReview = require("../models/RatingandReview")
const CourseProgress = require("../models/CourseProgress")

const url = process.env.MONGODB_URL || ""
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) {
  console.error("Refusing to seed: MONGODB_URL is not a local database.")
  process.exit(1)
}

// Public sample media hosted on Cloudinary's demo account
const VIDEO = "https://res.cloudinary.com/demo/video/upload/dog.mp4"
const THUMBS = [
  "https://res.cloudinary.com/demo/image/upload/w_640,h_360,c_fill/sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_640,h_360,c_fill/kitten.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_640,h_360,c_fill/couple.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_640,h_360,c_fill/balloons.jpg",
]

const catalogue = [
  {
    category: "Web Development",
    description: "Building websites and web apps, front end to back end.",
    courses: [
      {
        name: "React from the Ground Up",
        description: "Components, state, effects and routing, by building a small notes app.",
        learn: "Build React components\nManage state with hooks\nAdd routing with React Router",
        price: 499,
        tags: ["react", "javascript", "frontend"],
        sections: [
          ["Getting started", ["Setting up the project", "Your first component", "Props"]],
          ["State and effects", ["useState", "useEffect", "Fetching data"]],
        ],
      },
      {
        name: "REST APIs with Node and Express",
        description: "Design and build a JSON API with authentication and a MongoDB database.",
        learn: "Structure an Express app\nModel data with Mongoose\nProtect routes with JWT",
        price: 699,
        tags: ["node", "express", "mongodb", "backend"],
        sections: [
          ["Express basics", ["Routes and middleware", "Request validation"]],
          ["Data and auth", ["Mongoose models", "Password hashing", "JWT sessions"]],
        ],
      },
    ],
  },
  {
    category: "Programming Fundamentals",
    description: "Core programming and problem-solving skills.",
    courses: [
      {
        name: "Data Structures in C++",
        description: "Arrays, linked lists, stacks, queues and trees, with practice problems.",
        learn: "Pick the right data structure\nAnalyse time complexity\nSolve interview-style problems",
        price: 399,
        tags: ["cpp", "dsa"],
        sections: [
          ["Linear structures", ["Arrays", "Linked lists", "Stacks and queues"]],
          ["Trees", ["Binary trees", "Binary search trees"]],
        ],
      },
      {
        name: "Git and GitHub for Beginners",
        description: "Commits, branches, pull requests and fixing common mistakes.",
        learn: "Track changes with Git\nWork with branches\nCollaborate on GitHub",
        price: 0,
        tags: ["git", "github"],
        sections: [["Everyday Git", ["Commits", "Branches", "Pull requests"]]],
      },
    ],
  },
]

const password = () => crypto.randomBytes(9).toString("base64url")

async function makeUser(firstName, lastName, email, accountType, plain) {
  const profile = await Profile.create({ about: null, contactNumber: null })
  return User.create({
    firstName,
    lastName,
    email,
    password: await bcrypt.hash(plain, 10),
    accountType,
    approved: true,
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
  })
}

async function main() {
  await mongoose.connect(url)
  await mongoose.connection.dropDatabase()

  const instructorPass = password()
  const studentPass = password()
  const instructor = await makeUser("Test", "Instructor", "instructor@learnloop.test", "Instructor", instructorPass)
  const student = await makeUser("Test", "Student", "student@learnloop.test", "Student", studentPass)

  const allCourses = []
  let t = 0
  for (const group of catalogue) {
    const category = await Category.create({ name: group.category, description: group.description })
    for (const c of group.courses) {
      const sectionIds = []
      for (const [sectionName, lectures] of c.sections) {
        const subs = await SubSection.insertMany(
          lectures.map((title) => ({
            title,
            description: `${title} lecture.`,
            timeDuration: "10",
            videoUrl: VIDEO,
          }))
        )
        const section = await Section.create({ sectionName, subSection: subs.map((s) => s._id) })
        sectionIds.push(section._id)
      }
      const course = await Course.create({
        courseName: c.name,
        courseDescription: c.description,
        instructor: instructor._id,
        whatYouWillLearn: c.learn,
        courseContent: sectionIds,
        price: c.price,
        thumbnail: THUMBS[t++ % THUMBS.length],
        tag: c.tags,
        category: category._id,
        instructions: ["A laptop with internet access", "No prior experience needed"],
        status: "Published",
      })
      category.courses.push(course._id)
      instructor.courses.push(course._id)
      allCourses.push(course)
    }
    await category.save()
  }
  await instructor.save()

  // Enrol the student in two courses, with some progress and a review
  for (const course of allCourses.slice(0, 2)) {
    course.studentsEnroled.push(student._id)
    const firstSection = await Section.findById(course.courseContent[0])
    const progress = await CourseProgress.create({
      courseID: course._id,
      userId: student._id,
      completedVideos: firstSection.subSection.slice(0, 2),
    })
    student.courses.push(course._id)
    student.courseProgress.push(progress._id)
  }
  const review = await RatingAndReview.create({
    user: student._id,
    rating: 4,
    review: "Clear explanations and a good pace. The project at the end helped a lot.",
    course: allCourses[0]._id,
  })
  allCourses[0].ratingAndReviews.push(review._id)
  for (const course of allCourses) await course.save()
  await student.save()

  const file = path.join(__dirname, "..", "local-test-accounts.md")
  fs.writeFileSync(
    file,
    [
      "# Local test accounts",
      "",
      "Only for the local database (mongodb://127.0.0.1:27017/learnloop-local).",
      "Re-running `node scripts/seed-local.js` wipes the data and generates new passwords.",
      "",
      `- Instructor: instructor@learnloop.test / ${instructorPass}`,
      `- Student: student@learnloop.test / ${studentPass}`,
      "",
    ].join("\n")
  )

  console.log(`Seeded ${allCourses.length} courses in ${catalogue.length} categories.`)
  console.log(`Test account passwords written to ${file}`)
  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
