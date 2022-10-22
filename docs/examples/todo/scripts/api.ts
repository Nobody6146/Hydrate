class Api {
    #tasks:Task[];

    constructor() {
        const tasks = window.localStorage.getItem("todos") ?? "[]";
        this.#tasks = JSON.parse(tasks);
    }

    getTasks():Task[] {
        return this.#tasks;
    }

    saveTasks(tasks:Task[]):Task[] {
        window.localStorage.setItem("todos", JSON.stringify(tasks));
        this.#tasks = tasks;
        return tasks;
    }
}