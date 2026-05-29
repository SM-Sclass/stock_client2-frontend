const MARKET_START = 9 * 60 + 15;
const MARKET_END = 15 * 60 + 25;

export const isWeekend = () => {
  const now = new Date()
  const day = now.getDay()
  return day === 6 || day === 0
}

export const isMarketOpen = () => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const isMarketOpen = (hour * 60 + minute) >= MARKET_START && (hour * 60 + minute) <= MARKET_END && !isWeekend()
  return isMarketOpen
}

