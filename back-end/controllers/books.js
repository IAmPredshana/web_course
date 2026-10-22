import fs, { createWriteStream } from "node:fs"
import path, { parse } from "node:path"
import { fileURLToPath } from "node:url"

import { parseJwt } from "../utils/jwt.js"

import { addNewBook, addCoverByBook, getBooksByUserId, getInfoBookById, deleteBookById, modGetAllBooksInPending, modGetFormatsOfBook,
    modApproveBook, modNotApproveBook, modGetIngoAboutRejectedBook, modGetBooksByCountAndPage, modGetAuthorOfBook,
    modGetBooksByCountAndPageWithFilters  } from "../models/books.js"

////// ДОБАВИТЬ УДАЛЕНИЕ ФАЙЛОВ КНИГ И ОБЛОЖЕК!!!!!!!!

// Путь до файла
const __filename = fileURLToPath(import.meta.url)
// Путь по директории
const __dirname = path.dirname(path.dirname(__filename))

async function uploadBook(request, response){

    // Добавляем книгу в папку books
    const fileName = decodeURIComponent(request.get("X-Filename")) 
    const savePath = path.join(__dirname, "books", fileName)    
    const stream = fs.createWriteStream(savePath)
    const fileSize = request.get("X-Filesize")
    const description = decodeURIComponent(request.get("X-Description"))

    // Сделать проверку расширениф файла так как не надо exe и т.д.!
    let temp = fileName.split(".")
    temp = temp.pop()
    const fileExtension = temp 

    request.pipe(stream)
    stream.on("finish", async () => {
        
        // Добавляем запись в базе данных
        let title = fileName.split(".")
        title.pop()
        if (title.length >= 1){
            title = title.join(" ")
        }
        let result = await addNewBook(title, savePath, request.get("X-Userid"), fileExtension, fileSize, description)

        if (result.answer === "false"){
            response.status(200)
            response.set("Content-Type", "application/json")
            response.send(JSON.stringify({"answer": "false", "info": result.answer}))
            return
        }

        response.status(200)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(result))


    })
    stream.on("error", () => {
        response.status(500).json({
            "answer": "false",
            "info": "File book was not save!"
        })
    })
}

async function uploadCover(request, response){

    // Добавляем обложку в папку covers
    const fileName = decodeURIComponent(request.get("X-Filename")) 
    const savePath = path.join(__dirname, "covers", fileName)    
    const stream = fs.createWriteStream(savePath)
    request.pipe(stream)
    stream.on("finish", async () => {
        
        // Добавляем запись в базе данных
        let result = await addCoverByBook(request.get("X-Bookid"), savePath)

        if (result.answer === "false"){
            response.status(200)
            response.set("Content-Type", "application/json")
            response.send(JSON.stringify({"answer": "false", "info": result.answer}))
            return
        }

        response.status(200)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(result))

    })
    stream.on("error", () => {
        response.status(500).json({
            "answer": "false",
            "info": "File cover was not save!"
        })
    })
}

async function getBooksByUser(request, response){
    const result = await getBooksByUserId(request.params.id)
    if (result.answer === "false"){
        response.status(500)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(result))
        return
    }

    response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(result))
    return
}

async function getCoverBook(request, response){
    let bookId = request.params.id
    let infoBook = await getInfoBookById(bookId)

    if (infoBook.answer === "false"){
        response.status(500)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(infoBook))
        return
    }

    response.sendFile(infoBook.info[0].cover_url, (error) => {
        
    })


}

async function downloadBookById(request, response){
}

async function getInfoBook(request, response){
    const infoBook = await getInfoBookById(request.params.id)
    response.status(200)
    response.set("Content-Type", "application/json")
    response.send(infoBook.info[0])
}

async function deleteBook(request, response){
    // Для удления смотрим, что пользователь удаляет свою книгу
    // но наверное админу тоже нужно такое сделать

    const userId = parseJwt(request.get("Authorization")).id
    const result = await getBooksByUserId(userId)
    const userBooks = result.info
    let isInlude = false

    for (let i = 0; i < userBooks.length; i++){
        if (userBooks[i].id == request.params.id){
            isInlude = true
            break
        }
    }

    if (!isInlude){
        let tempObjErr = {
            "answer": "false",
            "info": "It is not your book!"
        }  
        response.status(500)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify(tempObjErr))
        return
    }

    const resultDeleteBook = await deleteBookById(request.params.id)

    if (resultDeleteBook.answer === "false")
        response.status(500)
    else
        response.status(200)

    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(resultDeleteBook))
    return


}

async function conGetAllBooksInPending(request, response){
    let resultGetAllBooksInPending = await modGetAllBooksInPending()
    if (resultGetAllBooksInPending.asnwer === "false")
        response.status(500)        
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(resultGetAllBooksInPending))
    return
}

async function conGetFormatsOfBook(request, response){
    let result = await modGetFormatsOfBook(request.params.id)

    if (result.answer === "false")
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(result)
}

async function conGetFileOfBook(request, response){
    const filename = request.params.path
    const pathOfFile = path.join(__dirname, "books", filename)

    if (!fs.existsSync(pathOfFile)) {
        return response.status(404).json({ answer: "false", info: "Файл не найден" })
    }

    response.set(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    )
    response.set("Content-Type", "application/octet-stream")

    const stream = fs.createReadStream(pathOfFile)
    stream.on("error", (err) => {
        console.error(err)
        if (!response.headersSent) response.status(500).end()
    })
    stream.pipe(response)
}

async function conApproveBook(request, response){
    let bookId = request.params.id
    let result = await modApproveBook(bookId)
    if (result.answer === false)
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(result))
}

async function conNotApproveBook(request, response){
    let bookId = request.params.id
    let message = decodeURIComponent(request.get("X-Message"))
    let result = await modNotApproveBook(bookId, message)
    if (result.answer === false)
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(result))
}

async function conGetIngoAboutRejectedBook(request, response){
    let result = await modGetIngoAboutRejectedBook(request.params.id)
    if (result === "false")
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(result))
}

async function conGetBooksByCountAndPage(request, response){
    let count = request.query.count
    let page = request.query.page
    let result = await modGetBooksByCountAndPage(count, page)
    if (result.answer === "false")
        response.status(500)    
    else
        response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify(result))
}

async function conGetAuthorOfBook(request, response){
    let idOfBook = request.params.id
    let result = await modGetAuthorOfBook(idOfBook)
    if (request.answer === "false")
        response.status(500)
    else
        response.status(200)
    response.set("Content-Type", "  application/json")
    response.send(JSON.stringify(result))
}

async function conGetBooksByCountAndPageWithFilters(request, response) {
    const { title, formats, users, count, page } = request.query;
    const params = [];
    const conditions = [];

    if (title) {
        params.push(`%${title}%`);
        conditions.push(`t1.title LIKE $${params.length}`);
    }

    if (formats) {
        const list = Array.isArray(formats) ? formats : formats.split(',');
        params.push(list);
        conditions.push(`EXISTS (
            SELECT 1 FROM book_files AS t4
            WHERE t1.id = t4.book_id
            AND t4.format_code = ANY($${params.length})
        )`);
    }

    if (users) {
        const list = Array.isArray(users) ? users : fousersrmats.split(',');
        params.push(list);
        conditions.push(`EXISTS (
            SELECT 1 FROM book_users AS t5
            WHERE t1.id = t5.book_id
              AND t5.user_id = ANY($${params.length})
        )`);
    }

    let query = "SELECT * FROM books AS t1";
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }


    let offset = (page - 1) * count
    params.push(count);
    params.push(offset);

    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    console.log(query)
    console.log(params)

    let result = await modGetBooksByCountAndPageWithFilters(query, params)

    console.log(result)

    response.status(200)
    response.set("Content-Type", "application/json")
    response.send(JSON.stringify({ answer: "true", info: result}))
}

export { uploadBook, uploadCover, getBooksByUser, getCoverBook, downloadBookById, getInfoBook, deleteBook,
    conGetAllBooksInPending, conGetFormatsOfBook, conGetFileOfBook, conApproveBook, conNotApproveBook,
    conGetIngoAboutRejectedBook, conGetBooksByCountAndPage, conGetAuthorOfBook, conGetBooksByCountAndPageWithFilters }