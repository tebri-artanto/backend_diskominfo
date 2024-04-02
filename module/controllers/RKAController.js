const db = require('../model/RKA')
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

const RKA = require('../model/RKA')

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
    const rka = new RKA({
      judul: imageNameWithoutMimetype,
      deskripsi,
      fileUrl: imageName,
      kategori: kategori
    })
    const result = await rka.save()

    console.log(result)
    res.status(200).json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateRKA = async (req, res) => {
  try {
    // Validate request body
    // const { error } = validateRKA(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    // Extract data from request body
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

    const updatedRKA = new RKA({
      judul: imageNameWithoutMimetype,
      deskripsi,
      fileUrl: imageUrl,
      kategori: kategori
    })

    const result = await RKA.findByIdAndUpdate(req.params.id, updatedRKA)

    try {
      console.log(result)
      res.status(200).json({ message: 'RKA updated successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }

    res.status(200).json({ message: 'RKA updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for deleting judul
const deleteRKA = async (req, res) => {
  let response = null
  try {
    // const rka = await RKA.findById(req.params.id)
    // const deleteObjectParams = {
    //   Bucket: 'image-storage-diskominfo',
    //   Key: rka.fileUrl
    // }
    // const command = new DeleteObjectCommand(deleteObjectParams)
    // await s3Client.send(command)
    await RKA.findByIdAndDelete(req.params.id)
    response = new Response.Success(false, 'RKA deleted successfully')
    res.status(200).json({ message: 'RKA deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for getting all RKA

const getAllRKA = async (req, res) => {
  let response = null
  try {
    const rka = await RKA.find()
    for (const judul of rka) {
      const getObjectParams = {
        Bucket: 'image-storage-diskominfo',
        Key: judul.fileUrl
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      judul.fileUrl = url
    }
    response = new Response.Success(false, 'RKA retrieved successfully', rka)
    res.status(httpStatus.OK).json(response)
  } catch (error) {
    response = new Response.Error(true, error.message)
    res.status(httpStatus.BAD_REQUEST).json(response)
  }
}

// Controller for getting a single judul
const getRKA = (req, res) => {
  // Get the judul from the database
  db.get(req.params.id)
    .then(judul => {
      if (!judul) {
        return res.status(404).json({ error: 'RKA not found' })
      }
      res.status(200).json(judul)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

module.exports = {
  updateRKA,
  deleteRKA,
  getAllRKA,
  getRKA,
  upload: upload.single('file'),
  uploadFile
}
