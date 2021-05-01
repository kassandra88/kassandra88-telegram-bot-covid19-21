require("dotenv").config();
const { Telegraf } = require("telegraf");
const api = require("covid19-api");
const Markup = require("./node_modules/telegraf/lib/markup");
const countriesList = require("./constants");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Hello! ${ctx.message.from.first_name}
Узнай статистику по коронавирусу.
Введи на английском название страны.
Посмотреть весь список стран можно командой /help.
`,
    Markup.keyboard([
      ["US", "Russia"],
      ["Ukraine", "Kazakhstan"],
    ]).resize()
  )
);
bot.help((ctx) => ctx.reply(countriesList));
bot.on("text", async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Умерло: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered}`;
    ctx.reply(formatData);
  } catch {
    ctx.reply(
      "Ошибка! Такой страны не существует! Возможно вы ввели неправильно название. Чтобы посмотреть как пишется название вашей страны введите /help"
    );
  }
});

bot.launch();
