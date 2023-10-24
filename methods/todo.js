import 'dotenv/config'
import fsSimple from 'fs'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'

export async function addTodo(todo) {
    const todoToAdd = {
        id: uuid(),
        text: todo.text,
        projectId: todo.projectId,
        done: false,
        deleted: false,
    }

    const data = await getAllTodos()
    data.unshift(todoToAdd)
    updateTodos(data)

    return todoToAdd
}

export async function updateTodo(todoData) {
    const data = await getAllTodos()
    const newData = data.map(todo => (todo.id === todoData.id ? todoData : todo))
    updateTodos(newData)
    return todoData
}

export async function deleteTodo(id) {
    const data = await getAllTodos()
    const newData = data.filter(todo => todo.id !== id)
    updateTodos(newData)
    return {}
}

export async function getAllTodos(projectId) {
    await createTodoJson()
    const allTodos = (
        await fs.readFile(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.TODO_FILE}`)
    ).toString()

    if (allTodos === '') return []
    if (projectId) return JSON.parse(allTodos).filter(todo => todo.projectId === projectId)
    return JSON.parse(allTodos)
}

export async function getActiveTodos(projectId) {
    const allTodos = await getAllTodos(projectId)
    return allTodos.filter(todo => !todo.deleted)
}

export async function getDeletedTodos(projectId) {
    const allTodos = await getAllTodos(projectId)
    return allTodos.filter(todo => todo.deleted)
}

export async function getTodoById(id) {
    const todos = await getAllTodos()
    return todos.find(todo => todo.id === id)
}

async function updateTodos(todos) {
    fs.writeFile(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.TODO_FILE}`, JSON.stringify(todos))
}

async function createTodoJson() {
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.DB_FOLDER}`))
        fsSimple.mkdirSync(`${process.cwd()}/${process.env.DB_FOLDER}`)
    if (!fsSimple.existsSync(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.TODO_FILE}`))
        fsSimple.writeFileSync(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.TODO_FILE}`, '[]')
}
