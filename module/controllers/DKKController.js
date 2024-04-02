
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
  
  const DKK = require('../model/DKK')
  
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
      const { namaKegiatan,  kategori  } = req.body
  
      const imageName = `${Date.now()}_${originalname}`
      
      const params = {
        Bucket: 'image-storage-diskominfo',
        Key: imageName,
        Body: buffer,
        ContentType: mimetype
      }
  
      const upload = await s3Client.send(new PutObjectCommand(params))
      console.log(upload)
      const dpa = new DKK({
        namaKegiatan,
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
  
  const updateDKK = async (req, res) => {
    try {
     
      const { originalname, buffer, mimetype } = req.file
      const { namaKegiatan, kategori } = req.body
  
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
  
      const updatedDKK = new DKK({
        judul: imageNameWithoutMimetype,
        
        fileUrl: imageUrl,
        kategori: kategori
      })
  
      const result = await DKK.findByIdAndUpdate(req.params.id, updatedDKK)
  
      try {
        console.log(result)
        res.status(200).json({ message: 'DKK updated successfully' })
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
      }
  
      res.status(200).json({ message: 'DKK updated successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  const deleteDKK = async (req, res) => {
    let response = null
    try {
      // const dpa = await DKK.findById(req.params.id)
      // const deleteObjectParams = {
      //   Bucket: 'image-storage-diskominfo',
      //   Key: dpa.fileUrl
      // }
      // const command = new DeleteObjectCommand(deleteObjectParams)
      // await s3Client.send(command)
      await DKK.findByIdAndDelete(req.params.id)
      response = new Response.Success(false, 'DKK deleted successfully')
      res.status(200).json({ message: 'DKK deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  const getAllDKK = async (req, res) => {
    let response = null
    try {
      const dpa = await DKK.find()
      for (const judul of dpa) {
        const getObjectParams = {
          Bucket: 'image-storage-diskominfo',
          Key: judul.fileUrl
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
        judul.fileUrl = url
      }
      response = new Response.Success(false, 'DKK retrieved successfully', dpa)
      res.status(httpStatus.OK).json(response)
    } catch (error) {
      response = new Response.Error(true, error.message)
      res.status(httpStatus.BAD_REQUEST).json(response)
    }
  }
  
  
  module.exports = {
    updateDKK,
    deleteDKK,
    getAllDKK,
    upload: upload.single('file'),
    uploadFile
  }
  