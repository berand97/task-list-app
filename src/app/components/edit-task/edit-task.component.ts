import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TaskService } from 'src/app/shared/services/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  task!: Task;
  taskForm!: FormGroup;
  nextId!: number;

  newTask: FormControl = this.fb.control('', Validators.required);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.getTasksDetail(id);
    this.builForm();
  }

  get taskArray() {
    return this.taskForm.get('tasks') as FormArray;
  }

  getTasksDetail(id: number): void {
    this.taskService.taskDetail(id).subscribe((task) => {
      this.task = task;
      this.taskForm.patchValue(this.task);

      this.buildArrayForm();
    });
  }

  buildArrayForm(): void {
    const tasks = this.taskForm.get('tasks') as FormArray;
    this.task.tasks.forEach(t => {
      tasks.push(this.fb.group({
        id: t.id,
        task: [t.task, Validators.required],
        complete: t.complete
      }));
    });
  }

  builForm(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      tasks: this.fb.array([], Validators.required)
    });
  }

  isValid(campo: string) {
    return this.taskForm.controls[campo].errors
      && this.taskForm.controls[campo].touched;
  }

  addTask() {
    if (this.newTask.invalid) { return; }
    const newTask = {
      id: this.nextId,
      task: this.newTask.value,
      complete: false
    };
    this.taskArray.push(this.fb.control(newTask));
    this.newTask.reset();
    this.nextId++;

    this.taskForm.patchValue({
      tasks: this.taskArray.value
    });

    this.cd.detectChanges();
  }

  updateTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.taskService.updateTask(this.task.id, this.taskForm.value)
      .subscribe((resp: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha actualizado la tarea',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigateByUrl('');
      })

  }

  deteledTask(i: number) {
    this.taskArray.removeAt(i);

    this.taskForm.patchValue({
      tasks: this.taskArray.value
    });
  }

  updateTaskValue(task: AbstractControl, value: Event) {
    task.patchValue({ task: (value.target as HTMLInputElement).value });
  }
}
