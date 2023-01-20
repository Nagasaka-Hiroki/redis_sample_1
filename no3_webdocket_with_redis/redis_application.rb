#redisを有効にする
require 'redis'

#pp redis=Redis.new(host: "172.21.0.4", port: 6379)
pp redis=Redis.new(host: "localhost", port: 6379)
pp redis.ping
redis.set('key','value')
pp redis.get('key')