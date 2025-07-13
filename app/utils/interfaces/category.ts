export type ProjectCategory = 'AV' | 'Fabrication' | 'Printing' | 'Giveaways';

export interface Category {
  id?: string;
  name: string;
  description?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export enum CategoriesType {
  PROJECT = 'project',
  PRODUCTION_ITEM = 'productionItem',
}

export const categoriesTypesArray = Object.values(CategoriesType);
export interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  mode: 'create' | 'update';
  categoriesType: CategoriesType;
}
