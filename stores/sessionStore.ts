import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionStateType = {
  userId: number | null;
  firstName: string;
  lastName: string;
  role: string;
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
      role: "user",
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
