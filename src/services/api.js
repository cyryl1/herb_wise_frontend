/**
 * API service for HerbWise backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://herb-wise-78478823031.europe-west1.run.app';

/**
 * Format markdown-style text from backend to HTML-friendly JSX structure
 * Handles: **bold**, numbered lists, bullet points, ⚠️ warnings
 * @param {string} text - Raw text from backend
 * @returns {string} Formatted text with HTML entities
 */
export const formatBackendMessage = (text) => {
  if (!text) return '';
  
  let formatted = text;
  
  // Convert **bold text** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert numbered lists (e.g., "1. ") with proper spacing
  formatted = formatted.replace(/(\d+)\.\s+/g, '<br/><br/><strong>$1. </strong>');
  
  // Convert bullet points (* ) to bullets with slight indent
  formatted = formatted.replace(/\*\s+/g, '<br/>  &nbsp;&nbsp;• ');
  
  // Add spacing before warning emoji
  formatted = formatted.replace(/(⚠️)/g, '<br/><br/>$1');
  
  // Preserve paragraph breaks (double line breaks)
  formatted = formatted.replace(/\n\n+/g, '<br/><br/>');
  
  // Remove single line breaks that break up sentences
  formatted = formatted.replace(/\n/g, ' ');
  
  // Clean up multiple consecutive breaks
  formatted = formatted.replace(/(<br\/>){3,}/g, '<br/><br/>');
  
  // Trim whitespace
  formatted = formatted.trim();
  
  return formatted;
};

/**
 * Download and convert Cloudinary image to base64
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<string|null>} Base64 encoded image or null if URL is empty
 */
export const downloadCloudinaryImage = async (imageUrl) => {
  // Return null if image URL is empty or invalid
  if (!imageUrl || imageUrl.trim() === '') {
    console.log('⚠️ No image URL provided, skipping download');
    return null;
  }

  try {
    console.log('📥 Downloading image from:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('❌ Error downloading image:', error);
    return null; // Return null on error
  }
};

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
    
    // Only include fields that have values
    if (textInput) requestBody.text_input = textInput;
    if (conversationId) requestBody.conversation_id = conversationId;
    if (imageBase64) requestBody.image_base64 = imageBase64;

    console.log('🚀 Sending request to:', `${API_BASE_URL}/chat/`);
    console.log('Request Body:', requestBody);
    console.log('📤 Request body keys:', Object.keys(requestBody));

    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error sending chat message:', error);
    throw error;
  }
};

/**
 * Transform backend response to frontend message format
 * @param {Object} backendResponse - Response from backend
 * @param {string} sender - 'ai' 
 * @returns {Promise<Object>} Formatted message object with downloaded images
 */
export const transformBackendResponse = async (backendResponse, sender = 'ai') => {
  const message = {
    id: backendResponse.message_id || Date.now(),
    sender,
    timestamp: backendResponse.timestamp || new Date().toISOString(),
  };

  // Handle image response (herb identification)
  if (backendResponse.response_type === 'image' && backendResponse.image_message) {
    const imgMsg = backendResponse.image_message;
    message.text = formatBackendMessage(imgMsg.text_content) || "I've identified this herb. Click the card below for details.";
    
    // Use Cloudinary image if available, otherwise fallback to base64 from backend
    let imageBase64 = null;
    if (imgMsg.image_url && imgMsg.image_url.trim() !== '') {
      imageBase64 = await downloadCloudinaryImage(imgMsg.image_url);
    } else if (imgMsg.image_base64) {
      imageBase64 = imgMsg.image_base64;
    }
    
    message.herbInfo = {
      name: imgMsg.name,
      scientificName: imgMsg.scientific_name,
      localNames: imgMsg.local_names || [],
      image: imageBase64, // Use downloaded base64 image
      uses: imgMsg.uses || [],
      benefits: imgMsg.benefits || [],
      preparation: imgMsg.preparation || [],
      safety: imgMsg.safety || [],
    };
  }

  // Handle text response (conversational)
  if (backendResponse.response_type === 'text' && backendResponse.text_message) {
    const txtMsg = backendResponse.text_message;
    message.text = formatBackendMessage(txtMsg.text_content);
    
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
    // Set text from image_message.text_content if available, otherwise from text_message
    if (backendResponse.image_message?.text_content) {
      message.text = formatBackendMessage(backendResponse.image_message.text_content);
    } else if (backendResponse.text_message?.text_content) {
      message.text = formatBackendMessage(backendResponse.text_message.text_content);
    }

    // Process herb info if image_message exists
    if (backendResponse.image_message) {
      const imgMsg = backendResponse.image_message;
      
      // Use Cloudinary image if available, otherwise fallback to base64 from backend
      let imageBase64 = null;
      if (imgMsg.image_url && imgMsg.image_url.trim() !== '') {
        imageBase64 = await downloadCloudinaryImage(imgMsg.image_url);
      } else if (imgMsg.image_base64) {
        imageBase64 = imgMsg.image_base64;
      }
      
      message.herbInfo = {
        name: imgMsg.name,
        scientificName: imgMsg.scientific_name,
        localNames: imgMsg.local_names || [],
        image: imageBase64, // Will be null if no image URL
        uses: imgMsg.uses || [],
        benefits: imgMsg.benefits || [],
        preparation: imgMsg.preparation || [],
        safety: imgMsg.safety || [],
      };
    }
  }

  return message;
};
