const MAX_ATTEMPTS = 5;

export async function checkRateLimit(
  ip: string | null,
  namespace: KVNamespace
): Promise<{ allowed: boolean; remainingAttempts: number }> {
  if (!ip) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  const key = `login_attempts:${ip}`;
  const attempts = await namespace.get(key);
  
  if (!attempts) {
    // First attempt
    await namespace.put(key, '1', { expirationTtl: 60 }); // Expire after 1 minute
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }
  
  const attemptCount = parseInt(attempts, 10);
  
  if (attemptCount >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  // Increment attempts
  await namespace.put(key, String(attemptCount + 1), { expirationTtl: 60 });
  
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attemptCount - 1 };
}

export async function resetRateLimit(ip: string | null, namespace: KVNamespace): Promise<void> {
  if (!ip) return;
  
  const key = `login_attempts:${ip}`;
  await namespace.delete(key);
}