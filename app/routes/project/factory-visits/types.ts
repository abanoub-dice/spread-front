import type { Dayjs } from 'dayjs';

export enum FactoryVisitStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface FactoryVisitFormData {
  date: Dayjs | null;
  factoryName: string;
  overallFeedback: string;
  issues: string;
  critical: boolean;
  nextVisitDate: Dayjs | null;
}

export interface CreateFactoryVisitPayload {
  date: string | null;
  factoryName: string;
  overallFeedback: string;
  issues: string;
  critical: boolean;
  nextVisitDate: string | null;
  projectId?: number;
}

export interface FactoryVisit {
  id: number;
  date: string;
  factoryName: string;
  overallFeedback: string;
  issues: string;
  critical: boolean;
  nextVisitDate: string;
  media: {
    id: number;
    url: string;
    original_name: string;
    category: string;
    type: 'IMAGE' | 'VIDEO';
  }[];
  visitor: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductionItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
  lineItem: any; // You might want to define a more specific type
  category: any; // You might want to define a more specific type
  createdAt: string;
  updatedAt: string;
}

export interface VisitProductionItem {
  id: number;
  status: VisitProductionItemStatus;
  productionUpdate: string;
  productionItem: ProductionItem;
  description: string;
  media: {
    id: number;
    url: string;
    category: string;
    type: 'IMAGE' | 'VIDEO';
    original_name: string;
  }[];
  factoryVisitId: number;
  createdAt: string;
  updatedAt: string;
}

export enum VisitProductionItemStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  READY_TO_DISPATCH = 'ready_to_dispatch',
}

export interface CreateVisitProductionItemPayload {
  status: VisitProductionItemStatus;
  description: string;
  productionUpdate: string;
  productionItemId: number;
  factoryVisitId: number;
}

export interface VisitProductionItemFormData {
  status: VisitProductionItemStatus;
  description: string;
  productionUpdate: string;
  productionItemId: number;
}

export interface UpdateVisitProductionItemPayload extends Partial<CreateVisitProductionItemPayload> {
  id: number;
}

export interface CreateProductionItemPayload {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'in_progress' | 'completed';
  factoryVisitId: number;
}

export interface UpdateProductionItemPayload extends Partial<CreateProductionItemPayload> {
  id: number;
}