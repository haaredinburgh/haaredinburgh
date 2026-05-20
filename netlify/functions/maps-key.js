exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://haaredinburgh.org'
    },
    body: JSON.stringify({ key: process.env.GOOGLE_MAPS_API_KEY })
  };
};
