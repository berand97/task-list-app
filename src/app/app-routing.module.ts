import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';

const routes: Routes = [
  {
    path: 'crear-tarea', component: CreateTaskComponent
  },
  {
    path: 'editar-tarea/:id', component: EditTaskComponent
  },
  {
    path: '**',
    component: TasksListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
