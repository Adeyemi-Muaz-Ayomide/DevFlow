import { Task } from "../types/types";

const updateTasks = (tasks: Task[], updater: (task: Task) => Task): Task[] => {
  return tasks.map(updater);
};

export default updateTasks;
