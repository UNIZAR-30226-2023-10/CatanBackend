import cors from 'cors'
import path from 'path'
import morgan from 'morgan'

import db from './models/index.js'

import router from './routes/router.js'

var app = express()

app.disable('etag');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Logging middleware
morgan.token('body', (req, _res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body - :status'))

app.use('/api', router)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to the database')
    })
    .catch((err) => {
        console.log('Cannot connect to the database! \n', err)
        process.exit()
    })