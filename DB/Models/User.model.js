import mongoose, { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: "false",
    },
    phone: String,
    age: Number,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["online", "offline", "blocked"],
      default: "offline",
    },
    forgetCode: Number,
    profileImage: {
      url: {
        type: String,
        required: true,
        default:
          "https://res.cloudinary.com/dufeuhlpq/image/upload/v1715268931/E-Commerce/defaults/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396_chp9uo.jpg",
      },
      id: {
        type: String,
        required: true,
        default:
          "E-Commerce/defaults/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396_chp9uo",
      },
    },
    coverImages: [
      {
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
});

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
