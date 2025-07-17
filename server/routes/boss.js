const express = require("express")
const router = express.Router()
const bossHandler = require("../data/boss/interfaceBoss")

router.get("/", (req, res) => {
  try {
    const bosses = bossHandler.getAllBosses()
    res.setHeader("Content-Type", "application/json")
    res.status(200).json(bosses)
  } catch (error) {
    res.status(500).json({ error: "服务器内部错误" })
  }
})

router.post("/", (req, res) => {
  const newBoss = req.body
  const creatBoss = bossHandler.createBoss(newBoss)
  res.status(200).json(creatBoss)
})

router.put("/:id", (req, res) => {
  const id = req.params.id
  const data = req.body
  const updateBoss = bossHandler.updateBoss(id, data)
  res.status(200).json(updateBoss)
})

router.delete("/:id", (req, res) => {
  const id = req.params.id
  const removeBoss = bossHandler.removeBoss(id)
  res.status(200).json(removeBoss)
})

module.exports = router