exports.handler = async (event) => {
  try {
    const GIST_ID = process.env.GIST_ID;
    if (!GIST_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing GIST_ID env var' }),
      };
    }

    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: 'Failed to fetch gist' }),
      };
    }

    const gist = await res.json();
    const file = gist.files && gist.files['status.json'];
    const content = file && file.content ? file.content : null;
    let state = {};
    if (content) {
      try {
        state = JSON.parse(content);
      } catch (e) {
        // fallback: try to decode if necessary
        state = { error: 'invalid json in gist' };
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(state)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
