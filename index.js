import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieparser from "cookie-parser"
import path from 'path'
// Subscriber
import postRoutes from "./routes/postRoutes.js"
import commentsRoutes from './routes/commentRoutes.js'
import subscriberRoutes from "./routes/subscriberRoutes.js"
import donationRoutes from './routes/donationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
// Admin
import adminSubscribersRoutes from './routes/admin/subscriberRoutes.js'
import userRoutes from "./routes/userRoutes.js"
import adminPostsRoutes from './routes/admin/postRoutes.js'
import adminCommentRoutes from './routes/admin/commentRoutes.js'
import adminMessagesRoutes from './routes/admin/messageRoutes.js'
import { notFound, errorHandler } from "./middleware/errorMiddlware.js"
import { connectDB } from "./config/db.js"

const PORT = process.env.PORT || 5000
// Connect to DB
connectDB()

// App
const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieparser())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://kbnblog.onrender.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/subs', subscriberRoutes)
app.use('/api/donation', donationRoutes)
app.use('/api/messages', messageRoutes)
// Admin
app.use('/api/kbn/subscribers', adminSubscribersRoutes)
app.use('/api/kbn/posts', adminPostsRoutes)
app.use('/api/kbn/comments', adminCommentRoutes)
app.use('/api/kbn/messages', adminMessagesRoutes)

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve('../')
//   console.log(__dirname)
//   app.use(express.static(path.join(__dirname, '/client/dist')))
//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html')))
// } else {
// }
app.get('/', (req, res) => res.send("Hello There"))


app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log("Server is up and running on " + PORT))
