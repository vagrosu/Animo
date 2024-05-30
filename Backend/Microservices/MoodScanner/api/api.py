import pickle
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from photo_emotions_data.utils import get_face_landmarks, emotion_dict
from config import Config

app = Flask(__name__)
app.config.from_object(Config)


def load_model():
    with open(app.config['MODEL_PATH'], 'rb') as f:
        model = pickle.load(f)
    return model


def detect_face_emotion_response(is_success=True, message=None, **emotions):
    response = {
        "success": is_success,
        "message": message,
        "detectedEmotions": {emotion: 0.0 for emotion in emotion_dict.keys()}
    }

    if emotions:
        for key in list(emotion_dict.keys()):
            if key in list(emotions.keys()):
                response["detectedEmotions"][key] = emotions[key]
            else:
                response["detectedEmotions"][key] = 0.0

    return jsonify(response)


@app.route('/detect_face_emotion', methods=['POST'])
def detect_face_emotion():
    if 'image' not in request.files:
        return detect_face_emotion_response(is_success=False, message="No image provided"), 400

    try:
        file_storage = request.files['image']
        image = np.array(Image.open(file_storage))
        landmarks = get_face_landmarks(image)
        if len(landmarks) != 1404:
            return detect_face_emotion_response(is_success=False, message="No face detected"), 400

        probabilities = model.predict_proba(np.array(landmarks).reshape(1, -1))[0]
        emotion_probs = {emotion: prob for emotion, prob in zip(emotion_dict.keys(), probabilities)}
        return detect_face_emotion_response(**emotion_probs)
    except Exception as e:
        print(f"Exception: {e}")
        return detect_face_emotion_response(is_success=False, message=str(e)), 500


if __name__ == '__main__':
    model = load_model()
    app.run(port=5000, debug=True)
