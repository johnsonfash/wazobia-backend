import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import path from 'path'

const PORT = process.env.PORT ?? 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload());

app.use('/files', express.static(path.resolve('files')))
app.post('/upload', async (req, res) => {
  try {
    const files = req.files
    if (!files || Object.keys(files).length === 0) {
      return res.send({ status: false, message: 'No files were uploaded.' })
    }
    const imagePath = path.resolve('files')
    const image = files.file
    const imageName = `${Math.random().toString().substring(3)}${image.name}`
    const filePath = imagePath + '/' + imageName
    const imageUrl = `${process.env.APP_URL}/files/${imageName}`
    await image.mv(filePath)
    return res.send({ status: true, message: 'Ok', data: { url: imageUrl } })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})