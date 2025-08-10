import { create } from 'zustand';

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

interface DialogueActions {
  setDialogue: (data: DialogueData) => void;
  resetDialogue: () => void;
}

type DialogueStore = DialogueState & DialogueActions;

const initialState: DialogueData = {
  show: false,
  title: "",
  text: "",
  acceptLabel: "",
  acceptColor: "primary",
  closable: true,
  onAccept: undefined,
};

export const useDialogueStore = create<DialogueStore>((set) => ({
  data: initialState,

  setDialogue: (data: DialogueData) => {
    set({ data });
  },

  resetDialogue: () => {
    set({ data: initialState });
  },
}));
