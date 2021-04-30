#!/bin/bash
source ./releaseVersion.sh
git checkout -b RC-$releaseVersion
git push -u origin RC-$releaseVersion