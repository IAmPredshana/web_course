import { Outlet, Link } from "react-router-dom"

import style from "./Editor.module.css"

function Editor(){
    return(
        <>
            <h1>Editor layout</h1>
            <div>
                <Link className={style.link} to="books">Управление заявками на публикацию</Link>
            </div>
            <Outlet />
        </>
    )
}

export default Editor