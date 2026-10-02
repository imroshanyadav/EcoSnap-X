"""
YOLOv8 Waste Classification & Detection Script
Model weights from https://github.com/teamsmcorg/Waste-Classification-using-YOLOv8
Classes (6 Roboflow categories):
0: BIODEGRADABLE
1: CARDBOARD
2: GLASS
3: METAL
4: PAPER
5: PLASTIC
"""

import sys
import os
import json

CLASS_NAMES = [
    "BIODEGRADABLE",
    "CARDBOARD",
    "GLASS",
    "METAL",
    "PAPER",
    "PLASTIC"
]

def predict(image_path, weights_path=None):
    if weights_path is None:
        weights_path = os.path.join(os.path.dirname(__file__), "best.pt")

    if not os.path.exists(weights_path):
        return {
            "error": f"Model weights not found at {weights_path}"
        }

    try:
        from ultralytics import YOLO
        model = YOLO(weights_path)
        results = model.predict(source=image_path, conf=0.35, save=False, verbose=False)
        
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                label = CLASS_NAMES[cls_id] if cls_id < len(CLASS_NAMES) else f"class_{cls_id}"
                
                detections.append({
                    "category": label,
                    "confidence": round(confidence * 100, 1),
                    "box": {
                        "x1": round(xyxy[0], 1),
                        "y1": round(xyxy[1], 1),
                        "x2": round(xyxy[2], 1),
                        "y2": round(xyxy[3], 1)
                    }
                })
        
        return {
            "status": "success",
            "model": "YOLOv8-Waste (teamsmcorg)",
            "weights": weights_path,
            "detections": detections,
            "count": len(detections)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python predict.py <image_path> [weights_path]"}))
        sys.exit(1)
        
    img_path = sys.argv[1]
    w_path = sys.argv[2] if len(sys.argv) > 2 else None
    res = predict(img_path, w_path)
    print(json.dumps(res, indent=2))
