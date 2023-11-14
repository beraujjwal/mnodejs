const neo4j = require('neo4j-driver');
const  { database } = require('../config/neo4j.config');
const { baseError } = require('../system/core/error/baseError');

const { neo4jDriver } = require('../helpers/neo4j');

module.exports = {
    read: async (cypher, params = {}) => {
        const session = neo4jDriver.session({
            database,
            defaultAccessMode: neo4j.session.READ
        });

        return await session.run(cypher, params).then(result => {
            return result;
        }).catch(err => {
            session.close();
            throw new baseError(err);
        });
    },
    write: async (cypher, params = {}) => {
        const session = neo4jDriver.session({
            database,
            defaultAccessMode: neo4j.session.WRITE
        });

        if(params?.rights) delete params.rights;

        return await session.run(cypher, params).then(result => {
            session.close();
            return result.records;
        }).catch(err => {
            console.error(err)
            session.close();
            //throw new baseError(err);
        });
    },
}