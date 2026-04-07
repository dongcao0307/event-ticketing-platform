#!/bin/bash
# wait-for-mysql.sh - Wait for MySQL to be ready

set -e

host="$1"
shift
cmd="$@"

while ! nc -z "$host" 3306; do
  >&2 echo "Waiting for MySQL at $host:3306..."
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
