"use client";
import API from "./index";
import { tryCatch } from "../utils/tryCatch";

const WORKSPACE = {
  createWorkspace: async (body) => {
    return tryCatch(API.post("/workspace/createWorkspace", body));
  },
  
  addMemberInWorkspace: async (body) => {
    return tryCatch(API.post("/workspace/addMember", body));
  },
  sendAddMemberEmail: async (body) => {
    return tryCatch(API.post("/workspace/sendAddMemberEmail", body));
  },
  
  verifyAddMemberToken: async (body) => {
    return tryCatch(API.post("/workspace/verify-invite", body));
  },

  getSettingsApi : async (workspaceId) => {
    return tryCatch(API.get(`/workspace/${workspaceId}/getSettings`));
  },

  updateSettingApi : async (workspaceId, body) => {
    return tryCatch(API.patch(`/workspace/${workspaceId}/updateSettings`, body));
  }
  

}





export default WORKSPACE