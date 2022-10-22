class Task {
    id = null;
    text = null;
    day = null;
    reminder = false;
}

interface TaskList {
    tasks:Task[];
}

class TaskService
{
    #hydrate:HydrateApp;
    #api:Api;
    #model:TaskList;

    constructor(hydrate:HydrateApp, api:Api) {
        this.#hydrate = hydrate;
        this.#api = api;
        this.#model = this.#hydrate.bind("tasksList", {
            tasks: this.#api.getTasks()
        });
    }

    subscribeToTasks(callback:HydrateSubscriptionCallback):HydrateModelSubscription
    {
        return this.#hydrate.subscribe(this.#hydrate.path(this.#model.tasks), callback);
    }

    emptyTask():Task {
        return new Task();
    }
    getTasks():Task[] {
        return this.#api.getTasks();
    }
    addTask(task:Task):Task {
        const tasks = this.#api.getTasks();
        //Determine the next id number
        task.id = tasks.reduce((id, t) => t.id > id ? t.id : id, 0) + 1;
        tasks.push(task);
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
    toggleReminder(id:number):Task {
        const tasks = this.#api.getTasks();
        const task = tasks.find(x => x.id === id);
        if(task == null)
            return undefined;
        task.reminder = !task.reminder;
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
    deleteTask(id:number):Task {
        const tasks = this.#api.getTasks();
        let index = tasks.findIndex(x => x.id === id);
        if(index < 0)
            return undefined;
        const task = tasks[index];
        tasks.splice(index, 1);
        this.#model.tasks = this.#api.saveTasks(tasks);
        return task;
    }
}