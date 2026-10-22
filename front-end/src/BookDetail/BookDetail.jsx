import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"

import style from "./BookDetail.module.css"
import LinkDownloadBook from "../LinkDownloadBook/LinkDownloadBook"

function BookDetail(){
    
    const { id } = useParams()
    
    const [infoBook, setInfoBook] = useState("")
    const [urlCover, setUrlCover] = useState(undefined)
    const [infoAuthor, setInfoAuthor] = useState("")
    const [urlAvatar, setUrlAvatar] = useState(undefined)
    const [formatsOfBooks, setFormatsOfBook] = useState([])
    const [loading, setLoading] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const load = async () => {
            let response = await fetch(`http://localhost:3000/api/books/getInfoBook/${id}`)
            response = await response.json()
            setInfoBook(response)

            response = await fetch(`http://localhost:3000/api/books/getCoverBook/${id}`)
            let blob = await response.blob()
            let url = URL.createObjectURL(blob)
            setUrlCover(url)

            response = await fetch(`http://localhost:3000/api/books/getFormatsOfBook/${id}`)
            response = await response.json()
            setFormatsOfBook(response.info)

            response = await fetch(`http://localhost:3000/api/books/getAuthorOfBook/${id}`)
            let authorId = await response.json()
            authorId = authorId.info[0].user_id
            
            
            response = await fetch(`http://localhost:3000/api/users/${authorId}`)
            response = await response.json()
            setInfoAuthor(response.info)

            response = await fetch(`http://localhost:3000/api/users/getImageUser/${authorId}`)
            blob = await response.blob()
            url = URL.createObjectURL(blob)
            setUrlAvatar(url)
        }
        load()
    }, [])

    return(
        <div className={style.wallpaper}>
            <div className={style.containerMainTitle}>
                <h1 className={style.mainTitle}>{infoBook.title}</h1>
            </div>
            <div className={style.mainContainer}>
                <div className={style.containerMainInfo}>
                    <div className={style.containerInfo}>
                        <ul>
                            <li>{infoBook.title}</li>
                            <li>{infoBook.description}</li>
                            <li>
                                <div className={style.containerInfoAuthor}>
                                    <img src={urlAvatar} className={style.userAvatar} />
                                    <Link >{infoAuthor.username}</Link>
                                </div>
                            </li>
                            <li>
                                <div className={style.containerLinks}>
                                    {formatsOfBooks ? formatsOfBooks.map((element) => <LinkDownloadBook infoLink={element}/>) : null}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={style.containerCover} style={{ backgroundImage: `url(${urlCover})` }}>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDetail