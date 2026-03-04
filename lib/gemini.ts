// Google Gemini Vision API integration for waste classification
import { GEMINI_API_KEY } from './config';

export interface WasteClassificationResult {
  type: string;
  confidence: number;
  instructions: string;
  recyclable: boolean;
  category: string;
  description: string;
}

export async function classifyWasteWithGemini(imageData: string): Promise<WasteClassificationResult> {
  const apiKey = GEMINI_API_KEY;
  
  console.log("Gemini API Key present:", apiKey ? "Yes" : "No");
  
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("Google Gemini API key not configured. Get a free key from https://makersuite.google.com/app/apikey");
  }

  try {
    // Remove data URL prefix if present
    const base64Data = imageData.includes(',') ? imageData.split(",")[1] : imageData;

    const prompt = `Analyze this image and identify any waste items present. 
    
    Provide a JSON response with the following structure:
    {
      "itemFound": "name of the main waste item in the image",
      "category": "one of: Plastic, Glass, Metal, Paper, Cardboard, Organic Waste, E-Waste, Hazardous Waste, General Waste",
      "recyclable": true or false,
      "confidence": number between 0-100,
      "description": "brief description of what you see in the image",
      "disposalInstructions": "specific instructions on how to properly dispose of this item"
    }
    
    If no waste item is clearly visible, set itemFound to "Unknown" and provide a description of what you see.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Gemini API Response:", result);

    // Extract the text response
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Try to parse JSON from the response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = textResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedData = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse JSON response:", textResponse);
      throw new Error("Failed to parse AI response. Please try again.");
    }

    return {
      type: parsedData.itemFound || "Unknown",
      confidence: parsedData.confidence || 0,
      instructions: parsedData.disposalInstructions || "Unable to determine disposal instructions.",
      recyclable: parsedData.recyclable || false,
      category: parsedData.category || "General Waste",
      description: parsedData.description || "No description available",
    };
  } catch (error) {
    console.error("Error classifying waste with Gemini:", error);
    throw error;
  }
}
