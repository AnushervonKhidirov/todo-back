import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getTodos, addTodo, updateTodo } from './methods.js'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT)

// Endpoints
app.get('/todos/:filter', async (req, res) => {
    const todos = await getTodos(req.params.filter)
    res.end(JSON.stringify(todos))
})

app.get('/todos/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/add', async (req, res) => {
    const response = await addTodo(req.body.text)
    res.end(JSON.stringify(response))
})

app.post('/todos/update/:todoId', async (req, res) => {
    const updatedTodo = await updateTodo({ id: req.params.todoId, todoData: req.body })
    res.end(JSON.stringify(updatedTodo))
})

app.post('/todos/remove/:todoId', (req, res) => {
    res.end()
})
