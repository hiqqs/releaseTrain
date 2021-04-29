# 🚂🚃 releaseTrain 
🛤️ A node.js helper 📦 to improve your CICD pipeline & app release process, fear no more and bring on the releaseTrain!

Auto cuts a branch based on current source of truth.
Creates new branch (RC-version), sets upstream and pushes to origin
Notifies via slack

📦 [Install](#install)
🚉 [Configure](#configure)
🚂 [Set Configuration](#set-configuration)
🚋 [Start the release train!](#start-the-release-train!)

### Install
`npm add releasetrain`

### Configure
Add the following short hands to your package.json, and configure the following:

* appName: your app name (gets included in slack alert)
* hookUrl: a valid slack incoming webhook token to your workspace
* channel: a valid channel within the given hookUrl to send notification to (uses slack api)
* username: (optional) username to send the notification as

More to come...

```
    "releaseTrain:setConfig": "cd ./node_modules/releasetrain && npm run releaseTrain-config --appName=APP_NAME --hookUrl=INSERT_YOUR_TOKEN_HERE --channel=YOUR_CHANNEL --username=USERNAME --releaseVersion=$npm_package_version",
    "releaseTrain:cut": "cd ./node_modules/releasetrain && npm run releaseTrain-cut --releaseVersion=$npm_package_version",
    "releaseTrain:notify": "cd ./node_modules/releasetrain && npm run releaseTrain-notify",
```

### Set Configuration
you can call your configuration which will generate a json file with the information needed to cut the release and send a notification.

`npm run releaseTrain:setConfig`

### Start the release train!
Now you can run (pulls version from package.json)
`releaseTrain:cut`

This will automatically push up a release train branch of `RC-*releaseVersion*`

You can call npm run `releaseTrain:notify` within your CI step to slack out the train has been cut!
