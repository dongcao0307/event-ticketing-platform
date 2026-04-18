# Local Redis image for order-service (key-expiration pub-sub enabled)
#
# Build:
#   docker build -t order-redis -f Dockerfile .
# Run:
#   docker run -d --name order-redis -p 6379:6379 order-redis
#
# Notes:
# - This image enables keyspace notifications for expired keys via redis.conf
# - order-service listens on '__keyevent@*__:expired' and updates Order status to EXPIRED

FROM redis:7.4-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
