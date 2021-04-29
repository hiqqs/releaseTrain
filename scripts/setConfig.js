const jsonfile = require('jsonfile')
const argv = require('minimist')(process.argv.slice(2));

const file = './config.json'
const obj = { configuration: argv }
 
jsonfile.writeFileSync(file, obj)