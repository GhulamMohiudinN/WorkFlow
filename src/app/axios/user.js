

"use client";
import API from "./index";
import { tryCatch } from "../utils/tryCatch";

const USER = {
  createUser: async (body) => {
    return tryCatch(API.post("/user/createUser", body));
  },
  getUser: async () => {
    return tryCatch(API.get("user/getUser"));
  },
 
}





export default USER