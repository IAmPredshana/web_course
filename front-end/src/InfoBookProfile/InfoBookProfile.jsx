import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useUser } from "../store/userStore.js"

import style from "./InfoBookProfile.module.css"

function InfoBookProfile(props){

    const token = useUser((state) => state.token)
    
    const [coverURL, setCoverURL] = useState("") 
    const [message, setMessage] = useState("")

    useEffect(() => {
        // Получение обложки книги
        let getCover = async() => {
            let result = await fetch(`http://localhost:3000/api/books/getCoverBook/${props.info.id}`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })

            const blob = await result.blob()
            const imageUrl = URL.createObjectURL(blob)
            setCoverURL(imageUrl)
        }
        getCover()

        // Получение сообщение об отмене книги если она отменена
        let getMessage = async function(){
            if (props.info.status === "не одобрено"){
                let result = await fetch(`http://localhost:3000/api/books/getIngoAboutRejectedBook/${props.info.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                })
                result = await result.json()
                if (result.answer === " false"){
                    console.log(result.info)
                    return
                }
                setMessage(result.info)
            }
        }
        getMessage()
    }, [])

    async function deleteBook(){
        let result = await fetch(`http://localhost:3000/api/books/deleteBook/${props.info.id}`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })
        
        result = await result.json()
        
        if (result.answer === "false"){
            return
        }

        props.setBooks((state) => state.filter((element) => element.id != props.info.id))
    }
    
    return(
    <>
    <div className={`${style.mainContainer} ${props.info.status === "проверка" ? style.mainContainerCheck : null} ${props.info.status === "одобрено" ? style.mainContainerApproved : null} ${props.info.status === "не одобрено" ? style.mainContainerNotApproved : null}`}>
        <h2>Книга: {props.info.title}</h2>
        <ul>
            <li>Статуc: {props.info.status}</li>
        </ul>
        <img className={style.image} src={coverURL ? coverURL : null} alt="" />
        {props.info.status === "одобрено" ? <Link to={`../../book/${props.info.id}`} className={style.button}>Открыть</Link> : null}
        {props.info.status === "одобрено" || props.info.status === "не одобрено" ? 
            <button className={style.button} onClick={() => {deleteBook()}}>
                Удалить
            </button>
             : null}
        
        {message ?
            <div className={style.messageContainer}>
                <h3>Причина отклонения: </h3>
                <p>{message}</p>
            </div>
        : null}

    </div>
    </>
    )
}

export default InfoBookProfile