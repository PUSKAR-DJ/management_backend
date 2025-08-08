const User = require("../models/User")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword.", 400))
  }

  const filteredBody = filterObj(req.body, "name", "email")

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role, refId } = req.body

  // Only managers can create users
  if (req.user.role !== "manager") {
    return next(new AppError("Only managers can create new users", 403))
  }

  const validRefIds = {
    manager: process.env.MANAGER_SIGNUP_REFID,
    team_lead: process.env.TEAM_LEAD_SIGNUP_REFID,
    executive: process.env.EXECUTIVE_SIGNUP_REFID,
  }

  if (validRefIds[role] !== refId) {
    return next(new AppError("Invalid reference ID for the specified role", 400))
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    refId,
    createdBy: req.user._id,
  })

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  })
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})
