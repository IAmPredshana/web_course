import { db } from "../db.js"

import path from "node:path"
import { bookRoutes } from "../routes/books.js"

async function addNewBook(title, pathBook, userId, fileExtension, fileSize, description){

    // Надо проверку на то что это первое добавление книги или повторное (то есть добавление нового расширения у книги)
    let result = await db.query("SELECT * FROM books WHERE title = $1", [title])

    // Если информация об этой книге уже есть, то просто добавляем путь до файла с еще одним расширением
    if (!(result.rows.length === 0))
    {
        let bookId = result.rows[0].id
        result = await db.query("INSERT INTO book_files (book_id, format_code, file_url, size_bytes) VALUES ($1, $2, $3, $4)", [bookId, fileExtension, pathBook, fileSize])
        let tempAnswer = {
            "answer": "true",
            "info": "Book add to db!",
            "bookId": bookId
        }
        return tempAnswer
    }

    // Добавление записи в books
    result = await db.query("INSERT INTO books (title, cover_url, description) VALUES ($1, $2, $3) RETURNING id", [title, userId, description])
    
    if (result.rows.length === 0){
        let tempObjErr = {
            "answer" : "false",
            "info": "Error add book to database!"
        }
        return tempObjErr
    }

    let bookId = result.rows[0].id

    const newResult = await db.query("INSERT INTO book_authors (book_id, user_id) VALUES ($1, $2) RETURNING book_id", [bookId, userId])
    
    if (newResult.rows.length === 0){
        let tempObjErr = {
            "answer" : "false",
            "info": "Error add book_user to database!"
        }
        return tempObjErr
    }

    result = await db.query("INSERT INTO book_files (book_id, format_code, file_url, size_bytes) VALUES ($1, $2, $3, $4)", [bookId, fileExtension, pathBook, fileSize])
    let tempAnswer = {
        "answer": "true",
        "info": "Book add to db!",
        "bookId": newResult.rows[0].book_id
    }

    return tempAnswer
}  

async function addCoverByBook(bookId, pathCover){
    let result = await db.query("UPDATE books SET cover_url = $1 WHERE id = $2", [pathCover, bookId])
    if (result.rows.length === 0){
        let tempObjErr = {
            "answer" : "false",
            "info": "Error update books in database (cover) !"
        }
        return tempObjErr
    }

    let tempAnswer = {
        "answer": "true",
        "info": "Book update io db (cover) !"
    }

    return tempAnswer

}

async function getBooksByUserId(userId){
    try {
        const result = await db.query("SELECT b.id, b.title, b.status FROM books AS b JOIN book_authors AS ba ON ba.book_id = b.id WHERE ba.user_id = $1;", [userId])
        if (result.rows.length === 0){
            let tempObjErr = {
                "answer": "false",
                "info": "У вас нет книг!"
            }
            return tempObjErr
        }
        let tempObj = {
            "answer": "true",
            "info": result.rows
        }
        return tempObj
    } catch (error)
    {
        let tempObjErr = {
            "answer": "false",
            "info": "Error get user books!"
        }
        return tempObjErr
    }
}  

async function getInfoBookById(bookId){
    try {
        const result = await db.query("SELECT * FROM books  WHERE id = $1;", [bookId])
        if (result.rows.length === 0){
            let tempObjErr = {
                "answer": "false",
                "info": "Error get info books (sql)!"
            }
            return tempObjErr
        }
        let tempObj = {
            "answer": "true",
            "info": result.rows
        }
        return tempObj
    } catch (error)
    {
        let tempObjErr = {
            "answer": "false",
            "info": "Error get info books!, " + error
        }
        return tempObjErr
    }
}

async function deleteBookById(bookId){
    try {
        const result = await db.query("DELETE FROM books WHERE id = $1", [bookId])
        let tempObj = {
            "asnwer": "true",
            "info": "Book deleted"
        }
        return tempObj
    } catch (error)
    {
        let tempObjErr = {
            "answer": "false",
            "info": "Error get info books!"
        }
        return tempObjErr
    }

}

async function modGetAllBooksInPending(){
    try {
        const result = await db.query("SELECT * FROM books WHERE status = $1", ["проверка"])
        if (result.rows === 0){
            let tempObj = {
                "asnwer": "true",
                "info": "Data base has not got books in prending!"
            }
            return tempObj
        }
        let tempObj = {
            "asnwer": "true",
            "info": result.rows
        }
        return tempObj
    } catch (error)
    {
        let tempObjErr = {
            "answer": "false",
            "info": "Error get all books in pending from database!"
        }
        return tempObjErr
    }

}


async function modGetFormatsOfBook(bookId){
    try {
        let result = await db.query("SELECT * FROM book_files where book_id = $1", [bookId])
        if (result.rows.length === 0){
            return {
                answer: "false",
                info: "error in sql"
            }
        }

        let newArr = [...result.rows]

        newArr.forEach((element) => {
            element.file_url = path.basename(element.file_url)
        })

        return {
            answer: "true",
            info: newArr
        }

    } catch (error){

        return {
            answer: "false",
            info: "error in model"
        }

    }
}

async function modApproveBook(bookId){
    try {
        let result = await db.query("UPDATE books SET status = 'одобрено' WHERE id = $1", [bookId])
        return {answer: "true", info: "status of book changed"}
    } catch (error) {
        return {answer: "false", info: "error in model approve book"}
    }
}

async function modNotApproveBook(bookId, message){
    try {
        let result = await db.query("UPDATE books SET status = 'не одобрено' WHERE id = $1", [bookId])
        result = await db.query("INSERT INTO rejected_books (book_id, message) VALUES ($1, $2)", [bookId, message])
        return {answer: "true", info: "status of book changed"}
    } catch (error) {
        return {answer: "false", info: "error in model approve book"}
    }
}

async function modGetIngoAboutRejectedBook(bookId){
    try{
        let result = await db.query("SELECT message FROM rejected_books WHERE book_id = $1", [bookId])
        if (result.rows.length !== 1){
            return {answer: "false", info: "error in sql"}
        }
        console.log(result)
        return {answer: "true", info: result.rows[0].message}
    } catch(error){
        return {answer: "false", info: "error in db"}
    }
}

async function modGetBooksByCountAndPage(count, page){
    let offset = (page - 1) * count
    try{
        let result = await db.query("SELECT * FROM books WHERE status = 'одобрено' LIMIT $1 OFFSET $2", [count, offset])
        return {answers: "true", info: result.rows}
    } catch(error){
        return {answer: "false", info: "error in db"}
    }
}

async function modGetAuthorOfBook(id){
    try{
        let result = await db.query("SELECT * FROM book_authors WHERE book_id = $1", [id])
        return {answer: "true", info: result.rows}
    } catch(error){
        return {answer: "false", info: "error in db"}
    }
}

async function modGetBooksByCountAndPageWithFilters(query, params){
    let result = await db.query(query, params)
    return result.rows
}

export { addNewBook, addCoverByBook, getBooksByUserId, getInfoBookById, deleteBookById, modGetAllBooksInPending,
    modGetFormatsOfBook, modApproveBook, modNotApproveBook, modGetIngoAboutRejectedBook, modGetBooksByCountAndPage,
    modGetAuthorOfBook, modGetBooksByCountAndPageWithFilters }