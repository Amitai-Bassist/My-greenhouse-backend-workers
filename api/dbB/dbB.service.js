const { log } = require('../../middlewares/logger.middleware')
const dbBService = require('../../services/dbB.service')
const dbAService = require('../../services/dbA.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await dbBService.getCollection('records')
        var dbAs = await collection.find().toArray()
        return dbAs[0]
    } catch (err) {
        logger.error('cannot find dbAs', err)
        throw err
    }
}

async function queryFromDbA() {
    try {
        const collection = await dbAService.getCollection('records')
        var dbAs = await collection.find().toArray()
        return dbAs[0]
    } catch (err) {
        logger.error('cannot find dbAs', err)
        throw err
    }
}

async function getById(dbAId) {
    try {
        const collection = await dbBService.getCollection('task')
        const dbA = collection.findOne({ _id: ObjectId(dbAId) })
        return dbA
    } catch (err) {
        logger.error(`while finding dbA ${dbAId}`, err)
        throw err
    }
}

async function remove(dbAId) {
    try {
        const collection = await dbBService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(dbAId) })
        return dbAId
    } catch (err) {
        logger.error(`cannot remove dbA ${dbAId}`, err)
        throw err
    }
}

async function add(dbA) {
    try {
        const collection = await dbBService.getCollection('task')
        await collection.insertOne(dbA)
        return dbA
    } catch (err) {
        logger.error('cannot insert dbA', err)
        throw err
    }
}

async function update(dbA) {
    try {
        if (!dbA){
            const dbBToSave = {
                temperature : utilService.getRandomInt(20,30),
                humidity : utilService.getRandomInt(0,100),
                radiation : utilService.getRandomInt(500,900),
            }
        } else {
            dbBToSave = {
                temperature : dbA.temperature,
                humidity : dbA.humidity,
                radiation : dbA.radiation,
            }
        }
        const collection = await dbBService.getCollection('records')
        await collection.updateOne({ _id: ObjectId('63e09f0b35bff160863839d2') }, { $set: dbBToSave })
        console.log('updated')
        return dbA
    } catch (err) {
        logger.error(`cannot update dbB ${dbA._Id}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    queryFromDbA
}
