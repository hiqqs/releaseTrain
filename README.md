# 🚂🚃 releaseTrain 
📦 node.js package to improve your CICD pipeline & app release process, fear no more and bring on the releaseTrain!

🛤️ Auto cuts a branch based on current source of truth.\
🚀 Creates new branch (RC-version), sets upstream and pushes to origin\
📱 Sends Notification to desired channel via slack with release candidate information of the next train

[<img src="https://img.shields.io/badge/slack-join us in releaseTrain-red.svg?logo=slack">](https://join.slack.com/t/releasetrainworkspace/shared_invite/zt-pqcomcn7-f8N4LcP0YJ9ZqYWBmgA9RQ)
[![NPM](https://img.shields.io/npm/v/releasetrain.svg?logo=npm)](https://www.npmjs.com/package/releasetrain)
[![Downloads/week](https://img.shields.io/npm/dw/releasetrain.svg?color=orange)](https://www.npmjs.com/package/releasetrain)

📦 [Install](#install)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:electron: [npm](#npm)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧶 [yarn](#yarn)\
ℹ️ [Background](#background)\
🚉 [CI Examples](#ci-examples)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔵&nbsp;[Bitbucket Pipelines](#bitbucket-pipelines)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🟢&nbsp;[CircleCi](#circleci)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀&nbsp;[Github Actions](#github-actions)

### Install
#### npm
`npm add releasetrain`
#### yarn
`yarn add releasetrain`

### Background
Do you want to automate release candidates rather than manually cutting them everytime?  Perhaps just have an optional job in a CI pipeline you can just run to create a new release candidate?  Simply add release train with the `ci-examples` for yaml configurations.  It cuts a new branch with `RC-` (release candidate) prefix followed by the desired release version and sets upstream / pushes to origin.  It then sends out a slack notification to specified channel with information you can pass in a pipeline / action.

These are they variables that releaseTrain uses and example how you could set them locally if desired in a shorthand script

* appName: your app name (gets included in slack alert)
* hookUrl: a valid slack incoming webhook token to your workspace
* channel: a valid channel within the given hookUrl to send notification to (uses slack api)
* username: (optional) username to send the notification as

```
    "releaseTrain:setConfig": "cd ./node_modules/releasetrain && npm run releaseTrain-config --appName=APP_NAME --hookUrl=INSERT_YOUR_TOKEN_HERE --channel=YOUR_CHANNEL --username=USERNAME --releaseVersion=$npm_package_version",
    "releaseTrain:cut": "cd ./node_modules/releasetrain && npm run releaseTrain-cut --releaseVersion=$npm_package_version",
    "releaseTrain:notify": "cd ./node_modules/releasetrain && npm run releaseTrain-notify",
```

### CI Examples
_ci examples are within the `./ci-examples` dir_

The following CI environment variables are used for 🚂🚋 releaseTrain
* `$SLACK_WEBHOOK_URL` _sends notification of release train to desired release channel you specify in the CI script configuration_
* `$RELEASE_VERSION` _(Optional) the release version that appends to `RC-` when creating the next release candidate train
You could also just change the configuration to pass in whatever version you desire and not use the `$RELEASE_VERSION` env var_

#### Bitbucket Pipelines

`bitbucket-pipelines.yml`

This example has an optional manually triggered flow that uses the `$RELEASE_VERSION` env var and creates a release candidate from the master branch

```
# releaseTrain
image: node:latest
pipelines:
  branches:
    master:
      - step:
          name: Trigger next step manually if you want to create a release candidate
          script:
            - echo "Develop branch, manually proceed the next pipeline to cut release candidate"
      - step:
          name: Optional, trigger release candidate branch
          trigger: manual
          script:
            - npm install
            - echo "{\"app\":{\"_\":[],\"releaseVersion\":\"$RELEASE_VERSION\"}}" >> ./node_modules/releasetrain/releaseVersion.json
            - echo "#! /bin/bash" >> ./node_modules/releasetrain/releaseVersion.sh
            - echo "releaseVersion=$RELEASE_VERSION" >> ./releaseVersion.sh
            - echo "{\"configuration\":{\"_\":[],\"appName\":\"bitbucket\",\"hookUrl\":\"$SLACK_WEBHOOK_URL\",\"channel\":\"bitbucket\",\"username\":\"releaseTrain\"}}" >> ./node_modules/releasetrain/config.json
            - /bin/bash ./node_modules/releasetrain/scripts/cutRelease.sh
            - cd ./node_modules/releasetrain && npm run releaseTrain-notify
          artifacts:
            - node_modules/releasetrain/**
```

#### CircleCi
_coming soon_

#### Github Actions
_coming soon_
