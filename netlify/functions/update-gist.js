exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { trafficLight, messageText } = JSON.parse(event.body);

    const GIST_ID = process.env.GIST_ID;
    const GIST_PAT = process.env.GIST_PAT;

    if (!GIST_ID || !GIST_PAT) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' }),
      };
    }

    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${GIST_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'status.json': {
            content: JSON.stringify(
              { trafficLight, messageText },
              null,
              2
            ),
          },
        },
      }),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to update Gist' }),
      };
    }

    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
