import { create } from "zustand";

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

export const useSessionStore = create<StateType & ActionType>((set) => ({
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
}));
