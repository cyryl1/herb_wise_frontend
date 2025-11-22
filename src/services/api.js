/**
 * API service for HerbWise backend communication
 */

const API_BASE_URL = import.meta.env.BASE_URL || 'http://127.0.0.1:8000';

/**
 * Send a message to the HerbWise chat API
 * @param {Object} params - Request parameters
 * @param {string} [params.textInput] - Text message
 * @param {string} [params.conversationId] - Conversation ID (omit for first message)
 * @param {string} [params.imageBase64] - Base64 encoded image
 * @returns {Promise<Object>} API response
 */
export const sendChatMessage = async ({ textInput, conversationId, imageBase64 }) => {
  try {
    const requestBody = {};
    
    if (textInput) requestBody.text_input = textInput;
    if (conversationId) requestBody.conversation_id = conversationId;
    if (imageBase64) requestBody.image_base64 = imageBase64;

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

/**
 * Transform backend response to frontend message format
 * @param {Object} backendResponse - Response from backend
 * @param {string} sender - 'ai' 
 * @returns {Object} Formatted message object
 */
export const transformBackendResponse = (backendResponse, sender = 'ai') => {
  const message = {
    id: backendResponse.message_id || Date.now(),
    sender,
    timestamp: backendResponse.timestamp || new Date().toISOString(),
  };

  // Handle image response (herb identification)
  if (backendResponse.response_type === 'image' && backendResponse.image_message) {
    const imgMsg = backendResponse.image_message;
    message.text = imgMsg.text_content || "I've identified this herb. Click the card below for details.";
    message.herbInfo = {
      name: imgMsg.name,
      scientificName: imgMsg.scientific_name,
      localNames: imgMsg.local_names || [],
      image: imgMsg.image_url,
      uses: imgMsg.uses || [],
      benefits: imgMsg.benefits || [],
      preparation: imgMsg.preparation || [],
      safety: imgMsg.safety || [],
    };
  }

  // Handle text response (conversational)
  if (backendResponse.response_type === 'text' && backendResponse.text_message) {
    const txtMsg = backendResponse.text_message;
    message.text = txtMsg.text_content;
    
    // Optionally store sources and suggested plants
    if (txtMsg.sources && txtMsg.sources.length > 0) {
      message.sources = txtMsg.sources;
    }
    if (txtMsg.suggested_plants && txtMsg.suggested_plants.length > 0) {
      message.suggestedPlants = txtMsg.suggested_plants;
    }
  }

  // Handle hybrid response
  if (backendResponse.response_type === 'hybrid') {
    if (backendResponse.image_message) {
      const imgMsg = backendResponse.image_message;
      message.herbInfo = {
        name: imgMsg.name,
        scientificName: imgMsg.scientific_name,
        localNames: imgMsg.local_names || [],
        image: imgMsg.image_url,
        uses: imgMsg.uses || [],
        benefits: imgMsg.benefits || [],
        preparation: imgMsg.preparation || [],
        safety: imgMsg.safety || [],
      };
    }
    if (backendResponse.text_message) {
      message.text = backendResponse.text_message.text_content;
    }
  }

  return message;
};
