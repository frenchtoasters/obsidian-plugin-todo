import { TodoItem, TodoItemStatus } from '../model/TodoItem';

export class TodoParser {
  async parseTasks(filePath: string, fileContents: string): Promise<TodoItem[]> {
    const pattern = /(-|\*) \[\[(TODO|x|TODOx)\]\]\s(.*)/g;
    return [...fileContents.matchAll(pattern)].map((task) => this.parseTask(filePath, task));
  }

  private parseTask(filePath: string, entry: RegExpMatchArray): TodoItem {
    const todoItemOffset = 2; // Strip off `-|* `
    const status = entry[2] === 'x' ? TodoItemStatus.Done : TodoItemStatus.Todo;
    const description = entry[3];

    const datePattern = /#(\d{4}-\d{2}-\d{2})/g;
    const somedayPattern = /#(someday)|#(track)/g;
    const dateMatches = description.match(datePattern);
    const actionDate = dateMatches != null ? new Date(dateMatches[0]?.substring(1)) : undefined;

    return new TodoItem(
      status,
      description,
      description.match(somedayPattern) != null,
      filePath,
      (entry.index ?? 0) + todoItemOffset,
      entry[0].length - todoItemOffset,
      actionDate,
    );
  }
}
