import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  updateUser: null,
});
