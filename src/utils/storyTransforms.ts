export const pickRandom = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)]
