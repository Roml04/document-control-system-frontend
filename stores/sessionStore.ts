import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "~/constants/types";

export type SessionStateType = {
  userId: number | null;
  firstName: string;
  lastName: string;
  role: Role | null;
  token: string | null;
};

type SessionActionType = {
  updateSession: (session: Partial<SessionStateType>) => void;
};

export const useSessionStore = create<SessionStateType & SessionActionType>()(
  persist(
    (set) => ({
      userId: null,
      firstName: "",
      lastName: "",
      role: null,
      token: null,
      updateSession: (session) =>
        set((state) => ({
          ...state,
          ...session,
        })),
    }),
    { name: "session-store" },
  ),
);
