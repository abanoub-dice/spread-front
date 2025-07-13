import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '../store';

type MuiColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';

interface DialogueData {
  show: boolean;
  title?: string;
  text?: string;
  acceptLabel?: string;
  acceptColor?: MuiColor;
  closable?: boolean;
  onAccept?: () => void;
}

interface DialogueState {
  data: DialogueData;
}

const initialState: DialogueState = {
  data: {
    show: false,
    title: "",
    text: "",
    acceptLabel: "",
    acceptColor: "primary",
    closable: true,
    onAccept: undefined,
  },
};

export const dialogueSlice = createSlice({
  name: "dialogue",
  initialState,
  reducers: {
    setDialogue: (state, action: PayloadAction<DialogueData>) => {
      state.data = action.payload;
    },
    resetDialogue: () => initialState,
  },
});

export const { setDialogue, resetDialogue } = dialogueSlice.actions;

export const getDialogue = (state: RootState) => state.dialogue.data;

export default dialogueSlice.reducer;