import { Component, OnInit } from '@angular/core';

interface Product {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  progress?: number;
}

interface PlanDetails {
  tasks: string[];
}
@Component({
  selector: 'app-vallarchi-sheet',
  templateUrl: './vallarchi-sheet.component.html',
  styleUrls: ['./vallarchi-sheet.component.scss']
})
export class VallarchiSheetComponent implements OnInit {
currentDate = new Date();
  selectedProduct: Product | null = null;
  planDetails: PlanDetails | null = null;

  products: Product[] = [
    { id: '1', name: 'Product A' },
    { id: '2', name: 'Product B' },
    { id: '3', name: 'Product C' }
  ];

  tasks: Task[] = [
    { id: '1', title: 'Multicity development', completed: true },
    { id: '2', title: 'Flight flow responsive development', completed: false },
    { id: '3', title: 'List page revamp', completed: true },
    { id: '4', title: 'API Migration', completed: false }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize with empty product details
    this.planDetails = null;
  }

  onProductChange(product: Product): void {
    this.selectedProduct = product;
    this.loadProductDetails();
  }

  loadProductDetails(): void {
    if (this.selectedProduct) {
      // Simulate loading product details
      this.planDetails = {
        tasks: [
          'Multicity development 80% completed',
          'List page revamp integrates'
        ]
      };
    } else {
      this.planDetails = null;
    }
  }

  onTaskChange(task: Task): void {
    task.completed = !task.completed;
  }

  onSubmitAndView(): void {
    console.log('Submit and view clicked');
    // Handle submit and view action
  }

  onSendToManager(): void {
    console.log('Send to manager clicked');
    // Handle send to manager action
  }

  getFormattedDate(): string {
    const day = this.currentDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[this.currentDate.getMonth()];
    const year = this.currentDate.getFullYear();
    
    return `${day}, ${month} ${year}`;
  }

}
