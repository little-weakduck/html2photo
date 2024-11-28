var weatherData = JSON.parse(process.argv[2]);

// 处理当前天气数据并显示
function processCurrentWeather(data) {
    var now = data.now.now;
    var message = `
    <div class="current-weather">
        <h2>当前天气（${new Date(now.obsTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}）情况：${now.text}${getWeatherIcon(now.icon, true)}</h2>
      <ul>
        <li>温度：${now.temp}°C</li>
        <li>体感温度：${now.feelsLike}°C</li>
        <li>风向：${now.windDir}</li>
        <li>风速：${now.windSpeed}km/h</li>
        <li>湿度：${now.humidity}%</li>
        <li>大气压强：${now.pressure}hPa</li>
        <li>能见度：${now.vis}km</li>
      </ul>
    </div>
  `;
    return message;
}

// 处理未来七天天气预报并显示
function processSevenDayWeather(data) {
    var daily = data.sevenday.daily;
    var message = "<div class='forecast'><h2>未来三天天气预报：</h2><ul>";
    for (var i = 0; i < daily.length; i++) {
        message += `
      <li>${daily[i].fxDate}：
        <ul>
          <li>白天天气状况：${daily[i].textDay}${getWeatherIcon(daily[i].iconDay)}</li>
          <li>夜间天气状况：${daily[i].textNight}${getWeatherIcon(daily[i].iconNight)}</li>
          <li>最高温度：${daily[i].tempMax}°C</li>
          <li>最低温度：${daily[i].tempMin}°C</li>
          ${i == 0 ? `<li>湿度：${daily[i].humidity}%</li>
          <li>能见度：${daily[i].vis}km</li>
          <li>日出时间：${daily[i].sunrise}</li>
          <li>日落时间：${daily[i].sunset}</li>
          <li>月升时间：${daily[i].moonrise}</li>
          <li>月落时间：${daily[i].moonset}</li>
          <li>月相:${daily[i].moonPhase}${getWeatherIcon(daily[i].moonPhaseIcon)}</li>` : ''}
        </ul></li>
    `;
    }
    message += "</ul></div>";
    return message;
}

function getWeatherIcon(iconId, isFill = false) {
    return `<img src="http://localhost:4455/icons/${iconId}${isFill ? '-fill' : ''}.svg" alt="QWeather Icons" class="weather-icon">`
}

// 处理数据
const current = processCurrentWeather(weatherData);
const sevenDay = processSevenDayWeather(weatherData);
const htmlOutput = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>天气预报</title>
    <style>
      /* 在这里添加您的CSS样式 */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .weather-container {
        width: 800px;
        margin: auto;
        background: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #333;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin-bottom: 10px;
        color: #555;
      }
      img {
        vertical-align: middle;
        margin-right: 5px;
        max-width: 100%;
        max-height: 100%;
        height: auto;
        width: auto;
      }
      .weather-icon {
        display: inline-block;
        height: auto;
        width: auto;
        background-size: cover;
      }
      .current-weather, .forecast {
        margin-bottom: 20px;
      }
      .forecast ul {
        margin-left: 20px;
      }
    </style>
  </head>
  <body>
    <div class="weather-container">
      ${current}
      ${sevenDay}
    </div>
  </body>
  </html>
`;

const encodeHtml = encodeURIComponent(htmlOutput);
console.log(JSON.stringify({ html: encodeHtml }));