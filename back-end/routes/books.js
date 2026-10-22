import express from "express"

import { uploadBook, uploadCover, getBooksByUser, getCoverBook, downloadBookById, getInfoBook, deleteBook,
    conGetAllBooksInPending, conGetFormatsOfBook, conGetFileOfBook, conApproveBook, conNotApproveBook,
    conGetIngoAboutRejectedBook, conGetBooksByCountAndPage, conGetAuthorOfBook, conGetBooksByCountAndPageWithFilters } from "../controllers/books.js"
import { auth, requireRole, requireRoles } from "../middlewares/middlewarejqt.js"

const router = express.Router()

router.post("/getAll", (request, response) => {
    response.send("Get all books!")
})

router.post("/uploadBook", auth, uploadBook)
router.post("/uploadCover", auth, uploadCover)
router.post("/deleteBook/:id", auth, deleteBook)
router.post("/approveBook/:id", auth, requireRoles(["admin", "editor"]), conApproveBook)
router.post("/notApproveBook/:id", auth, requireRoles(["admin", "editor"]), conNotApproveBook)
router.get("/getBooksByUser/:id", auth, getBooksByUser)
// router.get("/getCoverBook/:id", auth, getCoverBook)
router.get("/getCoverBook/:id", getCoverBook)
router.get("/downloadBookById/:id", auth, downloadBookById)
router.get("/getInfoBook/:id", getInfoBook)
router.get("/getAllBookInPending", auth, requireRoles(["admin", "editor"]), conGetAllBooksInPending)
// router.get("/getFormatsOfBook/:id", auth, conGetFormatsOfBook)
router.get("/getFormatsOfBook/:id", conGetFormatsOfBook)
// router.get("/getFileOfBook/:path", auth, conGetFileOfBook)
router.get("/getFileOfBook/:path", conGetFileOfBook)
router.get("/getIngoAboutRejectedBook/:id", auth, conGetIngoAboutRejectedBook)
router.get("/getBooksByCountAndPage", conGetBooksByCountAndPage)
router.get("/getBooksByCountAndPageWithFilters", conGetBooksByCountAndPageWithFilters)
router.get("/getAuthorOfBook/:id", conGetAuthorOfBook )

export { router as bookRoutes }