import api from "./axios";

export const adminAPI = {
  // Invite team member
  inviteTeamMember: async (inviteData) => {
    const response = await api.post("/users/invite-team-members", inviteData);
    return response.data;
  },
};

export default adminAPI;


