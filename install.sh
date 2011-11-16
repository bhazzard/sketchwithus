#!/bin/bash

(
cat <<EOF
#!upstart
description "sketchwith.us"

start on startup
stop on shutdown

exec sudo -u $SUDO_USER sh -c "export NODE_ENV=production; cd $(pwd); node app.js --sketchpad --image >> sketchwithus.log 2>&1"
EOF
) > /etc/init/sketchwithus.conf
