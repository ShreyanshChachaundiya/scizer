const User = require("../model/user");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, mobileNumber } = req.body;
  const newUser = new User({
    name,
    mobileNumber,
  });
  try {
    await newUser.save();
    res.status(201).json({ user: newUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    if (queryObj.name) {
      const searchTerm = queryObj.name;
      const regex = new RegExp(searchTerm, "i"); 
      queryObj.name = regex; 
    }
    const query = User.find(queryObj).sort({ name: 1 });

    const allUser = await query;
    res.status(200).json({
      No_of_User: allUser.length,
      users: {
        allUser,
      },
    });
  } catch (err) {
    const error = new HttpError(
      err.message,
      500
    );
    return next(error);
  }
};

exports.getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: user });
  
};

exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new HttpError("Invalid input ", 422);
  }

  const { title, description } = req.body;
  const id = req.params.id;

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    const error = new HttpError("could not find a place", 404);
    //if we are in synchronous fun we can use throw otherwise next
    return next(error);
  }

  user.title = title;
  user.description = description;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("failed", 500);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    const error = new HttpError(
      err.message,
      500
    );
    return next(error);
  }
};
