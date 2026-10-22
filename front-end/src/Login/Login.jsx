import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import style from "./Login.module.css"

import { useUser } from "../store/userStore.js"

function Login(){

    const login = useUser((state) => state.login)
    const navigate = useNavigate()

    const [nikname, setNikname] = useState("")
    const [password, setPassword] = useState("")

    const preLogin = async function(){
        
        let result = await login({password: password, username: nikname})
        
        // Если пользователь не вошёл то не перенаправляем
        if (!result){
            return
        }
        
        // Если пользователь вошёл то перенаправляем
        navigate("/user")
    }

    return(
        <>
        <div className={style.mainContainer}>
            <div className={style.containerInner}>
                    <h1>Авторизация</h1>
                    <div className={style.containerInputs}>
                        <label htmlFor="nikname">Никнейм:</label>
                        <input type="text" id="nikname" onChange={(event) => {setNikname(event.target.value)}}/>
                        <label htmlFor="password">Пароль:</label>
                        <input type="email" id="password" onChange={(event) => {setPassword(event.target.value)}}/>
                    </div>
                    <button className={style.button} onClick={() => {preLogin()}
                    }>Войти</button>
                    <Link to="/user/register" className={style.link}>Регистрация</Link>
            </div>
        </div>
        </>
    )
}

export default Login