import { create } from "zustand";
import { persist } from "zustand/middleware";

type StateType = {
  firstName: string;
  lastName: string;
  role: string;
};

type ActionType = {
  updateFirstName: (firstName: StateType["firstName"]) => void;
  updateLastName: (lastName: StateType["lastName"]) => void;
  updateRole: (role: StateType["role"]) => void;
};

export const useSessionStore = create<StateType & ActionType>()(
  persist(
    (set) => ({
      firstName: "",
      lastName: "",
      role: "user",
      updateFirstName: (firstName: StateType["firstName"]) =>
        set(() => ({ firstName: firstName })),
      updateLastName: (lastName: StateType["lastName"]) =>
        set(() => ({ lastName: lastName })),
      updateRole: (role: StateType["role"]) =>
        set(() => ({
          role: role,
        })),
    }),
    { name: "session-store" },
  ),
);
