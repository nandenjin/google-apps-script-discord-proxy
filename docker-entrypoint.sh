#!/bin/sh
set -e

: "${PORT:=3000}"
: "${VERSION:=0.0.0}"

export PORT VERSION

envsubst '${PORT} ${VERSION}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
