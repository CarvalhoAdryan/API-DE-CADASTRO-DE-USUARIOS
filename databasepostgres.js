import { sql } from "./db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class Postgres{

    async SelectionUsers(){
        const users = await sql`SELECT * FROM users`
        return users
    }

    async SelectionUser(id){
        const user = await sql`SELECT * FROM users WHERE id = ${id}`
        return user
    }

    async InsertUser(user){
        const {name, email, password} = user 
        const hash = await bcrypt.hash(password,10)

        const newUser = await sql`INSERT INTO users (name,email,password) VALUES (${name},${email},${hash}) RETURNING *`
        return newUser
    }

    async UpdateUser(id,user){
        const {name,email} = user
         await sql`UPDATE users SET name = ${name}, email = ${email} WHERE id= ${id}`
    }

    async DeleteUser(id){
        await sql`DELETE FROM users WHERE id=${id}`
    }

    async LoginUser(email,password){
        const user = await sql`SELECT * FROM users WHERE email=${email}`
        const senhaCorreta = await bcrypt.compare(password, user[0].password)

        if(!senhaCorreta){
            throw new Error("Credenciais invalidas")
        }

        const token = jwt.sign({id:
            user[0].id
        },process.env.JWT_SECRET, {expiresIn: "1D"})

        return { token }

    }
}


