# AI-Retrieval Service on StarkLens 🔍

## Overview

StarkLens's AI Retrieval Service API provides dynamic query routing based on user inputs to classify and retrieve relevant swap information and transaction details from Starknet.

## Endpoint

```
POST /api/query
```

## Request Body

- **question**: String. The user query to classify and process.

Example:

```json
{
  "question": "What are the current swap trades available?"
}
```

## Response Format

The API responds with a JSON object containing the interpreted question, its classification, and the formatted response.

Example Response:

```json
{
  "question": "What are the current swap trades available?",
  "classification": "Open Transaction",
  "response": {
    "text": "Currently, there is one open swap intent available.",
    "attachments": [
      {
        "id": "swap-intent-1",
        "creator": "0x1234567890",
        "status": "Open",
        "created_at": 1687334400,
        "updated_at": 1687334400,
        "from": {
          "address": "0x1111111111",
          "ticker": "USDC",
          "amount": 5000
        },
        "to": {
          "address": "0x1111111111",
          "ticker": "AERO",
          "amount": 3000
        },
        "rate": 1.67,
        "deadline": 1687593600,
        "min_swap_amount": 1000,
        "filled_amount": 0,
        "gated": {}
      }
    ]
  }
}
```

## How It Works

1. **Query Classification**: Uses NLP model and Langchain to classify user queries into categories such as "Open Transaction," "Historical Transaction," or "General Query."

2. **Transaction Retrieval**: Based on the classification, the API routes the request to the appropriate backend chain to retrieve and respond to user's query based off details from Starknet.

3. **Response Formatting**: The retrieved transactions are formatted into a response object containing both textual information and attachments (transaction details).

## Example Usage

### JavaScript

```javascript
const fetch = require("node-fetch");

async function fetchQueryResponse() {
  const apiUrl = "http://base-url/api/query";
  const requestBody = {
    question: "What are the current swap trades available?",
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  console.log(data);
}

fetchQueryResponse();
```

### Python

```python
import requests

def fetch_query_response():
    url = 'http://your-api-url/api/query'
    payload = {
        "question": "What are the current swap trades available?"
    }
    response = requests.post(url, json=payload)
    data = response.json()
    print(data)

fetch_query_response()
```

## Testing Requirements

To test Starklens-AI locally:

- Create a `env` file and enter your [OPENAI_API_KEY]() key
- Access the API endpoint (`http://localhost:3000/api/query`)
