import { useNavigate } from "react-router-dom"

import style from "./Logout.module.css"

import { useUser } from "../store/userStore.js"

function Logout(){

    const logout = useUser((state) => state.logout)
    
    const navigate = useNavigate()

    return(
        <>
        <div className={style.mainContainer}>
            <div className={style.innerContainer}>
                <h1>Выход</h1>
                <button
                className={style.button}
                onClick={() =>{ 
                    logout()
                    navigate("/main")
                }}
                >Выйти</button>
            </div>
        </div>
        </>
    )
}

export default Logout