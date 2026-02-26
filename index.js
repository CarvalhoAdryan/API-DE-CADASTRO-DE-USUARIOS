import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { Postgres } from './databasepostgres.js'
import { autenticar } from './middlewares/auth.js'

const db = new Postgres()
const port = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res) =>{
    res.json({
        message:"Funcionando"
    })
})

app.get("/users",autenticar, async(req, res) => {
    const users =  await db.SelectionUsers()
    res.json(users)
    console.log(users)
    console.log(req.user.id)
})

app.get("/users/:id",autenticar,async(req,res) => {
    const { id } =  req.params
    const user = await db.SelectionUser(id)
    res.json(user)
    console.log(user)
})

app.post("/users", async(req,res) =>{
    const user = req.body
    const newUser = await db.InsertUser(user)
    res.status(201).json(newUser)
})

app.put("/users/:id", async (req,res) => {
    const { id } = req.params
    const user = req.body
    await db.UpdateUser(id,user)
})

app.delete("/users/:id", async(req,res) => {
    const { id } = req.params
    await db.DeleteUser(id)
})

app.post("/login", async(req,res) => {
    const {email, password} = req.body

    try{
        const token = await db.LoginUser(email,password)
        res.status(201).json(token)
    } catch(error){
        res.status(401).json({message: "Credenciais invalidas"})
    }
})


app.listen(port)

console.log("Backend rodando")
