const LocationCard = ({ location, onDelete }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between hover:shadow-md transition">

      <div className="flex items-center gap-3">
        {/* Weather icon */}
        {location.weather && (
          <img
            src={`https://openweathermap.org/img/wn/${location.weather.icon}@2x.png`}
            alt={location.weather.description}
            className="w-10 h-10"
          />
        )}

        <div>
          <p className="font-semibold text-gray-800">{location.city}</p>
          <p className="text-gray-500 text-sm capitalize">
            {location.weather?.description || 'Loading...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Temperature */}
        {location.weather && (
          <span className="text-2xl font-bold text-blue-600">
            {Math.round(location.weather.temperature)}°C
          </span>
        )}

        {/* Delete button */}
        <button
          onClick={() => onDelete(location.id)}
          className="text-red-400 hover:text-red-600 transition text-xl"
          title="Remove location"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LocationCard;