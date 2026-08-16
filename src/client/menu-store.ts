let open = false
const listeners = new Set<() => void>()

export const menuStore = {
  getSnapshot: (): boolean => open,
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  setOpen(value: boolean): void {
    if (value === open) return
    open = value
    for (const listener of listeners) listener()
  },
}
