const UserModel = require("../models/userModel");

const userProfile = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      return res
        .status(200)
        .json({ message: `${user.userName} profile data`, data: user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = req.user;
    const {
      userName,
      age,
      gender,
      city,
      role,
      experience,
      skills,
      bio,
      githubLink,
      linkedinLink,
      profileImage,
    } = req.body;
    if (
      !userName ||
      age === undefined ||
      !gender ||
      !city ||
      !role ||
      experience === undefined ||
      !skills ||
      !bio
    ) {
      throw new Error("All fields are required");
    }
    const allowedGender = ["male", "female", "others"];
    const allowedRoles = [
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
    ];

    if (age < 15) {
      throw new Error("Age must be a number greater than 15");
    }

    // Gender check
    if (!allowedGender.includes(gender.toLowerCase())) {
      throw new Error(`Invalid gender: ${gender}`);
    }

    // Role check
    if (!allowedRoles.includes(role.toLowerCase())) {
      throw new Error(`Invalid role: ${role}`);
    }

    // Skills array check
    if (skills.length === 0) {
      throw new Error("At least one skill is mandatory");
    }

    // Experience check
    if (experience <= 0) {
      throw new Error("Experience must be a valid number");
    }

    // URL validation
    if (githubLink && !validator.isURL(githubLink)) {
      throw new Error("Invalid GitHub link");
    }

    if (linkedinLink && !validator.isURL(linkedinLink)) {
      throw new Error("Invalid LinkedIn link");
    }

    let updatedImages = [];
    if (profileImage) {
      let existingImages = [];
      if (typeof profileImage === "string") {
        existingImages = [profileImage];
      } else if (Array.isArray(profileImage)) {
        existingImages = profileImage;
      }
      updatedImages = existingImages?.map((url) => ({
        images_link: url,
      }));
    }

    if (req.files && req.files.length > 0) {
      let newImages = req.files?.map((url) => ({
        images_link: url.location,
      }));
      updatedImages = [...updatedImages, ...newImages];
    }

    const userData = {
      userName,
      age,
      gender,
      city,
      role,
      experience,
      skills,
      bio,
      profileImage: updatedImages,
      githubLink,
      linkedinLink,
    };

    const userProfile = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      userData,
      { new: true }
    );

    const response = await userProfile.save();
    res
      .status(200)
      .json({ message: `${user.userName} updated profile `, data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userProfile, editProfile };
