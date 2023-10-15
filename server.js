import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getTodos, getTodoById, addTodo, updateTodo, removeTodo } from './methods.js'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT)

// Endpoints
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
