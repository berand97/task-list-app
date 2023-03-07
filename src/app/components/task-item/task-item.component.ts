import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TaskService } from 'src/app/shared/services/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  tasks: Task[] = [];
  searchTerm = '';

  constructor(
    private taskService: TaskService
    ) { }
    
  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskService.getAllTasks()
      .subscribe((resp: Task[]) => {
        this.tasks = resp;
      })
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task.id, task)
      .subscribe(() => {
      });
  }

  deleteTask(task: Task) {
    this.taskService.deletedTask(task.id)
      .subscribe(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha eliminado la tarea ${task.name}`,
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllTasks();
      })
  }

  getCompletionPercentage(task: Task) {
    const completedTasks = task.tasks.filter(taskDetail => taskDetail.complete);
    const completionPercentage = completedTasks.length / task.tasks.length * 100;
    return completionPercentage;
  }

  areAllTasksCompleted(task: Task): boolean {
    return task.tasks.every(taskDetail => taskDetail.complete);
  }

  filterTasks(): Task[] {
    if (!this.searchTerm) {
      return this.tasks;
    }

    const searchTermLowerCase = this.searchTerm.toLowerCase();

    return this.tasks.filter(task => {
      const nameMatches = task.category.toLowerCase().includes(searchTermLowerCase);
      const descriptionMatches = task.description.toLowerCase().includes(searchTermLowerCase);
      const taskDetailMatches = task.tasks.some(taskDetail => taskDetail.task.toLowerCase().includes(searchTermLowerCase));
      return nameMatches || descriptionMatches || taskDetailMatches;
    });
  }

}
