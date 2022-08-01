import React from "react";

import { ContextType } from "./types";

export const defaultContext: ContextType = {
  setContext: () => {},

  layoutClassName: "",
  layoutStyle: {},
  width: 0,
};

export const Context = React.createContext(defaultContext);
