import cv2
import mediapipe as mp
import numpy as np
from matplotlib import pyplot as plt


def get_face_landmarks(image):

    if len(image.shape) == 2 or image.shape[2] == 1:
        image_input_rgb = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    else:
        image_input_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    face_mesh = mp.solutions.face_mesh.FaceMesh(static_image_mode=True,
                                                max_num_faces=1,
                                                min_detection_confidence=0.5)

    results = face_mesh.process(image_input_rgb)
    image_landmarks = []

    if results.multi_face_landmarks:
        ls_single_face = results.multi_face_landmarks[0].landmark
        xs_ = []
        ys_ = []
        zs_ = []
        for idx in ls_single_face:
            xs_.append(idx.x)
            ys_.append(idx.y)
            zs_.append(idx.z)
        for j in range(len(xs_)):
            image_landmarks.append(xs_[j])
            image_landmarks.append(ys_[j])
            image_landmarks.append(zs_[j])

    face_mesh.close()
    return image_landmarks


emotion_dict = {
    "anger": 0,
    "disgust": 1,
    "fear": 2,
    "joy": 3,
    "neutral": 4,
    "sadness": 5,
    "surprise": 6
}


def get_emotion_from_dict(key):
    if isinstance(key, int):
        reversed_emotion_dict = {value: key for key, value in emotion_dict.items()}
        return reversed_emotion_dict[key]

    return emotion_dict[key]


def test_get_face_landmarks(img_path):
    example_image = cv2.imread(img_path)

    # Process the example image
    example_landmarks = get_face_landmarks(example_image)

    if example_landmarks:
        print(f"Landmarks for example image: {example_landmarks[:10]}... (total {len(example_landmarks)} values)")
    else:
        print("No landmarks detected for the example image")

    # Visualize the landmarks on the image
    if example_landmarks:
        xs = example_landmarks[0::3]
        ys = example_landmarks[1::3]

        plt.imshow(cv2.cvtColor(example_image, cv2.COLOR_BGR2RGB))
        plt.scatter(np.array(xs) * example_image.shape[1], np.array(ys) * example_image.shape[0], c='r', s=2)
        plt.show()
