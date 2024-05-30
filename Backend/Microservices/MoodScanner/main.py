import pickle
import cv2
import numpy as np
from photo_emotions_data.utils import get_face_landmarks, get_emotion_from_dict


with open('photo_emotions_data/best_rf_model.pkl', 'rb') as f:
    model = pickle.load(f)


cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()


def preprocess_frame(frame):

    landmarks = get_face_landmarks(frame)
    if len(landmarks) == 1404:
        return np.array(landmarks).reshape(1, -1)
    else:
        return None


def draw_probabilities(frame, probs):

    y0, dy = 50, 30
    for i, (emotion, prob) in enumerate(probs.items()):
        text = f"{emotion}: {prob*100:.2f}%"
        y = y0 + i * dy
        cv2.putText(frame, text, (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)


while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    processed_frame = preprocess_frame(frame)

    if processed_frame is not None:

        probabilities = model.predict_proba(processed_frame)[0]
        emotion_probs = {get_emotion_from_dict(i): prob for i, prob in enumerate(probabilities)}

        draw_probabilities(frame, emotion_probs)

    cv2.imshow('Emotion Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
