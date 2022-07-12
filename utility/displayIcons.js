function displayWeatherIcon(icon) {
  switch (icon) {
    case '01d':
      icon = 'fa-sun';
      break;
    case '01n':
      icon = 'fa-moon';
      break;
    case '02d':
      icon = 'fa-cloud-sun';
      break;
    case '02n':
      icon = 'fa-cloud-moon';
      break;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      icon = 'fa-cloud';
      break;
    case '09d':
    case '09n':
      icon = 'fa-cloud-showers-heavy';
      break;
    case '10d':
      icon = 'fa-cloud-sun-rain';
      break;
    case '10n':
      icon = 'fa-cloud-moon-rain';
      break;
    case '11d':
      icon = 'fa-cloud-bolt-sun';
      break;
    case '11n':
      icon = 'fa-cloud-bolt-moon';
      break;
    case '13d':
    case '13n':
      icon = 'fa-snowflake';
      break;
    case '50d':
    case '50n':
      icon = 'fa-cloud-fog';
      break;
    default:
      icon = 'fa-question';
      break;
  }
  return icon;
}

module.exports = {
  displayWeatherIcon,
};
