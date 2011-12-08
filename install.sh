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

(
cat << EOF
#!monit
set logfile /var/log/monit.log

check host sketchwithus with address 127.0.0.1
    start program = "/sbin/start sketchwithus"
    stop program  = "/sbin/stop sketchwithus"
    if failed port 8000 protocol HTTP
        request /
        with timeout 10 seconds
        then restart
EOF
) > /etc/monit/conf.d/sketchwithus.conf

service monit restart
