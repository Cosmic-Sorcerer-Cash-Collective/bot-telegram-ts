import { TradingBot } from './Binance'

// Vos clés API Binance (à sécuriser)
const apiKey = process.env.BINANCE_API_KEY ?? ''
const apiSecret = process.env.BINANCE_API_SECRET ?? ''

// Liste des paires à trader
const pairs = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'XRPUSDT',
  'DOTUSDT',
  'LINKUSDT',
  'LTCUSDT',
  'BCHUSDT',
  'DOGEUSDT'
]

const bot = new TradingBot(apiKey, apiSecret, pairs)

bot.startTrading().catch((error) => { console.error(error) })
