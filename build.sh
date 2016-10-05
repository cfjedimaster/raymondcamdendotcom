#!/bin/bash
echo "Running Hugo..."
hugo
echo "Running Surge..."
surge -p /Users/raymondcamden/Dropbox/websites/2016.raymondcamden.com/hugo_dynamic/public