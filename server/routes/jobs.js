const express = require("express")
const router = express.Router()
const jobHandler = require("../data/job/job")

router.get("/", async (req, res) => {
  try {
    const jobs = jobHandler.getAllJobs()
    res.setHeader("Content-Type", "application/json")
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ error: "服务器内部错误，无法获取任务数据" })
  }
})

router.post("/", (req, res) => {
  const newJob = req.body
  const createdJob = jobHandler.createJob(newJob)
  res.status(201).json(createdJob)
})

router.put("/:id", (req, res) => {
  const jobId = req.params.id
  const updatedData = req.body
  const updatedJob = jobHandler.updateJob(jobId, updatedData)
  if (updatedJob) {
    res.json(updatedJob)
  } else {
    res.status(404).json({ error: "任务未找到" })
  }
})

module.exports = router