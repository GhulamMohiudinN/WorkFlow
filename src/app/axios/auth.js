"use client";
import API from "./index";
import { tryCatch } from "../utils/tryCatch";

const AUTH = {
  createUser: (body) => {
    return tryCatch(API.post("/auth/register", body));
  },
  login:(body) => {
    return tryCatch(API.post("/auth/login", body));
  },
  logout:() => {
    const refreshToken = localStorage.getItem("refreshToken");
    tryCatch(API.post("/auth/logout", {refreshToken}));
    localStorage.removeItem("refreshToken");
    return
  },
  sendVerificationEmail: (body) => {
    return tryCatch(API.post("/auth/send-verification-email", body));
  },
  
  verifyToken : (token) => {
    return tryCatch(API.post(`/auth/verify-email?token=${token}`,));
  },

  refreshToken: (body) => {
    return tryCatch(API.post("/auth/refresh-tokens",body));
  },


}





export default AUTH