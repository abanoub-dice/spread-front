export enum LineItemStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  BOOKED = 'booked',
}

export interface Media {
  id: number;
  url: string;
  original_name: string;
  category: string;
  type: string;
}

export interface ProductionItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
  category: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: number;
  name: string;
  assigned_to: {
    id: number;
    name: string;
    email: string;
  }[];
  notes: string;
  project: any;
  actual_images: Media[];
  rendered_images: Media[];
  status: LineItemStatus;
  productionItems?: ProductionItem[];
}

export interface LineItemPayload {
  id: number;
  name: string;
  assigned_to: number[];
  notes: string;
  project: any;
  status: LineItemStatus;
}
