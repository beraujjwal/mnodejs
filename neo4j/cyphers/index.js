const fs = require('fs')

module.exports = file => {
    try {
        const buffer = fs.readFileSync(`${__dirname}/${file}.cypher`)
        return buffer.toString();
    } catch (err) {
        //console.log(err);
        return false;
    }
}