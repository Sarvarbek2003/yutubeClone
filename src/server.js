const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 4000
const app = express()

app.use('/data/proFiles/', express.static(path.join(__dirname, 'files', 'profilePhoto')) )
app.use('/data/files', express.static(path.join(__dirname, 'files')) )
app.use(fileUpload())
app.use(cors())

const modelMiddleware = require('./middlewares/model.js')


app.use(express.json())
app.use(modelMiddleware)

const userRouter = require('./routes/user.js')
const authRouter = require('./routes/auth.js')
const imageRouter = require('./routes/image.js')
const vidioRouter = require('./routes/vidio.js')

app.get('/download/data/files/:fileName', (req, res) => {
	res.download( path.join(__dirname, 'files', req.params.fileName) )
})

app.use('/auth', authRouter)
app.use('/images', imageRouter)
app.use('/users', userRouter)
app.use('/vidio', vidioRouter)


app.listen(PORT, () => console.log('server is running on http://localhost:' + PORT))