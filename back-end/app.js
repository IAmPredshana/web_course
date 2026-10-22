import express from "express"
import cors from "cors"

import { userRoutes } from "./routes/users.js"
import { bookRoutes } from "./routes/books.js"

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};


const app = express()
const PORT = 3000

app.use(cors(corsOptions))

app.use(express.json()) // Парсит JSON и кладёт информацию в объект запроса

app.use("/api/users", userRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT)