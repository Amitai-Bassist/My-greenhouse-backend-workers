const dbAService = require('./dbA.service.js')

const logger = require('../../services/logger.service')

var workerAIsOn = false

async function runUpdateWorker(){
  if (!workerAIsOn){
    console.log('stopping')
    return
  } 
  console.log(`starting worker for dbA`)
  var delay = 500
  try {
    const update = await dbAService.update()
  }catch (err){
    console.log (`Failed updaiting`, err)
    delay = 10
  }finally {
    setTimeout(runUpdateWorker , delay)
  }
}

function stopUpdateWorker(){
  try{
    workerAIsOn = false
    res.send('ok')
  } catch (err){
    res.status(500).send({ err: 'Failed to stop worker' })
  }
}

function startWorker(){
  try{
    if (workerAIsOn === true){
      res.send('allredy on')
      return
    } else{
      workerAIsOn = true
      console.log('starting')
      runUpdateWorker()
    }
  }catch (err){
    res.status(500).send({ err: 'Failed to start worker A' })
  }
}

async function getDbAs(req, res) {
  try {
    logger.debug('Getting DbAs')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const dbAs = await dbAService.query(filterBy)
    res.json(dbAs)
  } catch (err) {
    logger.error('Failed to get dbAs', err)
    res.status(500).send({ err: 'Failed to get dbAs' })
  }
}

async function getDbAById(req, res) {
  try {
    const dbAId = req.params.id
    const dbA = await dbAService.getById(dbAId)
    res.json(dbA)
  } catch (err) {
    logger.error('Failed to get dbA', err)
    res.status(500).send({ err: 'Failed to get dbA' })
  }
}

async function addDbA(req, res) {
  const {loggedinUser} = req

  try {
    const dbA = req.body
    dbA.owner = loggedinUser
    const addedDbA = await dbAService.add(dbA)
    res.json(addedDbA)
  } catch (err) {
    logger.error('Failed to add dbA', err)
    res.status(500).send({ err: 'Failed to add dbA' })
  }
}


async function updateDbA(req, res) {
  try {
    const dbA = req.body
    const updatedDbA = await dbAService.update(dbA)
    res.json(updatedDbA)
  } catch (err) {
    logger.error('Failed to update dbA', err)
    res.status(500).send({ err: 'Failed to update dbA' })

  }
}

async function removeDbA(req, res) {
  try {
    const dbAId = req.params.id
    const removedId = await dbAService.remove(dbAId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove dbA', err)
    res.status(500).send({ err: 'Failed to remove dbA' })
  }
}

async function addDbAMsg(req, res) {
  const {loggedinUser} = req
  try {
    const dbAId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await dbAService.addDbAMsg(dbAId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update dbA', err)
    res.status(500).send({ err: 'Failed to update dbA' })

  }
}

async function removeDbAMsg(req, res) {
  const {loggedinUser} = req
  try {
    const dbAId = req.params.id
    const {msgId} = req.params

    const removedId = await dbAService.removeDbAMsg(dbAId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove dbA msg', err)
    res.status(500).send({ err: 'Failed to remove dbA msg' })

  }
}

module.exports = {
  getDbAs,
  getDbAById,
  addDbA,
  updateDbA,
  removeDbA,
  addDbAMsg,
  removeDbAMsg,
  runUpdateWorker,
  stopUpdateWorker,
  startWorker
}
