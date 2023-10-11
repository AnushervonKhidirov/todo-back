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
    data.push(todoToAdd)
    updateTodos(data)
}

export async function changeDoneStatus({ id, status }) {
    const data = await getTodos()
    const newData = data.map(todo => (todo.id === id ? { ...todo, isDone: status } : todo))
    updateTodos(newData)
}

export async function changeText({ id, text }) {
    const data = await getTodos()
    const newData = await data.map(todo => (todo.id === id ? { ...todo, text: text } : todo))
    updateTodos(newData)
}

export async function changeTrashStatus({ id, status }) {
    const data = await getTodos()
    const newData = data.map(todo => (todo.id === id ? { ...todo, isOnTrash: status } : todo))
    updateTodos(newData)
}

export async function removeTodo(id) {
    const data = await getTodos()
    const newData = data.filter(todo => todo.id !== id)
    updateTodos(newData)
}

export async function getTodos() {
    await createTodoJson()
    const data = await fs.readFile(`${process.cwd()}/${process.env.TODO_FOLDER}/${process.env.TODO_FILE}`)
    return data.toString() === '' ? [] : JSON.parse(data.toString())
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
