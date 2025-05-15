 const validator = require("validator");

const ValidSignUp = (req) => {
  const {
    userName,
    email,
    password,
    age,
    gender,
    city,
    role,
    experience,
    skills,
    bio,
    githubLink,
    linkedinLink,
  } = req.body;
    
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

  // Check for missing required fields
  if (
    !userName ||
    !email ||
    !password ||
    age === undefined || // handle age as number
    !gender ||
    !city ||
    !role ||
    experience === undefined || // handle experience as number
    !skills ||
    !bio
  ) {
    throw new Error("All fields are required");
  }

  // Email validation
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  // Password strength
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }

  // Age check
  if (  age < 15) {
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
  if (  skills.length === 0) {
    throw new Error("At least one skill is mandatory");
  }

  // Experience check
  if (  experience < 0) {
    throw new Error("Experience must be a valid number");
  }

  // URL validation
  if (githubLink && !validator.isURL(githubLink)) {
    throw new Error("Invalid GitHub link");
  }

  if (linkedinLink && !validator.isURL(linkedinLink)) {
    throw new Error("Invalid LinkedIn link");
  }
};

module.exports = ValidSignUp;
