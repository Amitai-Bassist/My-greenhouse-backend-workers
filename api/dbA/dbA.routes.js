const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getDbAs, getDbAById, startWorker, updateDbA, removeDbA, stopUpdateWorker,runUpdateWorker } = require('./dbA.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', stopUpdateWorker)
router.get('/:id', getDbAById)
router.post('/', startWorker)
router.put('/', stopUpdateWorker)
router.delete('/:id', removeDbA)
// router.post('/', requireAuth, addDbA)
// router.put('/:id', requireAuth, updateDbA)
// router.delete('/', stopUpdateWorker)
// router.delete('/:id', requireAuth, requireAdmin, removeDbA)

// router.post('/:id/msg', requireAuth, addDbAMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeDbAMsg)

module.exports = router