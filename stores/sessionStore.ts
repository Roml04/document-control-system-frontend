import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionStateType = {
  userId: number | null;
  firstName: string;
  lastName: string;
  role: string;
};

type ActionType = {
  updateUserId: (userId: SessionStateType["userId"]) => void;
  updateFirstName: (firstName: SessionStateType["firstName"]) => void;
  updateLastName: (lastName: SessionStateType["lastName"]) => void;
  updateRole: (role: SessionStateType["role"]) => void;
};

export const useSessionStore = create<SessionStateType & ActionType>()(
  persist(
    (set) => ({
      userId: null,
      firstName: "",
      lastName: "",
      role: "user",
      updateUserId: (userId: SessionStateType["userId"]) =>
        set(() => ({ userId: userId })),
      updateFirstName: (firstName: SessionStateType["firstName"]) =>
        set(() => ({ firstName: firstName })),
      updateLastName: (lastName: SessionStateType["lastName"]) =>
        set(() => ({ lastName: lastName })),
      updateRole: (role: SessionStateType["role"]) =>
        set(() => ({
          role: role,
        })),
    }),
    { name: "session-store" },
  ),
);
