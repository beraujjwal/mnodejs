'use strict';
const moment = require('moment');
const neo4j = require('../../libraries/neo4j.library');
const cypher = require('../cyphers');
const { baseError } = require('../../system/core/error/baseError');

module.exports = {
    create: async (data) => {
        try {
            const cypherScript = cypher(`user/create-user`);
            const graphUser = {
                _id: data.id || 'null',
                name: data.name || 'null',
                phone: data.phone || 'null',
                roles: data.roles || [],
                email: data.email || 'null',
                isEmailVerified: data.isEmailVerified || false,
                isPhoneVerified: data.isPhoneVerified || false,
                status: data.status || false,
                verified: data.verified || false,
                blockExpires: (data.blockExpires) ? moment(data.blockExpires).format("YYYY-MM-DD HH:mm:ss") : 'null',
                createdAt: (data.createdAt) ? moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss") : 'null',
            };

            await neo4j.write(cypherScript, graphUser);
        } catch (err) {
            //console.log(err);
            //throw new baseError(err.message);
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