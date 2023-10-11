import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getTodos, addTodo, updateTodo } from './methods.js'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT)

// Endpoints
app.get('/todos', async (req, res) => {
    const todos = await getTodos()
    res.send(JSON.stringify(todos))
    res.end()
})

app.get('/todos/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/add', async (req, res) => {
    await addTodo(req.body.text)
    res.end()
})

app.post('/todos/update/:todoId', async (req, res) => {
    const updatedTodo = await updateTodo({ id: req.params.todoId, todoData: req.body })
    res.send(JSON.stringify(updatedTodo))
    res.end()
})

app.post('/todos/remove/:todoId', (req, res) => {
    res.end()
})
