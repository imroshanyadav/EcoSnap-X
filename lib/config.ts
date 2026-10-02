// EcoSnap-X Configuration
// Deep Learning Waste Assistant powered by YOLOv8 & Computer Vision
// Zero API keys required - 100% Free & Open-Source

export const AI_CONFIG = {
  modelName: "YOLOv8-Waste (teamsmcorg)",
  architecture: "YOLOv8s Deep Neural Network",
  dataset: "Roboflow Waste Classification (6,000+ Annotated Images)",
  classes: ["BIODEGRADABLE", "CARDBOARD", "GLASS", "METAL", "PAPER", "PLASTIC"],
  isApiKeyRequired: false,
  freeResourcesIncluded: [
    "YOLOv8 Deep Learning Model (teamsmcorg/Waste-Classification-using-YOLOv8)",
    "Client-Side Real-Time Computer Vision Inference",
    "Local Natural Language Waste Disposal Assistant",
    "OpenStreetMap / Leaflet Eco-Recycling Facilities Map",
  ],
};

// Legacy placeholders kept for backwards compatibility (optional)
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
export const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || "";
