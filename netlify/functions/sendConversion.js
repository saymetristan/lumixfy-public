const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  const { event_name, event_time, user_data } = JSON.parse(event.body);

  const payload = {
    data: [
      {
        event_name,
        event_time,
        user_data,
        action_source: 'website',
      },
    ],
    access_token: process.env.META_ACCESS_TOKEN,
    pixel_id: process.env.META_PIXEL_ID,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${payload.pixel_id}/events`,
      payload
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error al enviar el evento:', error.response.data);
    return {
      statusCode: 500,
      body: 'Error al enviar el evento',
    };
  }
};
