
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface TaskRow {
  id: number;
  mainTask: string;
  subTask: string;
  todayTask: string;
  resourceName: string;
  phaseAndSprint: string;
  status: string;
  taskStartDate: Date;
  taskEndDate: Date;
  comments: string;
}

@Component({
  selector: 'app-team-activity',
  templateUrl: './team-activity.component.html',
  styleUrls: ['./team-activity.component.scss']
})
export class TeamActivityComponent implements OnInit {
  teamActivityForm: FormGroup;
  currentDate = new Date();
  
  mainTaskOptions = [
    'Development',
    'Testing',
    'Design',
    'Documentation',
    'Planning'
  ];

  subTaskOptions = [
    'Frontend Development',
    'Backend Development',
    'API Integration',
    'Unit Testing',
    'Integration Testing',
    'UI Design',
    'UX Research'
  ];

  resourceOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
  ];

  phaseOptions = [
    'Phase 1 - Sprint 1',
    'Phase 1 - Sprint 2',
    'Phase 2 - Sprint 1',
    'Phase 2 - Sprint 2'
  ];

  statusOptions = [
    'Not Started',
    'In Progress',
    'Completed',
    'Blocked',
    'On Hold'
  ];
products= [
  "Product1",
  "Product2",
  "Product3"
]
  constructor(private fb: FormBuilder) {
    this.teamActivityForm = this.fb.group({
      date: [this.formatDate(this.currentDate), Validators.required],
      workingResources: ['', [Validators.required, Validators.min(1)]],
      selectedProduct: [''],
      tasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addTaskRow();
    this.addTaskRow();
    this.addTaskRow();
  }

  get tasksFormArray(): FormArray {
    return this.teamActivityForm.get('tasks') as FormArray;
  }

  createTaskRow(): FormGroup {
    return this.fb.group({
      mainTask: ['', Validators.required],
      subTask: ['', Validators.required],
      todayTask: ['', Validators.required],
      resourceName: ['', Validators.required],
      phaseAndSprint: ['', Validators.required],
      status: ['', Validators.required],
      taskStartDate: [this.formatDate(this.currentDate), Validators.required],
      taskEndDate: [this.formatDate(this.addDays(this.currentDate, 7)), Validators.required],
      comments: ['']
    });
  }

  addTaskRow(): void {
    this.tasksFormArray.push(this.createTaskRow());
  }

  removeTaskRow(index: number): void {
    if (this.tasksFormArray.length > 1) {
      this.tasksFormArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.teamActivityForm.valid) {
      const formData = this.teamActivityForm.value;
      console.log('Team Activity Data:', formData);
      // Handle form submission here
      alert('Team activity submitted successfully!');
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.teamActivityForm.controls).forEach(key => {
      const control = this.teamActivityForm.get(key);
      control?.markAsTouched();
    });

    this.tasksFormArray.controls.forEach(taskGroup => {
      Object.keys(taskGroup.value).forEach(key => {
        const control = taskGroup.get(key);
        control?.markAsTouched();
      });
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

}
