import 'dotenv/config'
import fsSimple from 'fs'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'

export async function addTodo(text) {
    const todoToAdd = {
        id: uuid(),
        text: text,
        isDone: false,
        isOnTrash: false,
    }

    const data = await getTodos()
    data.unshift(todoToAdd)
    updateTodos(data)

    return todoToAdd
}

export async function updateTodo(todoData) {
    console.log('todoData', todoData)

    const data = await getTodos()
    const newData = data.map(todo => (todo.id === todoData.id ? todoData : todo))
    updateTodos(newData)
    return todoData
}

export async function removeTodo(id) {
    const data = await getTodos()
    const newData = data.filter(todo => todo.id !== id)
    updateTodos(newData)
    return {}
}

export async function getTodos(filter) {
    await createTodoJson()
    const allTodos = (
        await fs.readFile(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`)
    ).toString()
    const allTodosObject = allTodos === '' ? [] : JSON.parse(allTodos)

    if (filter === 'active' && allTodosObject.length !== 0) return allTodosObject.filter(todo => !todo.isOnTrash)
    if (filter === 'removed' && allTodosObject.length !== 0) return allTodosObject.filter(todo => todo.isOnTrash)
    return allTodosObject
}

export async function getTodoById(id) {
    const todosJson = (
        await fs.readFile(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`)
    ).toString()
    const todos = JSON.parse(todosJson)

    return todos.find(todo => todo.id === id)
}

async function updateTodos(todos) {
    fs.writeFile(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`, JSON.stringify(todos))
}

async function createTodoJson() {
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.TODO_FOLDER}`))
        fsSimple.mkdirSync(`${process.cwd()}/${process.env.TODO_FOLDER}`)
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`))
        fsSimple.writeFileSync(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`, '[]')
}
