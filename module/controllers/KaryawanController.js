
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
  
  const Karyawan = require('../model/karyawan')
  
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
  
  const addKaryawan = async (req, res) => {
    try {
    //   const { originalname, buffer, mimetype } = req.file
      const { nama, nip  } = req.body
  
      const karyawan = new Karyawan({
        nama: nama,
        nip: nip,
      })
      const result = await karyawan.save()
  
      console.log(result)
      res.status(200).json({ message: 'File uploaded successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  const updateKaryawan = async (req, res) => {
    try {
     
      const { originalname, buffer, mimetype } = req.file
      const { kategori } = req.body
  
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
  
      const updatedKaryawan = new Karyawan({
        judul: imageNameWithoutMimetype,
        
        fileUrl: imageUrl,
        kategori: kategori
      })
  
      const result = await Karyawan.findByIdAndUpdate(req.params.id, updatedKaryawan)
  
      try {
        console.log(result)
        res.status(200).json({ message: 'Karyawan updated successfully' })
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
      }
  
      res.status(200).json({ message: 'Karyawan updated successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  const deleteKaryawan = async (req, res) => {
    let response = null
    try {
      const karyawan = await Karyawan.findById(req.params.id)
      const deleteObjectParams = {
        Bucket: 'image-storage-diskominfo',
        Key: karyawan.fileUrl
      }
      const command = new DeleteObjectCommand(deleteObjectParams)
      await s3Client.send(command)
      await Karyawan.findByIdAndDelete(req.params.id)
      response = new Response.Success(false, 'Karyawan deleted successfully')
      res.status(200).json({ message: 'Karyawan deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  const getAllKaryawan = async (req, res) => {
    let response = null
    try {
      const karyawan = await Karyawan.find()
      response = new Response.Success(false, 'Karyawan retrieved successfully', karyawan)
      res.status(httpStatus.OK).json(response)
    } catch (error) {
      response = new Response.Error(true, error.message)
      res.status(httpStatus.BAD_REQUEST).json(response)
    }
  }
  
  
  module.exports = {
    updateKaryawan,
    deleteKaryawan,
    getAllKaryawan,
    addKaryawan
  }
  