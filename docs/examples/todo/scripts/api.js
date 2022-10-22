class Api {
    #tasks;
    constructor() {
        const tasks = window.localStorage.getItem("todos") ?? "[]";
        this.#tasks = JSON.parse(tasks);
    }
    getTasks() {
        return this.#tasks;
    }
    saveTasks(tasks) {
        window.localStorage.setItem("todos", JSON.stringify(tasks));
        this.#tasks = tasks;
        return tasks;
    }
}
