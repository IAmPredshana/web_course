import { useState, useEffect } from "react"

import style from "./EditorBookListItem.module.css"
import { useUser } from "../store/userStore.js"

function EditorBookListItem(props){

    const [imageURL, setImageURL] = useState("")

    const token = useUser((state) => state.token)

    useEffect(() => {
        async function loadImage(){
            let resultImage = await fetch(`http://localhost:3000/api/books/getCoverBook/${props.infoBook.id}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                }
            })

            let blob = await resultImage.blob()
            let url = URL.createObjectURL(blob)
            setImageURL(url)
        }
        loadImage()
    }, [])

    return(
        <>
            <div className={`${style.mainContainer} ${props.isCurrent ? style.isActive : null}`}
                onClick={() => { props.setCurrentBook(props.infoBook) }}>
                <div className={style.containerImage}
                    style={imageURL ? { backgroundImage: `url(${imageURL})` } : undefined}
                >
                    {/* {imageURL ? <img src={imageURL}  className={style.bookImage}/> : null} */}
                </div>
                <div className={style.containerInfo}>
                    <h3>{props.infoBook.title}</h3>
                </div>
            </div>
        </>
    )
}

export default EditorBookListItem