import { TechnicalIndicator } from './TechnicalIndicator'
import { type typeTradeDecision, type dataBinance } from './utils/type'

export class BotAlgorithm {
  public async tradeDecision (data: dataBinance[]): Promise<typeTradeDecision> {
    const technicalIndicator = new TechnicalIndicator()
    let decision: string = 'HOLD'

    const adx = technicalIndicator.calculateADX(data, 14)
    const rsi = technicalIndicator.calculateRSI(data, 14)
    const mas = technicalIndicator.calculateMAs(data, [9, 21, 50])
    const obv = technicalIndicator.calculateOBV(data)
    const awesomeOscillator = technicalIndicator.calculateAwesomeOscillator(data)
    const sar = technicalIndicator.calculateParabolicSAR(data)

    const obvValue = obv[obv.length - 1]
    const awesomeOscillatorValue = awesomeOscillator[awesomeOscillator.length - 1]
    const closePrice = parseFloat(data[data.length - 1].close)
    const firstValueMA = mas[0][0]
    const secondValueMA = mas[1][0]
    const sarValue = sar[sar.length - 1]

    const strongBuyConditions =
      adx > 30 &&
      rsi < 30 &&
      firstValueMA > secondValueMA &&
      obvValue > 0 &&
      awesomeOscillatorValue > 0 &&
      sarValue < closePrice

    const mediumBuyConditions =
      adx > 20 &&
      rsi < 35 &&
      firstValueMA > secondValueMA &&
      obvValue > 0 &&
      awesomeOscillatorValue > 0

    const strongSellConditions =
      adx > 30 &&
      rsi > 70 &&
      firstValueMA < secondValueMA &&
      obvValue < 0 &&
      awesomeOscillatorValue < 0 &&
      sarValue > closePrice

    const mediumSellConditions =
      adx > 20 &&
      rsi > 65 &&
      firstValueMA < secondValueMA &&
      obvValue < 0 &&
      awesomeOscillatorValue < 0

    if (strongBuyConditions) {
      decision = 'STRONG_BUY'
    } else if (mediumBuyConditions) {
      decision = 'MEDIUM_BUY'
    } else if (strongSellConditions) {
      decision = 'STRONG_SELL'
    } else if (mediumSellConditions) {
      decision = 'MEDIUM_SELL'
    }

    return { decision }
  }
}
