const jsonfile = require('jsonfile')
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs-extra')

// this gets used for the slack api
const file = './releaseVersion.json'
const obj = { app: argv }
jsonfile.writeFileSync(file, obj)

// sh version gets used for git commands
const file2 = './releaseVersion.sh' 
const obj2 = '#!/bin/bash\nreleaseVersion='+argv.releaseVersion
fs.writeFileSync(file2, obj2)