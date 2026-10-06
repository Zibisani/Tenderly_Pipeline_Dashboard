import { TickTickAdapter, TickTickTask, TickTickCreateTaskParams, TickTickUpdateTaskParams } from '../../types/integrations';
export class MockTickTickAdapter implements TickTickAdapter {
  private tasks: Map<string, TickTickTask> = new Map();
  async findByStableKey(key: string): Promise<TickTickTask | null> { for (const task of Array.from(this.tasks.values())) { if (task.tags.includes(key)) return task; } return null; }
  async createTask(params: TickTickCreateTaskParams): Promise<TickTickTask> {
    const id = Math.random().toString(36).substring(7);
    const task: TickTickTask = { id, title: params.title, content: params.content, dueDate: params.dueDate, timeZone: 'Africa/Gaborone', isAllDay: params.isAllDay, priority: params.priority, status: 0, projectId: 'mock_project', tags: params.tags };
    this.tasks.set(id, task); return task;
  }
  async updateTask(id: string, params: TickTickUpdateTaskParams): Promise<TickTickTask> {
    const task = this.tasks.get(id); if (!task) throw new Error('Task not found');
    const updated = { ...task, ...params }; this.tasks.set(id, updated); return updated;
  }
  async completeTask(id: string): Promise<void> {
    const task = this.tasks.get(id); if (task) { task.status = 2; this.tasks.set(id, task); }
  }
}
export function getTickTickAdapter(): TickTickAdapter { return new MockTickTickAdapter(); }
