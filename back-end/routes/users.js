import express from "express"

import { register, login, getUserById, conGetAllUsers, conDeleteUserById, conChangeUserRole,
    conChangeInfoUser, conGetImageUser, conUploadImageUser, conGetAllUsernameOfUsers } from "../controllers/users.js"
import { auth, requireRole } from "../middlewares/middlewarejqt.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/deleteUserById/:id", auth, requireRole("admin"), conDeleteUserById)
router.post("/changeRoleUser", auth, requireRole("admin"), conChangeUserRole)
router.post("/updateInfoUser", auth, conChangeInfoUser)
router.post("/uploadImageUser", auth, conUploadImageUser)
router.get("/getAllUsers", auth, requireRole("admin"), conGetAllUsers)
router.get("/getAllUsernameOfUsers", conGetAllUsernameOfUsers)
router.get("/:id", getUserById)
router.get("/getImageUser/:id", conGetImageUser)

export { router as userRoutes }