// Hugging Face API integration for waste classification

export interface WasteClassificationResult {
  type: string;
  confidence: number;
  instructions: string;
  recyclable: boolean;
  category: string;
}

// Waste disposal instructions mapping
const wasteInstructions: Record<string, { instructions: string; recyclable: boolean; category: string }> = {
  plastic: {
    instructions: "Clean, remove cap, and place in the blue recycling bin. Caps can be recycled separately.",
    recyclable: true,
    category: "Plastic",
  },
  glass: {
    instructions: "Rinse thoroughly and place in the green glass recycling bin. Remove any non-glass components.",
    recyclable: true,
    category: "Glass",
  },
  metal: {
    instructions: "Rinse and place in the metal recycling bin. Crush if possible to save space.",
    recyclable: true,
    category: "Metal",
  },
  paper: {
    instructions: "Keep dry and place in paper recycling bin. Remove any plastic components or food residue.",
    recyclable: true,
    category: "Paper",
  },
  cardboard: {
    instructions: "Flatten and place in cardboard recycling bin. Remove any tape or plastic components.",
    recyclable: true,
    category: "Cardboard",
  },
  organic: {
    instructions: "Place in compost bin or organic waste collection. Not suitable for regular recycling.",
    recyclable: false,
    category: "Organic Waste",
  },
  battery: {
    instructions: "Do not place in regular trash. Take to designated e-waste collection point or hazardous waste facility.",
    recyclable: false,
    category: "E-Waste",
  },
  electronic: {
    instructions: "Take to e-waste recycling center. Do not dispose in regular trash due to hazardous materials.",
    recyclable: false,
    category: "E-Waste",
  },
  trash: {
    instructions: "Place in general waste bin. This item cannot be recycled through standard programs.",
    recyclable: false,
    category: "General Waste",
  },
};

// Map common labels to waste categories
function mapLabelToWasteType(label: string): string {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("bottle") || lowerLabel.includes("plastic")) return "plastic";
  if (lowerLabel.includes("glass") || lowerLabel.includes("jar")) return "glass";
  if (lowerLabel.includes("can") || lowerLabel.includes("metal") || lowerLabel.includes("aluminum")) return "metal";
  if (lowerLabel.includes("paper") || lowerLabel.includes("newspaper")) return "paper";
  if (lowerLabel.includes("cardboard") || lowerLabel.includes("box")) return "cardboard";
  if (lowerLabel.includes("food") || lowerLabel.includes("organic") || lowerLabel.includes("fruit") || lowerLabel.includes("vegetable")) return "organic";
  if (lowerLabel.includes("battery")) return "battery";
  if (lowerLabel.includes("electronic") || lowerLabel.includes("phone") || lowerLabel.includes("computer")) return "electronic";
  
  return "trash";
}

export async function classifyWaste(imageData: string): Promise<WasteClassificationResult> {
  const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || "";
  
  console.log("API Key present:", apiKey ? "Yes" : "No");
  
  if (!apiKey || apiKey === "your_huggingface_api_key_here") {
    throw new Error("Hugging Face API key not configured. Please add NEXT_PUBLIC_HUGGINGFACE_API_KEY to .env.local");
  }

  try {
    // Convert base64 to blob
    const base64Data = imageData.split(",")[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    
    const blob = new Blob([uint8Array], { type: "image/jpeg" });

    // Using Google's ViT model for image classification
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: blob,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Hugging Face API error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);
    
    // Get the top prediction
    const topPrediction = result[0];
    const wasteType = mapLabelToWasteType(topPrediction.label);
    const wasteInfo = wasteInstructions[wasteType] || wasteInstructions.trash;

    return {
      type: wasteInfo.category,
      confidence: Math.round(topPrediction.score * 100),
      instructions: wasteInfo.instructions,
      recyclable: wasteInfo.recyclable,
      category: wasteInfo.category,
    };
  } catch (error) {
    console.error("Error classifying waste:", error);
    throw error;
  }
}
