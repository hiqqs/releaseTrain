const Slack = require('node-slack');
const fs = require('fs')
const configData = JSON.parse(fs.readFileSync('./config.json'))
const releaseTrain = JSON.parse(fs.readFileSync('./releaseVersion.json'))
const appName = configData.configuration.appName;
const releaseVersion = releaseTrain.app.releaseVersion;
const channel = configData.configuration.channel;
const username = configData.configuration.username;
const slack = new Slack(configData.configuration.hookUrl);

slack.send({
	text: ':steam_locomotive: ' + appName + ' new release candidate has been cut successfully! <!here> :tada: \n :railway_track: branch: `RC-'+ releaseVersion + '`',
	channel: '#'+channel,
	username: username
});

// console.log(configData.configuration.hookUrl);