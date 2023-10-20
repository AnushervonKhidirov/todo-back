import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getTodos, getTodoById, addTodo, updateTodo, removeTodo } from './methods/todo.js'
import { getProjects, getProjectById, addProject, updateProject, removeProject } from './methods/project.js'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT)

// Project endpoints
app.get('/projects/:filter', async (req, res) => {
    const projects = await getProjects(req.params.filter)
    res.end(JSON.stringify(projects))
})

app.get('/projects/get/:todoId', async (req, res) => {
    const project = await getProjectById(req.body.id)
    res.end(JSON.stringify(project))
})

app.post('/projects/add', async (req, res) => {
    const projects = await addProject(req.body.text)
    res.end(JSON.stringify(projects))
})

app.post('/projects/update', async (req, res) => {
    const projects = await updateProject(req.body)
    res.end(JSON.stringify(projects))
})

app.delete('/projects/remove', async (req, res) => {
    const projects = await removeProject(req.body.id)
    res.end(JSON.stringify(projects))
})

// Todo endpoints
app.get('/todos/:filter', async (req, res) => {
    const todos = await getTodos(req.params.filter)
    res.end(JSON.stringify(todos))
})

app.get('/todos/get/:todoId', async (req, res) => {
    const todo = await getTodoById(req.body.id)
    res.end(JSON.stringify(todo))
})

app.post('/todos/add', async (req, res) => {
    const todos = await addTodo(req.body.text)
    res.end(JSON.stringify(todos))
})

app.post('/todos/update', async (req, res) => {
    const todos = await updateTodo(req.body)
    res.end(JSON.stringify(todos))
})

app.delete('/todos/remove', async (req, res) => {
    const todos = await removeTodo(req.body.id)
    res.end(JSON.stringify(todos))
})
