export interface ActionItem {
  id: number;
  description: string;
  dueDate: string;
  completed: boolean;
  assignedUser: {
    id: number;
    name: string;
    email: string;
  };
  creator: {
    id: number;
    name: string;
    email: string;
  };
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItemPayload {
  id: number;
  name: string;
  description: string;
  assigned_to: number[];
  due_date: string;
  completed: boolean;
} 

export interface CreateActionItemPayload {
  description: string;
  dueDate: string;
  completed: boolean;
  assignedUserId: number;
  projectId: number;
}

export interface UpdateActionItemPayload {
  description: string;
  dueDate: string;
  assignedUserId: number;
}