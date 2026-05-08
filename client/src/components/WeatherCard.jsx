const WeatherCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl p-6 shadow-xl">

      {/* City and Country */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold">{data.city}</h2>
          <p className="text-blue-200">{data.country}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
          alt={data.weather.description}
          className="w-16 h-16"
        />
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <span className="text-6xl font-bold">
          {Math.round(data.temperature.current)}°C
        </span>
        <p className="text-blue-200 capitalize mt-1">
          {data.weather.description}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-4 mt-4 bg-blue-500 bg-opacity-40 rounded-xl p-4">
        <div className="text-center">
          <p className="text-blue-200 text-xs">Feels Like</p>
          <p className="font-semibold">
            {Math.round(data.temperature.feelsLike)}°C
          </p>
        </div>
        <div className="text-center">
          <p className="text-blue-200 text-xs">Humidity</p>
          <p className="font-semibold">{data.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-blue-200 text-xs">Wind</p>
          <p className="font-semibold">{data.windSpeed} m/s</p>
        </div>
      </div>

      {/* Min/Max */}
      <div className="flex justify-between mt-3 text-sm text-blue-200">
        <span>↓ {Math.round(data.temperature.min)}°C</span>
        <span>↑ {Math.round(data.temperature.max)}°C</span>
      </div>
    </div>
  );
};

export default WeatherCard;