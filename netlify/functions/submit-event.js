exports.handler = async function(event) {
  const NOTION_KEY = 'ntn_e43061445058HlCCAAFiK0jVArC75a7UOt0FNYQm7fu5Rt';
  const DATABASE_ID = '327100aa8cf98081bc51d1dd343e7a37';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const {
      'event-name': eventName,
      'start-date': startDate,
      'end-date': endDate,
      venue,
      area,
      category,
      price,
      'ticket-url': ticketUrl,
      'haar-only': haarOnly,
      description,
      'image-url': imageUrl,
      'submitted-by': submittedBy,
      'promoter-notes': promoterNotes
    } = body;

    // Build Notion page properties
    const properties = {
      'Event Name': {
        title: [{ text: { content: eventName || 'Untitled' } }]
      },
      'Status': {
        status: { name: 'Pending' }
      },
      'Source': {
        select: { name: 'Submitted' }
      }
    };

    if (startDate) {
      properties['Start Date and Time'] = {
        date: { start: startDate }
      };
    }

    if (endDate) {
      properties['End Date and Time'] = {
        date: { start: endDate }
      };
    }

    if (venue) {
      properties['Venue'] = {
        rich_text: [{ text: { content: venue } }]
      };
    }

    if (area) {
      properties['Area'] = {
        select: { name: area }
      };
    }

    if (category) {
      properties['Category'] = {
        select: { name: category }
      };
    }

    if (price !== undefined && price !== '') {
      properties['Price'] = {
        number: parseFloat(price) || 0
      };
    }

    if (ticketUrl && haarOnly !== 'true') {
      properties['Ticket URL'] = {
        url: ticketUrl
      };
    }

    if (haarOnly === 'true') {
      properties['Haar Only'] = {
        checkbox: true
      };
    }

    if (description) {
      properties['Description'] = {
        rich_text: [{ text: { content: description } }]
      };
    }

    if (imageUrl) {
      properties['Image URL'] = {
        url: imageUrl
      };
    }

    if (submittedBy) {
      properties['Submitted By'] = {
        email: submittedBy
      };
    }

    if (promoterNotes) {
      properties['Promoter Notes'] = {
        rich_text: [{ text: { content: promoterNotes } }]
      };
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion error:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create Notion entry', details: data })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: data.id })
    };

  } catch(err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
