// Import necessary modules
const db = require('../model/activities')
// const { validateActivity } = require('../validators');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { raw } = require('body-parser')
const multer = require('multer')
const Response = require('../model/Response')
const httpStatus = require('http-status')
const User = require('../model/user')

const sharp = require('sharp')
const Activities = require('../model/activities')
const { v4: uuidv4 } = require('uuid')

const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

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

const uploadImage = async (req, res) => {
  const { originalname, buffer, mimetype } = req.file
  const { activity, date, owner } = req.body
  
  const compressedImage = await sharp(buffer)
    .resize({ width: 500, fit: 'contain' })
    .toBuffer()

  const generateRandomName = () => {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomName = ''
    for (let i = 0; i < 10; i++) {
      randomName += characters.charAt(
        Math.floor(Math.random() * characters.length)
      )
    }
    return randomName
  }
  const imageName = `${generateRandomName()}_${Date.now()}.${originalname
    .split('.')
    .pop()}`
  console.log(imageName)
    console.log(owner)
  const params = {
    Bucket: 'image-storage-diskominfo',
    Key: imageName,
    Body: compressedImage,
    ContentType: mimetype
  }

  const upload = await s3Client.send(new PutObjectCommand(params))
  console.log(upload)
  const activit = new Activities({
    activity,
    date,
    imgUrl: imageName,
    owner: owner,
  })
  const result = await activit.save()
  console.log(owner)

  console.log(result)
  const ownerTemp = await User.findById(owner)
  console.log(ownerTemp)
  ownerTemp.activities.push(result)
  await ownerTemp.save()


  try {
    console.log(result)
    res.status(200).json({ message: 'Image uploaded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateActivity = (req, res) => {
  // Validate request body
  const { error } = validateActivity(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  // Extract data from request body
  const { activity, date, imageUrl, owner } = req.body

  // Create an updated activity object
  const updatedActivity = {
    activity,
    date,
    imageUrl,
    owner
  }

  // Update the activity in the database
  db.update(req.params.id, updatedActivity)
    .then(() => {
      res.status(200).json({ message: 'Activity updated successfully' })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

// Controller for deleting activity
const deleteActivity = async (req, res) => {
  let response = null
  try {
    const activity = await Activities.findById(req.params.id)
    const deleteObjectParams = {
      Bucket: 'image-storage-diskominfo',
      Key: activity.imgUrl
    }
    const command = new DeleteObjectCommand(deleteObjectParams)
    await s3Client.send(command)
    await Activities.findByIdAndDelete(req.params.id)
    response = new Response.Success(false, 'Activity deleted successfully')
    res.status(200).json({ message: 'Activity deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Controller for getting all activities

const getAllActivities = async (req, res) => {
  let response = null
  try {
    const activities = await Activities.find()
    for (const activity of activities) {
      const getObjectParams = {
        Bucket: 'image-storage-diskominfo',
        Key: activity.imgUrl
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      activity.imgUrl = url
    }
    response = new Response.Success(
      false,
      'Activities retrieved successfully',
      activities
    )
    res.status(httpStatus.OK).json(response)
  } catch (error) {
    response = new Response.Error(true, error.message)
    res.status(httpStatus.BAD_REQUEST).json(response)
  }
}

// Controller for getting a single activity
const getActivity = (req, res) => {
  // Get the activity from the database
  db.get(req.params.id)
    .then(activity => {
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' })
      }
      res.status(200).json(activity)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' })
    })
}

module.exports = {
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivity,
  upload: upload.single('file'),
  uploadImage
}
