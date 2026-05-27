// Lightweight call limiter: keeps timestamps and rejects when rate exceeded
export function createCallLimiter(maxCalls, perMilliseconds) {
  const calls = [];
  return {
    call(fn, ...args) {
      const now = Date.now();
      // drop old timestamps
      while (calls.length && now - calls[0] > perMilliseconds) calls.shift();
      if (calls.length >= maxCalls) {
        const err = new Error('Too many requests');
        err.code = 'TOO_MANY_REQUESTS';
        throw err;
      }
      calls.push(now);
      return fn(...args);
    },
    // inspect for tests/debugging
    _getCalls() { return calls.slice(); },
  };
}
