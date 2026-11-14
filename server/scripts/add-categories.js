// Adds the course topics (categories) to a database, such as production.
// Topics can't be created from the site without an Admin account, so this
// is how the first ones get in.
//
// Safe to re-run: it only inserts topics whose name isn't there yet.
// It never edits or deletes anything.
//
// Usage (from server/), PowerShell:
//   $env:MONGODB_URL = "<your production connection string>"
//   node scripts/add-categories.js          # dry run: shows what it would add
//   node scripts/add-categories.js --yes    # actually adds them
//   Remove-Item Env:MONGODB_URL             # forget the string afterwards
//
// MONGODB_URL set in the shell wins over the one in server/.env.

require("dotenv").config()
const mongoose = require("mongoose")
const Category = require("../models/Category")

const TOPICS = [
  {
    name: "Web Development",
    description: "Building websites and web apps, front end to back end.",
  },
  {
    name: "Programming Fundamentals",
    description: "Core programming and problem-solving skills.",
  },
]

const url = process.env.MONGODB_URL || ""
const write = process.argv.includes("--yes")

// Show where we are connecting without printing the password.
function describe(u) {
  try {
    const parsed = new URL(u)
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`
  } catch {
    return "(unreadable connection string)"
  }
}

;(async () => {
  if (!url) {
    console.error("Set MONGODB_URL first. See the usage notes at the top of this file.")
    process.exit(1)
  }
  console.log(`Database: ${describe(url)}`)
  await mongoose.connect(url)

  const existing = await Category.find({}, "name").lean()
  const have = new Set(existing.map((c) => c.name))
  const missing = TOPICS.filter((t) => !have.has(t.name))

  console.log(`Topics already there: ${existing.length ? existing.map((c) => c.name).join(", ") : "none"}`)
  if (!missing.length) {
    console.log("Nothing to add.")
  } else if (!write) {
    console.log(`Would add: ${missing.map((t) => t.name).join(", ")}`)
    console.log("Dry run only. Run again with --yes to add them.")
  } else {
    await Category.insertMany(missing.map((t) => ({ ...t, courses: [] })))
    console.log(`Added: ${missing.map((t) => t.name).join(", ")}`)
  }

  await mongoose.disconnect()
})().catch((err) => {
  console.error("Failed:", err.message)
  process.exit(1)
})
