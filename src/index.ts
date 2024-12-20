import { TradingBot } from './modules/trade/Binance';
import { pairs } from './utils/constants';
import { Telegram } from './modules/communication/Telegram';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { type CommunicationTool } from './modules/communication/CommunicationTool';
import { Discord } from './modules/communication/Discord';

/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

interface Arguments {
  telegram: boolean;
  discord: boolean;
  interval: number;
  algo: 'MTF' | 'TM';
}

const argv = yargs(hideBin(process.argv))
  .options({
    telegram: {
      type: 'boolean',
      default: false,
      describe: 'Utiliser Telegram comme outil de communication',
    },
    discord: {
      type: 'boolean',
      default: false,
      describe: 'Utiliser Discord comme outil de communication',
    },
    interval: {
      type: 'number',
      default: 30,
      describe: 'Intervalle en secondes entre les cycles de trading',
    },
    algo: {
      type: 'string',
      default: 'MTF',
      choices: ['MTF', 'TM'],
      describe:
        'Algorithme à utiliser : MTF (Multi-Timeframe) ou TM (Trend Momentum)',
    },
  })
  .strict()
  .parseSync() as Arguments;

const apiKey = process.env.BINANCE_API_KEY ?? '';
const apiSecret = process.env.BINANCE_API_SECRET ?? '';

const communicationTools: CommunicationTool[] = [];
if (argv.telegram) {
  const telegram = new Telegram();
  telegram.run();
  communicationTools.push(telegram);
}
if (argv.discord) {
  const discord = new Discord();
  discord.run();
  communicationTools.push(discord);
}

const bot = new TradingBot(apiKey, apiSecret, pairs, {
  communicationTool: communicationTools,
});

const interval = argv.interval * 1000;

// Fonction pour exécuter l'algorithme choisi
const runAlgorithm = async () => {
  try {
    if (argv.algo === 'MTF') {
      await bot.runMTF(); // Multi-Timeframe
    } else if (argv.algo === 'TM') {
      await bot.runTM(); // Trend Momentum
    } else {
      console.error(`Algorithme non reconnu : ${argv.algo}`);
    }
  } catch (error) {
    console.error(`Erreur lors de l'exécution de l'algo ${argv.algo}:`, error);
  }
};

// Exécuter l'algorithme une première fois
runAlgorithm();

// Exécuter l'algorithme à intervalle régulier
setInterval(runAlgorithm, interval);
