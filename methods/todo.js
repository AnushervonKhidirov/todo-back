import 'dotenv/config'
import fsSimple from 'fs'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'
import { getProjectById, updateProject } from './project.js'

export async function addTodo(todo) {
    const todoToAdd = {
        id: uuid(),
        text: todo.text,
        done: false,
        deleted: false,
    }

    const data = await getTodos()
    data.unshift(todoToAdd)
    updateTodos(data)

    const project = await getProjectById(todo.projectId)
    project.todos.push(todoToAdd.id)
    updateProject(project)

    return todoToAdd
}

export async function updateTodo(todoData) {
    const data = await getTodos()
    const newData = data.map(todo => (todo.id === todoData.id ? todoData : todo))
    updateTodos(newData)
    return todoData
}

export async function deleteTodo(id) {
    const data = await getTodos()
    const newData = data.filter(todo => todo.id !== id)
    updateTodos(newData)
    return {}
}

export async function getTodos(filter, projectId) {
    await createTodoJson()
    const allTodos = (
        await fs.readFile(`${process.cwd()}/${process.env.DB_FOLDER}/${process.env.TODO_FILE}`)
    ).toString()
    let allTodosObject = allTodos === '' ? [] : JSON.parse(allTodos)

    if (projectId) {
        const project = await getProjectById(projectId)
        allTodosObject = allTodosObject.filter(todo => project.todos.find(todoId => todoId === todo.id))
    }

    if (filter === 'active' && allTodosObject.length !== 0) return allTodosObject.filter(todo => !todo.deleted)
    if (filter === 'deleted' && allTodosObject.length !== 0) return allTodosObject.filter(todo => todo.deleted)
    return allTodosObject
}

export async function getTodoById(id) {
    const todos = await getTodos()
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
