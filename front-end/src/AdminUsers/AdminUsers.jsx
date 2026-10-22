import { useEffect, useState } from "react"

import { useUser } from "../store/userStore.js"
import style from "./AdminUsers.module.css"
import AdminInfoAboutUser from "../AdminInfoAboutUser/AdminInfoAboutUser.jsx"
import AdminUserFilter from "../AdminUserFilter/AdminUserFilter.jsx"

function AdminUsers(){

    const [loading, setLoading] = useState("")
    const [error, setError] = useState("")
    const [stoneUsers, setStoneUsers] = useState([])
    const [users, setUsers] = useState([])

    const token = useUser((state) => state.token)

    useEffect(() => {
        async function load(){
            setLoading(true)
            let resultGetUsers = await fetch("http://localhost:3000/api/users/getAllUsers", {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })
            resultGetUsers = await resultGetUsers.json()
            
            if(resultGetUsers.answer === "false"){
                setError(resultGetUsers)
                setLoading(false)
            }

            setUsers(resultGetUsers.info)
            setStoneUsers(resultGetUsers.info)
            setLoading(false)
        }
        load()
    }, [])

    function deleteUserFromUsers(userId){
        // Проблема с тем что при фильтрации пользователей и удалении пользователя в отфильрованном списке в stoneUsers попадает отвильтроваыннй список пользователей
        let newUsers = users.filter((element) => element.id != userId)
        setUsers(newUsers)
        setStoneUsers(newUsers)
    }

    return(
        <>
            <div className={style.mainContainer}>
                <div className={style.subContainerUsers}>
                    <h2>Управление пользователями</h2>
                    <div>
                        <ul className={style.containerLegend}>
                            <li>id</li>
                            <li>email</li>
                            <li>username</li>
                            <li>role</li>
                        </ul>
                    </div>
                    <div className={style.containerUsers}>
                        {users.map((element) => <AdminInfoAboutUser key={element.id} userInfo={element} deleteUserFromUsers={deleteUserFromUsers} setUsers={setUsers}/>)}
                    </div>
                </div>
                <div className={style.subContainerFilters}>
                    <h2>Фильтры</h2>
                    <AdminUserFilter setUsers={setUsers} users={users} stoneUsers={stoneUsers} />
                </div>
                
            </div>
        </>
    )
}

export default AdminUsers