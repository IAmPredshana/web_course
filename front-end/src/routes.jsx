import { createRoutesFromElements, createBrowserRouter, Route, Router } from "react-router-dom"

import App from "./App/App.jsx"
import HomePage from "./HomePage.jsx"
import SearchBookPage from "./SearchBookPage/SearchBookPage.jsx"
import MainPage from "./MainPage/MainPage.jsx"
import BookDetail from "./BookDetail/BookDetail.jsx"
import UserLayout from "./UserLayout.jsx"
import Profile from "./Profile/Profile.jsx"
import Login from "./Login/Login.jsx"
import Register from "./Register/Register.jsx"
import Logout from "./Logout/Logout.jsx"
import ManagementBooks from "./ManagementBooks/ManagementBooks.jsx"
import ProtectedRoute from "./ProtectedRouter.jsx"
import Admin from "./Admin/Admin.jsx"
import AdminUsers from "./AdminUsers/AdminUsers.jsx"
import AdminBooks from "./AdminBooks/AdminBooks.jsx"
import Editor from "./Editor/Editor.jsx"
import EditorBooks from "./EditorBooks/EditorBooks.jsx"

const rm = (
    <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="searchBook" element={<SearchBookPage />} />
        <Route path="book/:id" element={<BookDetail />} />
        <Route path="user" element={<UserLayout />}>
            <Route index element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
            <Route path="managementBooks" element={<ManagementBooks />} />
            <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
                <Route path="admin" element={<Admin />}>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="books" element={<AdminBooks />}/>
                </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["editor", "admin"]}/>}>
                <Route path="editor" element={<Editor />}>
                    <Route path="books" element={<EditorBooks />} />
                </Route>
            </Route>
        </Route>
    </Route>
)
const rs = createRoutesFromElements(rm)
const router = createBrowserRouter(rs)

export default router;