
export interface Product {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  progress?: number;
}

export interface PlanDetails {
  tasks: string[];
}

export interface TaskRow {
  id: number;
  mainTask: string;
  subTask: string;
  todayTask: string;
  resourceName: string;
  phaseAndSprint: string;
  status: string;
  taskStartDate: string;
  taskEndDate: string;
  comments: string;
}

export interface TeamActivityFormData {
  date: string;
  workingResources: number;
  selectedProduct: string;
  tasks: TaskRow[];
}

export interface MenuItem {
  mainmenu: string;
  submenu: {
    name: string;
    route: string;
  }[];
}
