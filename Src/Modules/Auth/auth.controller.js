import { asyncHandler } from "../../Utils/errorHandling.js";
import userModel from "../../../DB/Models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../Utils/email.js";
import { resetPassTemp, signUpTemp } from "../../Utils/htmlTemplates.js";
import randomstring from "randomstring";
import cartModel from "../../../DB/Models/Cart.model.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password, cPassword } = req.body;
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("Email Already Exists", { cause: 409 }));
  }
  if (password != cPassword) {
    return next(new Error("MisMatch Password", { cause: 400 }));
  }

  const user = await userModel.create({
    userName,
    email,
    password
  });
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: 60 * 60 }
  );
  const confirmationLink = `${req.protocol}://${req.headers.host}/auth/activate_account/${token}`;
  const confirmationEmail = sendEmail({
    to: user.email,
    subject: "Please Activate Your Account",
    html: signUpTemp(confirmationLink),
  });
  if (!confirmationEmail) {
    return next(new Error("Error Sending Email", { cause: 500 }));
  }
  res.status(201).json({ message: "Done", user });
});

//activate_account
export const activate_account = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
  const user = await userModel.findByIdAndUpdate(
    { _id: decoded.id },
    { isConfirmed: true },
    { new: true }
  );
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  await cartModel.create({ user: user._id });
  return res.status(200).json({ message: "Done", user });
});

//login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("Wrong Password", { cause: 400 }));
  }
  (user.status = "online"), await user.save();
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SIGNATURE, {
    expiresIn: 60 * 60,
  });
  return res.status(200).json({ message: "Done", token });
});

//getUsers
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();
  return res.status(200).json({ message: "Done", users });
});

//forgetCode
export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !user.isConfirmed)
    return next(
      new Error("User not found or Not Activated Account", { cause: 404 })
    );

  const forgetCode = randomstring.generate({
    charset: "numeric",
    length: 6,
  });
  user.forgetCode = forgetCode;
  await user.save();

  const sendForegetCode = sendEmail({
    to: user.email,
    subject: "Forget Code",
    html: resetPassTemp(forgetCode),
  });

  if (!sendForegetCode) return next(new Error("Error Sending Email"));

  return res.status(200).json({ message: "Done , Please Check Your Inbox" });
});

//resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password, cPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  if (forgetCode != user.forgetCode) {
    return next(new Error("Wrong Forget Code", { cause: 400 }));
  }
  if (password != cPassword) {
    return next(new Error("MisMatch Password", { cause: 400 }));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  user.password = hashPassword;
  user.forgetCode = null;
  await user.save();
  return res.status(200).json({ message: "Done", user });
});
