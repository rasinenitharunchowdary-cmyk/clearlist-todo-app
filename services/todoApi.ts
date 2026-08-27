import type { ApiTodo, TodoChanges } from '@/types/todo';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: options?.body ? { 'Content-Type': 'application/json' } : options?.headers,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new Error('Could not reach the todo service. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new Error(`The todo service returned an error (${response.status}). Please try again.`);
  }

  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

export function getTodos(signal?: AbortSignal) {
  return apiRequest<ApiTodo[]>(API_BASE_URL, { signal });
}

export function createTodo(todo: Omit<ApiTodo, 'id'>) {
  return apiRequest<ApiTodo>(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

export function updateTodo(id: number, changes: Partial<TodoChanges>) {
  return apiRequest<Partial<ApiTodo>>(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export async function deleteTodo(id: number) {
  await apiRequest<unknown>(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
}
