"use client";
import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address")
    .required("Email is required"),

  password: Yup.string().trim().required("Please enter your Password "),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
      "Password must contain at least 1 letter and 1 number",
    )
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
      "Password must contain at least 1 letter and 1 number",
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),

  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

//  create workspace form schema

export const step1Schema = Yup.object().shape({
  userName: Yup.string().trim().required("User Name is required"),
  companyName: Yup.string()
    .trim()
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name cannot exceed 50 characters")
    .required("Company Name is required"),
  companyType: Yup.string().trim().required("Company Type is required"),
  industry: Yup.string().trim().required("Industry is required"),
  phoneNumber: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired(),
  website: Yup.string().trim().notRequired(),
  foundedYear: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "len",
      "Founded Year must be 4 digits",
      (val) => !val || String(val).length === 4,
    ),
});

export const step2Schema = Yup.object().shape({
  employeeCount: Yup.string().required("Employee Count is required"),
  headquarters: Yup.string()
    .trim()
    .required("Location is required")
    .matches(
      /^[a-zA-Z\s]+,\s*[a-zA-Z\s]+$/,
      "Location must be in 'City, Country' format",
    ),
  timezone: Yup.string().trim(),
  currency: Yup.string().trim().required("Primary Currency is required"),
  taxID: Yup.string().trim(),
  companyRegistrationNumber: Yup.string().trim(),
});

export const step3Schema = Yup.object().shape({
  expectedWorkflows: Yup.string(),
});

export const step4Schema = Yup.object().shape({
  initialTeamSize: Yup.string(),
});

export const addMemberSchema = Yup.object().shape({
  userName: Yup.string().trim().required("User Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
      "Password must contain at least 1 letter and 1 number",
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
