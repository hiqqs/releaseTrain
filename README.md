# 🚂🚃 releaseTrain 
_all aboard the automated release candidate branching process train_
---
[![NPM](https://img.shields.io/npm/v/releasetrain.svg?logo=npm&color=white&style=plastic)](https://www.npmjs.com/package/releasetrain)
---
🛤️ Auto cuts a branch based on current source of truth\
🚀 Creates new branch (RC-version), sets upstream and pushes to origin\
📱 Sends Notification to desired channel via slack with release candidate information of the next train\
📦 Can be added to a node.js project or also used on any CICD for any codebase

⚙️ [Install](#install)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📦 [npm](#npm)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧶 [yarn](#yarn)\
ℹ️ [Background](#background)\
🚉 [CI Examples](#ci-examples)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔵&nbsp;[Bitbucket Pipelines](#bitbucket-pipelines)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🟢&nbsp;[CircleCi](#circleci)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀&nbsp;[Github Actions](#github-actions)

### Install

Node.js project?  You can add releaseTrain to your package json, or you can simply install on the fly in CI.  See examples how to accomplish this in CI for any project

#### npm
`npm install releasetrain`
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

`giithub-actions.yml`

This example has an optional manually triggered flow that uses the `$RELEASE_VERSION` secrets var and creates a release candidate from main branch
You need to also provide the `$SLACK_WEBHOOK_URL` as part of the repository secrets.  You can create a slack app or add an incoming webhook to your slack via administration this example is not for that.  Under Actions settings for your repository you need to allow GHA workflows read and write permission to allow Github Actions bot to be able to perform admin git operations such as automatically push up a new RC-*** branch used by releaseTrain operations.

```
name: Release Train example for Github Actions

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm install -g yarn && yarn
    - name: Set the Release Version
      run: |
        echo "{\"app\":{\"_\":[],\"releaseVersion\":\"$RELEASE_VERSION\"}}" >> ./node_modules/releasetrain/releaseVersion.json
        echo "#! /bin/bash" >> ./node_modules/releasetrain/releaseVersion.sh
        echo "releaseVersion=$RELEASE_VERSION" >> ./releaseVersion.sh
        echo "{\"configuration\":{\"_\":[],\"appName\":\"Github Actions\",\"hookUrl\":\"$SLACK_WEBHOOK_URL\",\"channel\":\"github-actions-example\",\"username\":\"releaseTrain\"}}" >> ./node_modules/releasetrain/config.json
        /bin/bash ./node_modules/releasetrain/scripts/cutRelease.sh
        cd ./node_modules/releasetrain && npm run releaseTrain-notify
      env:
        RELEASE_VERSION: ${{ secrets.RELEASE_VERSION }}
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: releasetrain
        path: node_modules/releasetrain/**
        retention-days: 30
```
