export interface ProjectSummary {
  id: number;
  name: string;
  client: string;
  productionStartDate: string;
  productionEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  projectType: string;
}

export interface GroupedProjects {
  [key: string]: ProjectSummary[]; // key will be the month
}

export interface ProjectFilters {
  search: string;
  categories: string[];
}

export interface ProjectsResponse {
  data: ProjectSummary[];
  total: number;
  page: number;
  limit: number;
} 