const db = require('../model/DPA')
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const multer = require('multer')
const Response = require('../model/Response')
const httpStatus = require('http-status')

const DPA = require('../model/DPA')

const s3Client = new S3Client({
  credentials: {
    accessKeyId: 'AKIA2UC3FURGLRPFIXW6',
    secretAccessKey: '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'
  },
  region: 'ap-southeast-1'
})

const upload = multer({
  storage: multer.memoryStorage({})
})

const uploadFile = async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file
    const { deskripsi, kategori } = req.body

    const imageName = `${Date.now()}_${originalname}`
    const imageNameWithoutMimetype = originalname
      .split('.')
      .slice(0, -1)
      .join('.')

    const params = {
      Bucket: 'image-storage-diskominfo',
      Key: imageName,
      Body: buffer,
      ContentType: mimetype
    }

    const upload = await s3Client.send(new PutObjectCommand(params))
    console.log(upload)
    const dpa = new DPA({
      judul: imageNameWithoutMimetype,
      deskripsi,
      fileUrl: imageName,
      kategori: kategori
    })
    const result = await dpa.save()

    console.log(result)
    res.status(200).json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateDPA = async (req, res) => {
  try {
   
    const { originalname, buffer, mimetype } = req.file
    const { deskripsi, kategori } = req.body

    const imageName = `${Date.now()}_${originalname}`
    const imageNameWithoutMimetype = originalname
      .split('.')
      .slice(0, -1)
      .join('.')

    const params = {
      Bucket: 'image-storage-diskominfo',
      Key: imageName,
      Body: buffer,
      ContentType: mimetype
    }

    const upload = await s3Client.send(new PutObjectCommand(params))
    console.log(upload)

    const updatedDPA = new DPA({
      judul: imageNameWithoutMimetype,
      deskripsi,
      fileUrl: imageUrl,
      kategori: kategori
    })

    const result = await DPA.findByIdAndUpdate(req.params.id, updatedDPA)

    try {
      console.log(result)
      res.status(200).json({ message: 'DPA updated successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }

    res.status(200).json({ message: 'DPA updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for deleting judul
const deleteDPA = async (req, res) => {
  let response = null
  console.log(req.params.id)
  try {
    const dpa = await DPA.findById(req.params.id)
    console.log(dpa.fileUrl)
    // const deleteObjectParams = {
    //   Bucket: 'image-storage-diskominfo',
    //   Key: dpa.fileUrl
    // }
    // console.log(deleteObjectParams)
    // const command = new DeleteObjectCommand(deleteObjectParams)
    // await s3Client.send(command)
    await DPA.findByIdAndDelete(req.params.id)
    response = new Response.Success(false, 'DPA deleted successfully')
    res.status(200).json({ message: 'DPA deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for getting all DPA

const getAllDPA = async (req, res) => {
  let response = null
  try {
    const dpa = await DPA.find()
    for (const judul of dpa) {
      const getObjectParams = {
        Bucket: 'image-storage-diskominfo',
        Key: judul.fileUrl
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      judul.fileUrl = url
    }
    response = new Response.Success(false, 'DPA retrieved successfully', dpa)
    res.status(httpStatus.OK).json(response)
  } catch (error) {
    response = new Response.Error(true, error.message)
    res.status(httpStatus.BAD_REQUEST).json(response)
  }
}

// Controller for getting a single judul
const getDPA = (req, res) => {
  // Get the judul from the database
  db.get(req.params.id)
    .then(judul => {
      if (!judul) {
        return res.status(404).json({ error: 'DPA not found' })
      }
      res.status(200).json(judul)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

module.exports = {
  updateDPA,
  deleteDPA,
  getAllDPA,
  getDPA,
  upload: upload.single('file'),
  uploadFile
}
