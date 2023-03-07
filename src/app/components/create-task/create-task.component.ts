import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/shared/services/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {

  nextId: number = 1;

  taskForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    tasks: this.fb.array([], Validators.required)
  });

  newTask: FormControl = this.fb.control('', Validators.required);
  complete: FormControl = this.fb.control(false, Validators.required);

  get taskArray() {
    return this.taskForm.get('tasks') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) { }

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
  }

  borrar(i: number) {
    this.taskArray.removeAt(i);
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.taskService.saveTask(this.taskForm.value)
      .subscribe((resp: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha creado una nueva tarea',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigateByUrl('');
      })

  }

}

