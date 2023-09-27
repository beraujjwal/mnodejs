const moment = require('moment');
const neo4j = require('../../libraries/neo4j.library');
const cypher = require('../cyphers');

const { baseError } = require('../../system/core/error/baseError');

module.exports = {
    create: async (data) => {
        try {
            const cypherScript = cypher(`resource/create-resource`);
            const graphData = {
                _id: data.id || 'null',
                name: data.name || 'null',
                slug: data.slug || 'null',
                deleted: data.deleted || false,
                status: data.status || false,
                createdAt: (data.createdAt) ? moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss") : 'null',
                updatedAt: (data.updatedAt) ? moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss") : 'null'
            };
            
            await neo4j.write(cypherScript, graphData);

            if(data.parent) {
                const relationData = {
                    child: data.id,
                    parent: data.parent,
                    date: (data.createdAt) ? moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss") : 'null'
                };
                const relationScript = cypher(`resource/create-parent-child-relation`);
                await neo4j.write(relationScript, relationData);
            }
            const rightsAvailable = data.rightsAvailable;
            if(rightsAvailable.length >0) {
                rightsAvailable.forEach( async(rightElement) => {

                    const right = {
                        resource: data.id,
                        permission: rightElement,
                        permissionKey: rightElement,
                    };
                    const rightScript = cypher(`resource/set-rights-available`);
                    await neo4j.write(rightScript, right);
                    
                });
            }
            
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    get: async (id) => {
        try {
            const cypherScript = cypher(`resource/get-resource-by-id`);
            await neo4j.write(cypherScript, id);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    update: async (email, user) => {
        try {
            const cypherScript = cypher(`user/update-resource-by-id`);
            await neo4j.write(cypherScript, email);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    delete: async (id) => {
        try {
            const cypherScript = cypher(`user/delete-resource-by-id`);
            await neo4j.write(cypherScript, id);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
}