const dbBService = require('./dbB.service.js')

const logger = require('../../services/logger.service')
const { log } = require('../../middlewares/logger.middleware.js')


var workerBIsOn = true

async function runUpdateWorker(counterN = 0.5){
  if (!workerBIsOn){
    console.log('stopping')
    return
  } 
  console.log (`starting worker for dbB`,typeof(counterN))
  let counter = (typeof(counterN) === 'object') ? 0 : counterN
  var delay = 500
    try {
      if (counter === 20 || counter % 70 === 0){
        delay = 10000
        console.log('no connection')
        // const selfUpdate = await dbBService.update()
        // console.log('10%- self updating')
      }else {
        const dbA = await dbBService.queryFromDbA()
        const selfUpdate = await dbBService.update(dbA)
      }
    }catch (err){
      console.log (`Failed updaiting`, err)
      delay = 10000
    }finally {
      var newCounter = counter + 0.5
      setTimeout(()=>{runUpdateWorker(newCounter)} , delay)
    }
}

async function stopUpdateWorkerB(){
  workerBIsOn = false
}

function startWorker(){
  workerBIsOn = true
  runUpdateWorker(0.5)
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


module.exports = {
  getDbAs,
  getDbAById,
  addDbA,
  updateDbA,
  removeDbA,
  runUpdateWorker,
  stopUpdateWorkerB,
  startWorker
}
