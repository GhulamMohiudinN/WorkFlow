"use client";
import { Provider } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { initializeAuth } from "./slices/authSlice";

export function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
