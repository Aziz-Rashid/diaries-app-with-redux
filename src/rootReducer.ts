import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./Features/Auth/authSlice";
import userReducer from "./Features/Auth/userSlice";
import diariesReducer from "./Features/Diary/diariesSlice";
import entriesReducer from "./Features/Entry/entriesSlice";
import editorReducer from "./Features/Entry/editorSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  diaries: diariesReducer,
  entries: entriesReducer,
  editor: editorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
