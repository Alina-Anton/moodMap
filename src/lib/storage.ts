const inMemoryStorage = new Map<string, string>()

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export const storage = {
  getItem(key: string) {
    if (canUseStorage()) {
      return window.localStorage.getItem(key)
    }
    return inMemoryStorage.get(key) ?? null
  },
  setItem(key: string, value: string) {
    if (canUseStorage()) {
      window.localStorage.setItem(key, value)
      return
    }
    inMemoryStorage.set(key, value)
  },
  removeItem(key: string) {
    if (canUseStorage()) {
      window.localStorage.removeItem(key)
      return
    }
    inMemoryStorage.delete(key)
  },
}
