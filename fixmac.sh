#!/bin/bash
sysctl -w kern.maxfiles=65536
sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536 65536
echo "Done"