import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import style from "./MainPageBookCard.module.css"

function MainPageBookCard(props){

    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        async function load(){
            let result = await fetch(`http://localhost:3000/api/books/getCoverBook/${props.book.id}`)
            let blob = await result.blob()
            let url = URL.createObjectURL(blob)
            setUrl(url)
        }
        load()
    }, [props?.book.id])

    return(
        <Link to={`/book/${props.book.id}`} className={style.cardLink}>
            <div className={style.mainContainer}
                style={
                url
                    ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.1)), url(${url})`,
                    }
                    : undefined
                }>
                <ul className={style.listInfo}>
                    <li>{props.book.title}</li>
                </ul>
            </div>
        </Link>
    )
}

export default MainPageBookCard