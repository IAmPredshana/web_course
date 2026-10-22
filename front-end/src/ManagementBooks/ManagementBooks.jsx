import { Link } from "react-router-dom"
import { useState, useRef, useEffect, use } from "react"

import { useUser } from "../store/userStore.js"
import InfoBookProfile from "../InfoBookProfile/InfoBookProfile.jsx"

import style from "./ManagementBooks.module.css"

function ManagementBooks(){

    const isLogin = useUser((state) => state.isLogin)
    const userInfo = useUser((state) => state.userInfo)
    const token = useUser((state) => state.token)

    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState("")
    const [error, setError] = useState("")
    const [loadingBooks, setLoadingBooks] = useState("")
    const [errorBooks, setErrorBook] = useState("")
    const [userBooks, setUserBooks] = useState([])
    const [description, setDescription] = useState("")

    useEffect( () => {
        
        setLoadingBooks(true)

        let getUserBooks = async () => {
            // Запрос на получение книг текущего пользователя
            let result = await fetch(`http://localhost:3000/api/books/getBooksByUser/${userInfo.id}`, {
                 method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
            })
    
            result = await result.json()

            if (result.answer === "false"){
                setLoadingBooks(false)
                setErrorBook(result.info)
                return
            }

            setUserBooks(result.info)
            setLoadingBooks(false)
            setErrorBook(false)
        }

        getUserBooks()
    }, [loading])
    
    const bookRef = useRef(undefined)
    const coverRef = useRef(undefined)


    if (!isLogin){
        return(<>
            <h1>Войдите в аккаунт!</h1>
        </>)
    }

    const sendBook = async function(){

        setLoading(true)

        // Запросы на загрузку книг
        let result
        for(let i = 0; i < bookRef.current.files.length; i++){
            let bookFile = bookRef.current.files[i]
            result = await fetch("http://localhost:3000/api/books/uploadBook", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-type": bookRef.current.files[i].type,
                    "X-filename": encodeURIComponent(title + "." + bookRef.current.files[i].name.split(".")[1]),
                    "X-Filesize": bookFile.size,
                    "X-Userid": userInfo.id,
                    "X-Description": encodeURIComponent(description),
                },
                body: bookFile
            })
            result = await result.json()
            console.log(result)
        }
        
        // Запрос на загрузку обложки книги
        const bookId = result.bookId
        const coverFile = coverRef.current.files[0]
        result = await fetch("http://localhost:3000/api/books/uploadCover",
            {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": bookRef.current.files[0].type,
                    "X-Filename": encodeURIComponent(title + "." + coverRef.current.files[0].name.split(".")[1]),
                    "X-Bookid": bookId,

                },
                body: coverFile
            }
        )    
        
        if (result.answer === " false"){
            setError(result.info)
            setLoading(false)
            return
        }

        setError(false)
        setLoading(false)
    }

    return(
        <>
        <div className={style.containerButtonBack}>
            <Link to=".." className={style.button}>Назад</Link>
        </div>
        <div className={style.mainContainer}>
            {/* <h1 className={style.mainTitle}>Управление книгами</h1> */}
            <div className={style.containerActions}>
                <div className={style.containerOrderBook}>
                    {error ? <><h2>{error}</h2></> : null}
                    {loading ? <><h2>Загрузка</h2></> : null}
                    {/* <h2>Создание заявки на публикацию книги</h2> */}
                    <label className={style.label} htmlFor="">Название:</label>
                    <input className={style.input} type="text" id="title" onChange={(event) => {setTitle(event.target.value)}}/>
                    <label className={style.label} htmlFor="filebook">Файл книги:</label>
                    <input type="file" ref={bookRef} id="filebook" multiple onChange={() => {console.log(bookRef.current.files)}}/>
                    <label className={style.label} htmlFor="filecover">Обложка:</label>
                    <input type="file" ref={coverRef} id="filecover" />
                    <label className={style.label} htmlFor="description">Описание: </label>
                    <textarea className={`${style.input} ${style.textArea}`} name="description" id="description" onChange={(event) => {setDescription(event.target.value)}}></textarea>
                    <button className={style.button} onClick={() => {sendBook()}}>Создать заявку</button>
                </div>
                <div className={style.containerMyBooks}>
                    {loadingBooks ? <><h2>Загрузка</h2></> : null}
                    {errorBooks ? <><h2>{errorBooks}</h2></> : null}
                    {/* <h2>Мои публикации книг</h2> */}
                    <div className={style.allBooks}>
                        {userBooks.map((element) => <InfoBookProfile info={element} setBooks={setUserBooks} key={element.title}/>)}
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default ManagementBooks