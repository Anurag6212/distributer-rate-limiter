-- KEYS[1] = tokens key
-- KEYS[2] = last refill key

-- ARGV[1] = capacity
-- ARGV[2] = refill rate (tokens/sec)
-- ARGV[3] = current timestamp
-- ARGV[4] = expiry time

local tokensKey = KEYS[1]
local lastRefillKey = KEYS[2]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local expiry = tonumber(ARGV[4])

local tokens = tonumber(redis.call("GET", tokensKey))
local lastRefill = tonumber(redis.call("GET", lastRefillKey))

if tokens == nil then
  tokens = capacity
end

if lastRefill == nil then
  lastRefill = now
end

local elapsed = now - lastRefill
local refill = elapsed * refillRate

tokens = math.min(capacity, tokens + refill)

local allowed = 0

if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
end

redis.call("SET", tokensKey, tokens, "EX", expiry)
redis.call("SET", lastRefillKey, now, "EX", expiry)

return {allowed, tokens}