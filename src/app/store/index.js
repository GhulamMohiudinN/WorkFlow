"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
   
      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", 
    }
  )
);




export const useWorkspaceStore = create(
  persist(
    (set) => ({
      workspace: null,
      role: null,

      setWorkspace: (workspace) => {
        const currentUser = useUserStore.getState().user;

        if (!workspace || !currentUser) {
          return set({ workspace: null, role: null });
        }

        const currentUserId = currentUser._id;
        const adminId = workspace.adminId?._id;

        if (currentUserId === adminId) {
          return set({ workspace, role: "admin" });
        }

        if (workspace?.members?.length > 0) {
          const member = workspace.members.find(
            (m) => m.memberId?._id?.toString() === currentUserId.toString()
          );

          if (member?.role) {
            return set({ workspace, role: member.role });
          }
        }

        return set({ workspace, role: "member" });
      },

      clearWorkspace: () => set({ workspace: null, role: null }),
    }),
    {
      name: "workspace-storage", // key in localStorage
    }
  )
);