import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url: string = '';


  constructor(private http: HttpClient) {
    this.url = `${environment.api}`
  }

  saveTask(data: FormData) {
    return this.http.post(`${this.url}/tasks`, data);

  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/tasks`);
  }

  deletedTask(id: number) {
    return this.http.delete(`${this.url}/tasks/${id}`);
  }

  updateTask(taskId: number, task: Task) {
    const url = `${this.url}/tasks/${taskId}`;
    const body = task;
    return this.http.put(url, body);
  }

  taskDetail(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}/tasks/${taskId}`);
  }

}
