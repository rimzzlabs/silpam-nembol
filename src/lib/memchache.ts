export class TimeBasedCache<K extends string, V = any> {
  private readonly store: Map<K, { value: V; exp: number }>;
  private readonly ttl: number; // in milliseconds
  private readonly expirationList: { exp: number; key: string }[] = [];

  constructor(ttl = 1000 * 60 * 60 /* 1 hour */) {
    this.store = new Map();
    this.ttl = ttl;
  }

  set(key: K, value: V) {
    let expiration = Date.now() + this.ttl;
    this.expirationList.push({ key, exp: expiration });
    this.store.set(key, { value, exp: expiration });
    return this;
  }

  get(key: K): V | null {
    let entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.exp) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: K): boolean {
    let entry = this.store.get(key);
    return !!entry && Date.now() <= entry.exp;
  }

  clearExpired() {
    let now = Date.now();
    let count = 0;

    for (let entry of this.expirationList) {
      if (entry.exp <= now) {
        this.store.delete(entry.key as K);
        count += 1;
      }
      if (count >= 100) break;
    }

    return this;
  }

  /**
   * Get remaining time until expiration (in ms)
   */
  remaining(key: K): number | undefined {
    let entry = this.store.get(key);
    if (!entry) return 0;
    return entry?.exp - Date.now();
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete(key: K) {
    this.store.delete(key);
    return this;
  }
}
