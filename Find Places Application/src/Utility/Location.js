const GOOGLE_API_KEY = "AIzaSyAd5hNT8fZkKvDLcmFExu6SgC8EeVkXDa0";

export async function getAddressFromCoords(coords) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address. Please try again!");
  }
  // response.json() --> 是把返回响应的json字符串转换成字典
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;
  return address;
}

export async function getCoordsFromAddress(address) {
  const urlAddress = encodeURI(address);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates. Please try again!");
  }
  // response.json() --> 是把返回响应的json字符串转换成字典
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  //   console.log();
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
