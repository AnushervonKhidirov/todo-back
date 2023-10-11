import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getTodos, addTodo } from './methods.js'

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
    const data = await getTodos()
    res.send(data)
    res.end()
})

app.post('/todos/update/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/delete/:todoId', (req, res) => {
    res.end()
})

app.post('/todos/remove/:todoId', (req, res) => {
    res.end()
})
