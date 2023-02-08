const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getDbAs, getDbAById, addDbA, updateDbA, removeDbA, runUpdateWorker,stopUpdateWorkerB,startWorker } = require('./dbB.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', stopUpdateWorkerB)
router.get('/:id', getDbAById)
router.post('/', startWorker)
router.put('/:id', stopUpdateWorkerB)
router.delete('/:id', removeDbA)
// router.post('/', requireAuth, addDbA)
// router.put('/:id', requireAuth, updateDbA)
// router.delete('/:id', requireAuth, removeDbA)
// router.delete('/:id', requireAuth, requireAdmin, removeDbA)

module.exports = router