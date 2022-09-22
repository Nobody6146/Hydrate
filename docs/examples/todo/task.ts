class Task {
    id = null;
    text = null;
    day = null;
    reminder = false;
}

class TaskService
{
    static loadTasks() {
        // return [
        //     {text: "hello", day: "Today", reminder:true}
        // ]
        let tasks = window.localStorage.getItem("todos") ?? "[]";
        return JSON.parse(tasks);
    }
    static saveTasks(tasks) {
        window.localStorage.setItem("todos", JSON.stringify(tasks));
    }
    static createTask() {
        return new Task();
    }
}