const neo4j = require('neo4j-driver');
const config = require('../../config/neo4j.config');

exports.neo4jDriver = neo4j.driver(
    config.url,
    neo4j.auth.basic(config.username, config.password),
    {
        disableLosslessIntegers: true,
        maxConnectionLifetime: 60 * 60 * 1000, // 1 hour
        maxConnectionPoolSize: 300,
        //encrypted: "ENCRYPTION_ON",
        //trust: "TRUST_CUSTOM_CA_SIGNED_CERTIFICATES",
        //trustedCertificates: [process.env.NEO4J_TRUSTED_CERTS],
        logging: {
            level: 'debug',
            logger: (level, message) => console.log('+++' + level + ' ' + message)
        }
    }
);