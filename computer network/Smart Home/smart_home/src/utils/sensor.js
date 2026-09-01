export function getSoilStatus(soil) {
  if (soil === null || soil === undefined) return "Checking...";
  if (soil >= 660) return "No Rain";
  if (soil > 590 && soil < 660) return "Light Rain";
  if (soil <= 590) return "Heavy Rain";
  return "Moderate / Unclear";
}