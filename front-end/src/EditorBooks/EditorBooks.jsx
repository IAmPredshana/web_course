import { useState, useEffect } from "react"

import style from "./EditorBooks.module.css"
import { useUser } from "../store/userStore.js"
import EditorInfoAboutBook from "../EditorInfoAboutBook/EditorInfoAboutBook.jsx"
import EditorBookListItem from "../EditorBookListItem/EditorBookListItem.jsx"

function EditorBooks(){

    const [books, setBooks] = useState([])
    const [currentBook, setCurrentBook] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [filters, setFilters] = useState({})
    const [title, setTitle] = useState("")

    const token = useUser((state) => state.token)

    useEffect(() => {
        async function load(){
            setLoading(true)
            let resultGetAllBookInPending = await fetch("http://localhost:3000/api/books/getAllBookInPending", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                }
            })

            resultGetAllBookInPending = await resultGetAllBookInPending.json()


            if (resultGetAllBookInPending.answer === "false"){
                setError(resultGetAllBookInPending.info)
                setLoading(false)
                return
            }

            setBooks(resultGetAllBookInPending.info)
            setLoading(false)
        }
        load()
    }, [])

    function changedTitle(event){
        if (event.target.value === ""){
            delete filters.title
        }
        setTitle(event.target.value)
        filters.title = title


    }

    function isFilterEmpty(){
        if (Object.keys(filters) == 0)
            return true
        else
            return false
    }

    function getFilteredBooks(){

    }   

    return(
        <>
            <div className={style.titleContainer}>
                <h1 className={style.title}>Управление заявками</h1>
            </div>
            <div className={style.mainContainer}>
                <div className={style.subContainerAllBooks}>
                    <div className={style.containerBooks}>
                        {/* {isFilterEmpty()
                        ? books.map((element) => <EditorBookListItem key={element.id} infoBook={element} setCurrentBook={setCurrentBook} isCurrent={currentBook.id == element.id ? true : false}/>)
                        : getFilteredBooks() } */}
                        
                        {books.map((element) => <EditorBookListItem key={element.id} infoBook={element} setCurrentBook={setCurrentBook} isCurrent={currentBook.id == element.id ? true : false}/>)}
                    </div>
                    <div className={style.containerBookFilters}>
                        <label htmlFor="">Название:</label>
                        <input type="text" value={title} onChange={(event) => {changedTitle(event)}} />
                    </div>
                </div>
                <div className={style.subContainerInfoBook}>
                    {Object.keys(currentBook).length !== 0 ? <EditorInfoAboutBook book={currentBook} setBooks={setBooks} books={books} setCurrentBook={setCurrentBook} /> : null}
                </div>
            </div>
            {error ? <div className={style.containerError}>Ошибка: {error}</div> : null}
            {loading ? <div className={style.containerLoading}>Загрузка...</div> : null}

        </>
    )
}

export default EditorBooks