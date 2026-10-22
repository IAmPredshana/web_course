import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import style from "./Profile.module.css" 
import ProfileListItem from "../ProfileListItem/ProfileListItem.jsx"
import ProfileListItemInput from "../ProfileListItemInput/ProfileListItemInput.jsx"
import { useUser } from "../store/userStore.js"


function Profile(){

    const isLogin = useUser((state) => state.isLogin)
    const userInfo = useUser((state) => state.userInfo)
    const token = useUser((state) => state.token)
    
    const [data, setData] = useState({})
    const [changeInformation, setChangeInformation] = useState(false)
    const [imageURL, setImageURL] = useState("")
    
    const elementNewUserName = useRef(undefined)
    const elementNewOtherInformation = useRef(undefined)
    const imageUser = useRef(undefined)


    useEffect(() => {
        async function load(){
        // Получение информации о пользователе
        let result = await fetch(`http://localhost:3000/api/users/${userInfo.id}`)
        result = await result.json()
        setData(result.info)
        
        // Получение картинки
        result = await fetch(`http://localhost:3000/api/users/getImageUser/${userInfo.id}`)
        let blob = await result.blob()
        let url = URL.createObjectURL(blob)
        setImageURL(url)
    }

    load()
    }, [isLogin, userInfo?.id]) // !!!!!???

    async function saveNewInfo(){
        // Правильно !?
        let oldInforUser = {...data}
        let newInfoUser = {...data,
            username: elementNewUserName.current.value,
            other_information: elementNewOtherInformation.current.value
        }

        let result = await fetch("http://localhost:3000/api/users/updateInfoUser", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "oldInfoUser": oldInforUser,
                "newInfoUser": newInfoUser
            })
        })
        result = await result.json()
        
        if (result.answer === "false"){
            return
        }

        setData(newInfoUser)
        setChangeInformation(false)

    }

    async function uploadImage() {
        // console.log(imageUser.current.files[0])


        let result = await fetch("http://localhost:3000/api/users/uploadImageUser", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "X-Filename": userInfo.id + "." + imageUser.current.files[0].name.split(".")[1]
                // "X-Filename": userInfo.id + "." + imageUser.current.files[0].type.split("/")[1]
            
            },
            body: imageUser.current.files[0]
        })

        if (result.answer === "false"){
            console.log("error")
            return
        }

        // Получение картинки
        result = await fetch(`http://localhost:3000/api/users/getImageUser/${userInfo.id}`)
        let blob = await result.blob()
        let url = URL.createObjectURL(blob)
        setImageURL(url)

    }

    if (!isLogin){
        return(<>
            <h1>Войдите в аккаунт!</h1>
        </>)
    }

    return(
        <>
        <div className={style.mainContainer}>
            {/* <h1>Профиль</h1> */}
            <div className={style.containerProfileInfoAndActions}>
                <div className={style.cantainerActions}>
                    {/* <h2>Управление</h2> */}
                    <Link className={style.button} to="/user/managementBooks">Управление кнгами</Link>
                    {userInfo.role === "admin" ? <><Link className={style.button} to="/user/admin">Админ панель</Link><Link className={style.button} to="/user/editor">Заявки книг на публикацию</Link></> : null}
                    {userInfo.role === "editor" ? <><Link className={style.button} to="/user/editor">Заявки книг на публикацию</Link></> : null}
                    <Link className={style.button} to="/user/logout">Выход из аккаунта</Link>
                </div>
                <div className={style.containerInfo}>
                    {/* <h2>Информация об аккаунте</h2> */}
                    <div className={style.containerInfoUsers}>
                        <h3>Приватная информация</h3>
                        <ul className={style.listItems}>
                            <ProfileListItem title="Роль:" value={userInfo.role}/>
                            {data ? <>
                            <ProfileListItem title="Почта:" value={data.email}/>
                            </> : null}
                        </ul>
                        <h3>Публичная информация</h3>
                        
                        {/* нужно чтобы при нажати конопик выводились поля для изменения данных */}
                        <ul className={style.listItems}>
                            {data && !changeInformation ? <>
                            <ProfileListItem title="Имя пользователя:" value={data.username}/>
                            </> : <ProfileListItemInput value={data.username} title="Имя пользователя:" tempRef={elementNewUserName}/>}
                            {/* data.other_information &&  */}
                            {!changeInformation ? <>
                            <ProfileListItem title="Дополнительная информация:" value={data.other_information ? data.other_information : "Нет информации"}/>
                            </> : <ProfileListItemInput value={data.other_information} title="Дополнительная информация:" tempRef={elementNewOtherInformation}/>}
                        </ul>
                        <div className={style.containerButtons}>
                            {changeInformation ? 
                                <div>
                                    <button className={style.button} onClick={() => {
                                            setChangeInformation(false)
                                        }}>Отменить</button>
                                    <button className={style.button} onClick={async () => { 
                                            await saveNewInfo()
                                            setChangeInformation(false)
                                        }}>Сахранить</button>
                                </div>
                            :
                                <button className={style.button} onClick={() => { setChangeInformation(true)}}>Изменить</button>
                            }
                            
                        </div>
                    </div>
                    <div className={style.containerImageUser}>
                            {imageURL ? <img src={imageURL} className={style.image} /> : null}
            
                            <input 
                                type="file"
                                onChange={() => { uploadImage() }}
                                ref={imageUser}
                                // className={style.inputImage}
                                id="inputImage"
                                hidden
                            />
                            <label for="inputImage" class={style.inputImage}>
                                Загрузить картинку
                            </label>
                                
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Profile