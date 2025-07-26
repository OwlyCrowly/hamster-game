const { Telegraf } = require('telegraf');
const bot = new Telegraf('8280404649:AAF_U3e2AQLMTTJxCL1Mag5QayUXQzsdvSo');

// Команда для запуска игры
bot.command('start', (ctx) => {
  ctx.reply('Лови капибару!', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Играть!',
          web_app: { url: 'https://hamster-game-omega.vercel.app/' }
        }]
      ]
    }
  });
});

bot.launch();
console.log('Бот запущен!');