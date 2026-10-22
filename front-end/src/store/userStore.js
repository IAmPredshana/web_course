import { create } from "zustand"
import { parseJwt } from "../utils/jwtparser.js"

const useUser = create(
    (set) => ({
        isLogin: false,
        token: "",
        userInfo: {},
        login: async (userData) => {

            let result = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            result = await result.json()

            // Проверка того что вход выполнен
            console.log(result.answer)

            if (result.answer === "false"){
                return false
            }

            // Если вход выполнен, то меняем состояние
            set((state) => ({
                isLogin: true,
                token: result.token,
                userInfo: parseJwt(result.token)
            }))

            console.log(result)

            // Если вход выполнен, даём сигнал что перенаправляем
            return true

        },

        logout: () => set((state) => ({
            isLogin: false,
            userData: {},
        })),

        register: async (userDataObj) => {

            let result = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDataObj)
            })
            result = await result.json()

            console.log(result)
            
            if (result.answer === "false"){
                return false
            }

            // Если всё норм то меняем данные
            set((state) => ({
                isLogin: true,
                userData: {name: "Predshana"}
            }))

            return true
        }
        
    })
)

export { useUser }