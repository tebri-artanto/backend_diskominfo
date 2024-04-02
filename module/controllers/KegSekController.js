// Import necessary modules

// const { validateKegSek } = require('../validators');
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

const sharp = require('sharp')
const KegSek = require('../model/KegSek')
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

const addData = async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file
    const { namaKegiatan, tanggal, deskripsi } = req.body

    const imageName = `${Date.now()}_${originalname}`
    console.log(imageName)
    const params = {
      Bucket: 'image-storage-diskominfo',
      Key: imageName,
      Body: buffer,
      ContentType: mimetype
    }

    const upload = await s3Client.send(new PutObjectCommand(params))
    console.log(upload)
    const kegsek = new KegSek({
      namaKegiatan,
      tanggal,
      fileUrl: imageName,
      deskripsi: deskripsi
    })
    const result = await kegsek.save()

    console.log(result)
    res.status(200).json({ message: 'Image uploaded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for updating namaKegiatan
const updateKegSek = (req, res) => {
  // Validate request body
  const { error } = validateKegSek(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  // Extract data from request body
  const { namaKegiatan, date, imageUrl, deskripsi } = req.body

  // Create an updated namaKegiatan object
  const updatedKegSek = {
    namaKegiatan,
    date,
    imageUrl,
    deskripsi
  }

  // Update the namaKegiatan in the database
  db.update(req.params.id, updatedKegSek)
    .then(() => {
      res.status(200).json({ message: 'KegSek updated successfully' })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

// Controller for deleting namaKegiatan
const deleteKegSek = async (req, res) => {
  let response = null
  try {
    // const kegsek = await KegSek.findById(req.params.id)
    // const deleteObjectParams = {
    //   Bucket: 'image-storage-diskominfo',
    //   Key: kegsek.fileUrl
    // }
    // const command = new DeleteObjectCommand(deleteObjectParams)
    // await s3Client.send(command)
    await KegSek.findByIdAndDelete(req.params.id)
    response = new Response.Success(false, 'KegSek deleted successfully')
    res.status(200).json({ message: 'KegSek deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for getting all ks

const getAllKegSek = async (req, res) => {
  let response = null
  try {
    const ks = await KegSek.find()
    for (const namaKegiatan of ks) {
      const getObjectParams = {
        Bucket: 'image-storage-diskominfo',
        Key: namaKegiatan.fileUrl
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      namaKegiatan.fileUrl = url
    }
    response = new Response.Success(false, 'KegSek retrieved successfully', ks)
    res.status(httpStatus.OK).json(response)
  } catch (error) {
    response = new Response.Error(true, error.message)
    res.status(httpStatus.BAD_REQUEST).json(response)
  }
}

// Controller for getting a single namaKegiatan
const getKegSek = (req, res) => {
  // Get the namaKegiatan from the database
  db.get(req.params.id)
    .then(namaKegiatan => {
      if (!namaKegiatan) {
        return res.status(404).json({ error: 'KegSek not found' })
      }
      res.status(200).json(namaKegiatan)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

module.exports = {
  updateKegSek,
  deleteKegSek,
  getAllKegSek,
  getKegSek,
  upload: upload.single('file'),
  addData
}
