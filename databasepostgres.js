import { sql } from "./db.js"

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
        const {name, email} = user 
        const newUser = await sql`INSERT INTO users (name,email) VALUES (${name},${email}) RETURNING *`
        return newUser
    }

    async UpdateUser(id,user){
        const {name,email} = user
         await sql`UPDATE users SET name = ${name}, email = ${email} WHERE id= ${id}`
    }

    async DeleteUser(id){
        await sql`DELETE FROM users WHERE id=${id}`
    }
}


