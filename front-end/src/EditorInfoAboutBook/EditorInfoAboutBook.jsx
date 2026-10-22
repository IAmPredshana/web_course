import { useEffect, useState } from "react"

import LinkDownloadBook from "../LinkDownloadBook/LinkDownloadBook.jsx"
import style from "./EditorInfoAboutBook.module.css"
import { useUser } from "../store/userStore.js"

function EditorInfoAboutBook(props){

    const [urlCover, setUrlCover] = useState("")
    const [formatsOfBook, setFormatsOfBook] = useState([])
    const [message, setMessage] = useState("")
    const [isTextAreaActive, setIsTextAreaActive] = useState(false)

    const token = useUser((state) => state.token)

    useEffect(() => {
        async function load(){
            // Получение обложки книги
            let result = await fetch(`http://localhost:3000/api/books/getCoverBook/${props.book.id}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                }
            })

            let blob = await result.blob()
            let url = URL.createObjectURL(blob)
            setUrlCover(url)

            // Получение форматов книги
            result = await fetch(`http://localhost:3000/api/books/getFormatsOfBook/${props.book.id}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                }
            })

            result = await result.json()

            if (result.answer === "false"){
                console.log("ERROR! get formats of book")
                return
            }

            setFormatsOfBook(result.info)

        }
        load()
    }, [props.book?.id, token])

    async function approveBook(){
        let result = await fetch(`http://localhost:3000/api/books/approveBook/${props.book.id}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
            }
        })

        result = await result.json()

        if (result.answer === "false"){
            console.log(result.info)            
            return
        }

        let newArr = [...props.books]
        newArr = newArr.filter((element) => {
            if (element.id !== props.book.id)
                return element
        })
        props.setCurrentBook({})
        props.setBooks(newArr)
    }

    async function notApproveBook(){
        // При первом нажатии надо выводить форму для заполнения сообщения почему книга отклонена
        // Какгда редактор ввёл причину ему нужно снова нажать на кнопку повторно и тогда

        if (message === ""){
            setIsTextAreaActive(true)
            return
        } 

        let result = await fetch(`http://localhost:3000/api/books/notApproveBook/${props.book.id}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "X-Message": encodeURIComponent(message),
            }
        })

        result = await result.json()

        if (result.answer === "false"){
            console.log(result.info)            
            return
        }

        let newArr = [...props.books]
        newArr = newArr.filter((element) => {
            if (element.id !== props.book.id)
                return element
        })
        props.setCurrentBook({})
        props.setBooks(newArr) 
    }

    
    return(
        <>
        <div className={style.mainContainer}>
            <h1 className={style.title}>{props.book.title}</h1>
            <div className={style.subContainerInfoBook}>
                <div className={style.containerInfoBook}>
                    <ul className={style.list}>
                        <li className={style.item}>Создано: {props.book.created_at}</li>
                        <li className={style.item}>Описание: {props.book.description}</li>
                    </ul>
                </div>
                <div className={style.containerImageBook}>
                    {urlCover ? <img className={style.coverBook} src={urlCover} alt="" /> : null}
                </div>
            </div>
            <div className={style.subContainerLinksDownloads}>
                {formatsOfBook ?
                    formatsOfBook.map((element) => <LinkDownloadBook infoLink={element} />)
                : null}
                
            </div>
            { isTextAreaActive ? <textarea className={style.message} placeholder="Введите причину отклонения" onChange={(event) => { setMessage(event.target.value) }} name="" id=""></textarea> : null }
            <div className={style.subContainerButtons}>
                <button 
                    className={`${style.button} ${style.notApprove}`}
                    onClick={() => { notApproveBook() }}    
                >Отклонить</button>
                <button 
                    className={`${style.button} ${style.approve}`}
                    onClick={() => { approveBook() }}
                >Принять</button>
            </div>
        </div>
        </>
    )
}

export default EditorInfoAboutBook