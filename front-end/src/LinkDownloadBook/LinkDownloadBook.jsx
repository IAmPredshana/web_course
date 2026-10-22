import { useRef } from "react"

import style from "./LinkDownloadBook.module.css"

// import { useUser } from "../store/userStore.js"

function LinkDownloadBook(props){

    // const token = useUser((state) => state.token)

    const tempLink = useRef(undefined)

    async function downloadBook(){
        // console.log(props.infoLink)
        let result = await fetch(`http://localhost:3000/api/books/getFileOfBook/${props.infoLink.file_url}`, {
            method: "GET",
            // headers: {
            //     "Authorization": "Bearer " + token,
            // }
        })
        let blob = await result.blob()
        let url = URL.createObjectURL(blob)

        tempLink.current.href = url
        tempLink.current.download = props.infoLink.file_url
        tempLink.current.click()
    }

    return(
        <>
            <a className={style.link}
                href="#"
                onClick={() => { downloadBook() }}>Скачать книгу в формате {props.infoLink.format_code}</a>
            <a href="" ref={tempLink}></a>
        </>
            
    )
}

export default LinkDownloadBook
