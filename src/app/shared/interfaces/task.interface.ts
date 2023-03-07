export interface Task {
    id: number,
    name: string;
    description: string;
    tasks: TaskDetail[];
    category: string
}

export interface TaskDetail {
    id: number,
    task: string,
    complete: boolean
}