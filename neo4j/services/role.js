'use strict';
const moment = require('moment');
const neo4j = require('../../libraries/neo4j.library');
const cypher = require('../cyphers');

const { baseError } = require('../../system/core/error/baseError');

module.exports = {
    create: async (data) => {
        try {
            const cypherScript = cypher(`role/create-role`);
            const graphData = {
                _id: data.id || 'null',
                parent: data.parent || 'null',
                name: data.name || 'null',
                slug: data.slug || 'null',
                rights: data.rights.filter(x => !!x) || [],
                deleted: data.deleted || false,
                status: data.status || false,
                createdAt: (data.createdAt) ? moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss") : 'null',
                updatedAt: (data.updatedAt) ? moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss") : 'null'
            };
            
            const role = await neo4j.write(cypherScript, graphData);

            if(data.parent) {
                const relationData = {
                    child: data.id,
                    parent: data.parent,
                    date: (data.createdAt) ? moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss") : 'null'
                };
                const relationScript = cypher(`role/create-parent-child-relation`);
                await neo4j.write(relationScript, relationData);
            }
            const rights = data?.rights;
            if(rights && rights.length >0) {
                rights.forEach( async(right) => {
                    if(!right.fullDeny) {
                        const resource = right.resource;
                        delete right.resource
                        const rightData = {
                            role: data.id,
                            resource,
                            right: JSON.stringify(right)
                        };
                        const rightScript = cypher(`role/set-rights`);
                        await neo4j.write(rightScript, rightData);
                    }
                    
                });
            }
        } catch (err) {

            console.log(err);
            throw new baseError(err.message);
        }
    },
    get: async (email) => {
        try {
            const cypherScript = cypher(`user/get-user-by-email`);
            await neo4j.write(cypherScript, email);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    getUserByEmail: async (email) => {
        try {
            const cypherScript = cypher(`user/get-user-by-email`);
            await neo4j.write(cypherScript, email);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    getUserById: async (id) => {
        try {
            const cypherScript = cypher(`user/get-user-by-id`);
            await neo4j.write(cypherScript, id);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    update: async (email, user) => {
        try {
            const cypherScript = cypher(`user/get-user-by-email`);
            await neo4j.write(cypherScript, email);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    updateUserByEmail: async (email, user) => {
        try {
            const cypherScript = cypher(`user/get-user-by-email`);
            await neo4j.write(cypherScript, email);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    updateUserById: async (id) => {
        try {
            const cypherScript = cypher(`user/get-user-by-id`);
            await neo4j.write(cypherScript, id);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
    deleteUserById: async (id) => {
        try {
            const cypherScript = cypher(`user/get-user-by-id`);
            await neo4j.write(cypherScript, id);
        } catch (err) {
            throw new baseError(err.message);
        }
    },
}