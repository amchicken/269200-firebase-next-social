import { useState } from "react";

export const useForm = (init) => {
  const [state, setState] = useState(init);

  return [
    state,
    (e) => {
      setState((state) => {
        return { ...state, [e.target.name]: e.target.value };
      });
    },
    setState,
  ];
};
