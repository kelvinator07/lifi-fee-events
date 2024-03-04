import express, { Application, Request, Response } from 'express'
import Server from './src/index'
import { PORT } from './src/utils/constants'

const app: Application = express()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server: Server = new Server(app)

app.get('/', async (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Welcome api' })
})

app.listen(PORT, 'localhost', async () => {
    console.log(`Server is running on port ${PORT}.`)
}).on('error', (err: Error) => {
    if (err.name === 'EADDRINUSE') {
        console.log('Error: address already in use')
    } else {
        console.log(err)
    }
})
