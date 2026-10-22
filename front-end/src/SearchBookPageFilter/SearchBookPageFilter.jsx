import { useState } from "react"

import style from "./SearchBookPageFilter.module.css"

function SearchBookPageFilter(props){

    const [filters, setFilters] = useState(undefined)
    const [title, setTitle] = useState("")
    const [formats, setFormats] = useState([])
    const [users, setUser] = useState([])

    function toFilter(){
        let tempFilters = {}
        tempFilters.title = title
        tempFilters.formats = formats

        props.setFilters(tempFilters)
    }

    function rejectFilsters(){
        let tempFilters = {}
        tempFilters.title = ""
        tempFilters.formats = []
        setTitle("")
        setFormats([])

        props.setFilters(tempFilters)
    }

    function setFormatToFilter(format){
        let tempFormats = [...formats]
        if (tempFormats.includes(format)){
            const index = tempFormats.indexOf(format)
            tempFormats.splice(index, 1)
        } else tempFormats.push(format)
        setFormats(tempFormats)
    }


    return(
    <>
        <div className={style.mainContainer}>
            <h2>Фильтры</h2>
            <div className={style.containerFilterInfoBook}>
                {/* Фильтры по книге */}
                <div>
                    <h3>Информация о книге</h3>
                </div>
                <div>
                    <label htmlFor="">Название: </label>
                    <input type="text" onChange={(event) => { setTitle(event.target.value) }} value={title}/>
                    <div className={style.containerFilterInfoBookFormats}>
                        <h4>Форматы:</h4>
                        <div>
                            <label htmlFor="">pdf</label>
                            <input type="checkbox" value="pdf" onChange={(event) => { setFormatToFilter(event.target.value) }} />
                        </div>
                        <div>
                            <label htmlFor="">txt</label>
                            <input type="checkbox" value="txt" onChange={(event) => { setFormatToFilter(event.target.value) }} />
                        </div>
                        <div>
                            <label htmlFor="">epub</label>
                            <input type="checkbox" value="epub" onChange={(event) => { setFormatToFilter(event.target.value) }} />
                        </div>
                        <div>
                            <label htmlFor="">fb2</label>
                            <input type="checkbox" value="fb2" onChange={(event) => { setFormatToFilter(event.target.value) }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.containerFilterAuthors}>
                {/* Фильтры по пользователю */}
                <div>
                    <h3>Пользователи</h3>
                </div>
            </div>
            <div className={style.containerFilterGenres}>
                {/* Фильтры по жанрам */}
                <div>
                    <h3>Жанры</h3>
                </div>
            </div>
            <div className={style.containerFilterTags}>
                {/* Фильтры по тегам */}
                <div>
                    <h3>Теги</h3>
                </div>
            </div>
            <div>
                <button onClick={() => { toFilter() }}>Применить</button>
                <button onClick={() => { rejectFilsters() }} >Сбросить</button>
            </div>
        </div>
    </>
    )
}

export default SearchBookPageFilter