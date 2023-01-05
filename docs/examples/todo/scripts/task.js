class Task {
    id = null;
    text = null;
    day = null;
    reminder = false;
}
class TaskService {
    #hydrate;
    #api;
    #model;
    constructor(hydrate) {
        this.#hydrate = hydrate;
        this.#api = new Api();
        this.#model = this.#hydrate.bind("tasksList", {
            tasks: this.#api.getTasks()
        });
    }
    subscribeToTasks(callback) {
        return this.#hydrate.subscribe(this.#hydrate.path(this.#model.tasks), callback);
    }
    emptyTask() {
        return new Task();
    }
    getTasks() {
        return this.#api.getTasks();
    }
    addTask(task) {
        const tasks = this.#api.getTasks();
        //Determine the next id number
        task.id = tasks.reduce((id, t) => t.id > id ? t.id : id, 0) + 1;
        tasks.push(task);
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
    toggleReminder(id) {
        const tasks = this.#api.getTasks();
        const task = tasks.find(x => x.id === id);
        if (task == null)
            return undefined;
        task.reminder = !task.reminder;
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
    deleteTask(id) {
        const tasks = this.#api.getTasks();
        let index = tasks.findIndex(x => x.id === id);
        if (index < 0)
            return undefined;
        const task = tasks[index];
        tasks.splice(index, 1);
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
}
