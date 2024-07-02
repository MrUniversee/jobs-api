const jobSchema = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors')
const getAllJobs = async (req, res) => {
  const job = await jobSchema
    .find({ createdBy: req.user.userID })
    .sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs: job, nbHits: job.length })
}
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID
  const job = await jobSchema.create({ ...req.body })
  res.status(200).json({ job })
}
const getSingleJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
  } = req
  const job = await jobSchema.findOne({ _id: jobID, createdBy: userID })
  if (!job) {
    throw new NotFoundError(`could not find job with id ${jobID} `)
  }
  res.status(StatusCodes.OK).json({ job })
}
const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
    body: { company, position },
  } = req

  if (!company || !position) {
    throw new BadRequestError('company or position cannot be empty')
  }
  const job = await jobSchema.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`could not find job with id ${jobID} `)
  }
  res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
  } = req
  console.log(jobID)
  const job = await jobSchema.findByIdAndDelete({
    _id: jobID,
    createdBy: userID,
  })
  if (!job) {
    throw new NotFoundError(`could not find job with id ${jobID} `)
  }
  res.status(StatusCodes.OK).json({ msg: 'Job deleted' })
}

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
}
