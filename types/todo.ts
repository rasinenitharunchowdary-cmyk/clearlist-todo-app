export type TodoFilter = 'all' | 'pending' | 'completed';

export type ApiTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type Todo = ApiTodo & {
  clientId: string;
  isLocal?: boolean;
};

export type TodoChanges = Pick<Todo, 'title' | 'completed'>;

export type Feedback = {
  id: number;
  tone: 'success' | 'error';
  message: string;
};
