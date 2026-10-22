import fs, { createWriteStream } from "node:fs"
import path, { parse } from "node:path"
import { fileURLToPath } from "node:url"

import jwt from "jsonwebtoken"

import { userRegister, userLogin, userById, getAllUsers, modDeleteUserById, modChangeUserRole, modChangeInfoUser, modGetPathImageUser, modChangePathImageUser } from "../models/users.js"
import { SECRETKEY, parseJwt } from "../utils/jwt.js"
import { create } from "node:domain"

// Путь до файла
const __filename = fileURLToPath(import.meta.url)
// Путь по директории
const __dirname = path.dirname(path.dirname(__filename))

function register(request, response){
    // Как надо сделать роли, то есть user, editor и admin через jwt
    console.log(request.body)
    userRegister(response, request.body.email, request.body.password, request.body.nikname)

}

async function login(request, response){
    
    let result = await userLogin(request.body.username, request.body.password)
    if (result.answer === "false") {
        response.status(500).send(JSON.stringify(result))
        return
    }

    const token = jwt.sign(
        {
            "id": result.info.id,
            "role": result.info.role
        },
        SECRETKEY,
        {
            expiresIn: "15m"
        }
    )

    response.set("Content-Type", "application/json")
    response.status(200).send(JSON.stringify({answer: "true", token: token}))
}

async function getUserById(request, response){

    const result = await userById(request.params.id)
    if (result.answer === "false"){
        response.set("Content-Type", "application/json")
        response.status(500).send(JSON.stringify({answer: result.answer, info: result.info}))
        return
    }

    response.set("Content-Type", "application/json")
    response.status(200).send(JSON.stringify({answer: result.answer, info: result.info}))
}

async function conGetAllUsers(request, response){
    const result = await getAllUsers()
    if (result.answer === "false")
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(result)
}

async function conDeleteUserById(request, response){
    const resultDeleteUserFromDB = modDeleteUserById(request.params.id)
    if (resultDeleteUserFromDB.answer === "false"){
        response.status(500)
    } else {
        response.status(200)
    }

    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(resultDeleteUserFromDB))
}

async function conChangeUserRole(request, response){
    let resultChangeUserRole = await modChangeUserRole(request.body.userId, request.body.newRole)
    if (resultChangeUserRole.answer === "false"){
        response.status(500)
    } else {
        response.status(200)
    }

    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(resultChangeUserRole))
}

async function conChangeInfoUser(request, response){
    // Нет проверки того что пользователь меняет именно у себя то есть id = id
    // просто изменеиня будут у того пользователья, который прислал запрос

    // Ищем что изменилось
    let objInfoUser = request.body
    let keys = Object.keys(objInfoUser["oldInfoUser"])
    let keysChanged = []
    for (let i = 0; i < keys.length; i++){
        if (objInfoUser["oldInfoUser"][`${keys[i]}`] !== objInfoUser["newInfoUser"][`${keys[i]}`])
            keysChanged.push(keys[i])
    }

    if (keysChanged.length === 0){
        let tempObj = {
            "answer": "true",
            "info": "Нет информации для смены!"
        }
        response.status(200)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(tempObj))
        return
    }
    
    let tempErrors = {errors: []}
    let tmepObj = {}

    for (let i = 0; i < keysChanged.length; i++){
        // console.log(request.user.id, keysChanged[i], objInfoUser["newInfoUser"][`${keysChanged[i]}`])
        
        // Как-то надо сделать проверку на ошибки!!!! Но тут цикл!
        let result = await modChangeInfoUser(request.user.id, keysChanged[i], objInfoUser["newInfoUser"][`${keysChanged[i]}`])

        // if (result.answer === "false"){
        //     tempErrors.answer = "false"
        //     tempErrors.errors.push(result.info)
        // }
       
    }

    let tempObj = {
        "answer": "true",
        "info": "Информация была изменена!"
    }

    response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(tempObj))
}

async function conGetImageUser(request, response){
    // Получение пути до картинки
    let result = await modGetPathImageUser(request.params.id)

    // Отправка картинки    
    response.sendFile(result.rows[0].image_url, (error) => {})

}

async function conUploadImageUser(request, response){
    let userId = request.user.id
    let fileName = request.get("X-Filename")
    let pathFile = path.join(__dirname, "user_avatars", fileName)
    // console.log(fs.existsSync(path.join(__dirname, "user_avatars", fileName)))
    if (fs.existsSync(pathFile)){
        fs.unlinkSync(pathFile)
    }
    let stream = createWriteStream(pathFile)
    request.pipe(stream)
    stream.on("finish", async () => {
        let result = await modChangePathImageUser(userId, pathFile)

        response.status(200)
        response.set("Content-Type", "application.json")
        response.send(result)

    })
    stream.on("error", () => {

    })
}

async function conGetAllUsernameOfUsers(request, response){
    let result = await getAllUsers()
    let users = [...result.info]
    let tempUsers = []
    for (let i = 0; i < users.length; i++){
        tempUsers.push(users[i].username)
    }
    response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify({answer: "true", info: tempUsers}))
}

export { register, login, getUserById, conGetAllUsers, conDeleteUserById, conChangeUserRole, conChangeInfoUser, conGetImageUser, conUploadImageUser, conGetAllUsernameOfUsers }