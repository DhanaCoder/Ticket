const StatusDisplay = ({ status }) => {
  const getColor = (status) => {
    let color;
    switch (status) {
      case "solved":
        color = "bg-green-400";
        return color;

      case "reopened":
        color = "bg-blue-400";
        return color;

      case "started":
        color = "bg-yellow-400";
        return color;

      case "not started":
        color = "bg-red-400";
        return color;
      default:
        color = "bg-slate-700";
    }
    return color;
  };
  return (
    <span
      className={`inline-block  rounded-full px-2 py-1 text-xs font-semibold text-gray-700 ${getColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusDisplay;
