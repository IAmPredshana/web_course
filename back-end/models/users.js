import bcrypt from "bcrypt"

import { db } from "../db.js"

// Разобраться с JWT и ролями 
// Разобраться со структурой back-end

const PROPERTIES = ["username", "other_information"]

async function userRegister(response, email, password, nikname){

    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        
        const result = await db.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
            [email, passwordHash, nikname])
        
        let tempObj = {
            "answer": "true"
        }
        
        response.status(200).send(JSON.stringify(tempObj))
    } catch (err){
        let tempObj = {
            "answer": "false",
            "info": "Error in register!"
        }
        response.status(500).send(JSON.stringify(tempObj))
    }
}

async function userLogin(nikname, password){

    try {
        // Есть ли такой пользователь?
        const userHasPassword = await db.query('SELECT password_hash FROM users WHERE username = $1', [nikname])
        if (userHasPassword.rows.length === 0){
            let tempObjErr = {
                "answer": "false",
                "info": "User with this name do not found!"
            }  
            return tempObjErr 
        }
        
        // Совподяют ли пароли?
        const result = await bcrypt.compare(password, userHasPassword.rows[0].password_hash)
        if (result) {
            const infoUser = await db.query('SELECT * FROM users WHERE username = $1', [nikname])
            let tempObj = {
                "answer": "true",
                "info": infoUser.rows[0]
            }
            return tempObj
        }
        else {
            let tempObjErr = {
                "answer": "false",
                "info": "password is not correct!",
            }
            return tempObjErr
        }
        
    } catch (error) {
        let tempObjErr = {
            "answer": "false",
            "info": "Error in login!",
        }
        return tempObjErr
    }

}

async function userById(userId){
    try {
        const result = await db.query(
            'SELECT username, email, other_information, image_url FROM users WHERE id = $1',
            [userId])
        
        if (result.rows.length === 0){
            let tempObjErr = {
                "answer": "false",
                "info": "Error in getInfoUserById! User by id do not found!",
            }
            return tempObjErr
        }
        
        let tempObj = {
            "answer": "true",
            "info": result.rows[0]
        }

        return tempObj

    } catch (error) {
        let tempObjErr = {
            "answer": "false",
            "info": "Error in getInfoUserById!",
        }
        return tempObjErr
    }
    

    
}

async function getAllUsers(){
    try {
        const result = await db.query("SELECT * FROM users")
        return {
            "answer": "true",
            "info": result.rows
        }
    } catch(error){
        let tempObjErr = {
            "answer": "false",
            "info": "Erro in get all users!"
        }
        return tempObjErr
    }
}

async function modDeleteUserById(userId){
    try{
        const result = await db.query("DELETE FROM users WHERE id = $1", [userId])
        return {
            "answer": "true",
            "info": "User deleted (sql)!"
        }
    } catch(error){
        
        let tempObjErr = {
            "answer": "false",
            "info": "Erro in delete user by id (sql) !"
        }
        return tempObjErr
    }

}

async function modChangeUserRole(userId, newRole){
    try{
        const result = await db.query("UPDATE users SET role = $1 WHERE id = $2", [newRole, userId])
        return {
            "answer": "true",
            "info": "User role was changed (sql)!"
        }
    } catch(error){
        
        let tempObjErr = {
            "answer": "false",
            "info": "Erro changed user role (sql)!"
        }
        return tempObjErr
    }

}

async function modChangeInfoUser(userId, property, value){
    if(!(PROPERTIES.includes(property)))
        throw new Error(`Недопустимое поле ${property}`)
    let str = `UPDATE users SET "${property}" = $1 WHERE id = $2`
    console.log(str)
    console.log(value)
    console.log(userId)
    let result = await db.query(str, [value, userId])
}

async function modGetPathImageUser(userId){
    let result = await db.query("SELECT image_url FROM users WHERE id = $1", [userId])
    return result
}

async function modChangePathImageUser(userId, newPathImage){
    let result = await db.query("UPDATE users SET image_url = $1 WHERE id = $2", [newPathImage, userId])
    
    let tempObj = {
        "answer": "true",
        "info": "Image changed!"
    }
    
    return tempObj
}

export { userRegister, userLogin, userById, getAllUsers, modDeleteUserById, modChangeUserRole, modChangeInfoUser, modGetPathImageUser, modChangePathImageUser }