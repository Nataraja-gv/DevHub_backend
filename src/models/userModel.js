const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be strong (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)"
          );
        }
      },
    },
    profileImage: {
      type: Array,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not supported`,
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: [
          "frontend developer",
          "backend developer",
          "fullstack developer",
          "mobile developer",
          "devops engineer",
          "qa engineer",
          "ui/ux designer",
          "data scientist",
          "machine learning engineer",
          "project manager",
          "product manager",
          "admin",
        ],
        message: "{VALUE} is not a supported role",
      },
      default: "fullstack developer",
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one skill is required.",
      },
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    githubLink: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid GitHub URL");
        }
      },
    },
    linkedinLink: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid LinkedIn URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.VerifyPassword = async function (password) {
  const user = this;
  const verifyPassword = await bcrypt.compare(password, user.password);
  return verifyPassword;
};

userSchema.methods.GetToken = async function () {
  const user = this;
  const usertoken = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  return usertoken;
};
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
