const { log } = require('../../middlewares/logger.middleware')
const dbService = require('../../services/dbA.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('task')
        var dbAs = await collection.find(criteria).toArray()
        return dbAs
    } catch (err) {
        logger.error('cannot find dbAs', err)
        throw err
    }
}

async function getById(dbAId) {
    try {
        const collection = await dbService.getCollection('task')
        const dbA = collection.findOne({ _id: ObjectId(dbAId) })
        return dbA
    } catch (err) {
        logger.error(`while finding dbA ${dbAId}`, err)
        throw err
    }
}

async function remove(dbAId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(dbAId) })
        return dbAId
    } catch (err) {
        logger.error(`cannot remove dbA ${dbAId}`, err)
        throw err
    }
}

async function add(dbA) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.insertOne(dbA)
        return dbA
    } catch (err) {
        logger.error('cannot insert dbA', err)
        throw err
    }
}

async function update(dbA = {_id:'63e09f2e35bff160863839d5'}) {
    try {
        const dbAToSave = {
            Temperature : utilService.getRandomInt(20,30),
            Humidity : utilService.getRandomInt(0,100),
            Radiation : utilService.getRandomInt(500,900),
        }
        const collection = await dbService.getCollection('records')
        await collection.updateOne({ _id: ObjectId(dbA._id) }, { $set: dbAToSave })
        console.log('updated')
        return dbA
    } catch (err) {
        logger.error(`cannot update dbA ${dbA._Id}`, err)
        throw err
    }
}

async function addDbAMsg(dbAId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('dbA')
        await collection.updateOne({ _id: ObjectId(dbAId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add dbA msg ${dbAId}`, err)
        throw err
    }
}

async function removeDbAMsg(dbAId, msgId) {
    try {
        const collection = await dbService.getCollection('dbA')
        await collection.updateOne({ _id: ObjectId(dbAId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add dbA msg ${dbAId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addDbAMsg,
    removeDbAMsg
}
