const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // What a course card needs: reviews for the rating, and the instructor's name.
    const cardPopulate = {
      path: "courses",
      match: { status: "Published" },
      populate: [
        { path: "ratingAndReviews" },
        { path: "instructor", select: "firstName lastName" },
      ],
    }

    const selectedCategory = await Category.findById(categoryId)
      .populate(cardPopulate)
      .exec()
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }

    // One other category with published courses, picked at random.
    // An empty category is a valid result; the page shows an empty state.
    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate(cardPopulate)
      .exec()
    const withCourses = otherCategories.filter((c) => c.courses.length > 0)
    const differentCategory = withCourses.length
      ? withCourses[getRandomInt(withCourses.length)]
      : null

    // Most-enrolled published courses across every category.
    const allCourses = [selectedCategory, ...otherCategories].flatMap(
      (category) => category.courses
    )
    const mostSellingCourses = [...allCourses]
      .sort(
        (a, b) =>
          (b.studentsEnroled?.length || 0) - (a.studentsEnroled?.length || 0)
      )
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
