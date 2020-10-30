import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Entry } from "../../Interfaces/entry.interface";

const entries = createSlice({
  name: "entry",
  initialState: [] as Entry[],
  reducers: {
    setEntries(state, { payload }: PayloadAction<Entry[] | null>) {
      return (state = payload !== null ? payload : []);
    },

    updateEntry(state, { payload }: PayloadAction<Entry>) {
      const { id } = payload;
      const entryIndex = state.findIndex((entry) => entry.id === id);

      if (entryIndex !== -1) {
        state.splice(entryIndex, 1, payload);
      }
    },
  },
});

export const { setEntries, updateEntry } = entries.actions;
export default entries.reducer;
