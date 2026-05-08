const ForecastCard = ({ day }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow text-center flex flex-col items-center gap-2">

      {/* Date */}
      <p className="text-gray-500 text-sm font-medium">
        {new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })}
      </p>

      {/* Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
        alt={day.weather.description}
        className="w-12 h-12"
      />

      {/* Description */}
      <p className="text-gray-600 text-xs capitalize">
        {day.weather.description}
      </p>

      {/* Temp */}
      <div className="flex gap-2 text-sm">
        <span className="text-blue-600 font-semibold">
          ↑{Math.round(day.temperature.max)}°
        </span>
        <span className="text-gray-400">
          ↓{Math.round(day.temperature.min)}°
        </span>
      </div>

      {/* Humidity */}
      <p className="text-gray-400 text-xs">
        💧 {day.humidity}%
      </p>
    </div>
  );
};

export default ForecastCard;