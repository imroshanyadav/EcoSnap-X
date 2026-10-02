// Waste Classification via Deep Learning
// Zero API key required - Local Neural Inference
import { analyzeImageWithYOLOv8, WasteDetectionResult } from './waste-model';

export interface WasteClassificationResult {
  type: string;
  confidence: number;
  instructions: string;
  recyclable: boolean;
  category: string;
  binColor?: string;
  ecoPoints?: number;
  decompositionTime?: string;
  carbonImpact?: string;
  modelUsed?: string;
  box?: { x: number; y: number; width: number; height: number };
}

export async function classifyWaste(imageData: string): Promise<WasteClassificationResult> {
  const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || "";
  
  // If user provided a custom Hugging Face key in .env, optionally try ViT inference
  if (apiKey && apiKey !== "your_huggingface_api_key_here") {
    try {
      const base64Data = imageData.includes(",") ? imageData.split(",")[1] : imageData;
      const binaryData = atob(base64Data);
      const uint8Array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: "image/jpeg" });

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

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          const top = result[0];
          const label = top.label || "Waste";
          return {
            type: label,
            confidence: Math.round((top.score || 0.85) * 100),
            instructions: "Sort into proper recycling stream based on material composition.",
            recyclable: true,
            category: "Recyclable",
            modelUsed: "Vision Transformer (ViT-Base)",
          };
        }
      }
    } catch (e) {
      console.warn("HuggingFace inference skipped, falling back to local YOLOv8:", e);
    }
  }

  // Real Deep Learning model (YOLOv8 6-Class Roboflow Model)
  const dlResult: WasteDetectionResult = await analyzeImageWithYOLOv8(imageData);
  const item = dlResult.primaryItem;

  return {
    type: item.label,
    confidence: item.confidence,
    instructions: item.instructions,
    recyclable: item.recyclable,
    category: item.category,
    binColor: item.binColor,
    ecoPoints: item.ecoPoints,
    decompositionTime: item.decompositionTime,
    carbonImpact: item.carbonImpact,
    modelUsed: dlResult.modelName,
    box: item.box,
  };
}
