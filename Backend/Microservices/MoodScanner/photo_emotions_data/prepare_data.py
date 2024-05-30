import os
import cv2
import numpy as np
from utils import get_face_landmarks, get_emotion_from_dict


def process_image(image, emotion_index):
    face_landmarks = get_face_landmarks(image)

    if len(face_landmarks) == 1404:
        face_landmarks.append(emotion_index)
        return face_landmarks
    return None


def process_images(input_dir_name, file_paths, total_files):
    output = []
    processed_files = 0

    for emotion, image_file in file_paths:
        emotion_index = get_emotion_from_dict(emotion)
        image_path = os.path.join(input_dir_name, emotion, image_file)
        image = cv2.imread(image_path)
        face_landmarks = process_image(image, emotion_index)

        progress_percentage = (processed_files / total_files) * 100
        print(f"({progress_percentage:.2f}%) Processing: {image_path} with emotion: {emotion} and index: {emotion_index}")

        if face_landmarks:
            output.append(face_landmarks)

        processed_files += 1

    return output, processed_files


def get_face_landmarks_data(input_dir_name, dest_file_name):
    file_counts = {}
    file_paths = []
    for emotion in sorted(os.listdir(input_dir_name)):
        if emotion not in emotion_dict:
            continue
        files = sorted(os.listdir(os.path.join(input_dir_name, emotion)))
        file_paths.extend([(emotion, file) for file in files])
        file_counts[emotion] = len(files)

    total_files = len(file_paths)

    output, processed_files = process_images(input_dir_name, file_paths, total_files)

    np.savetxt(dest_file_name, np.asarray(output))


# get_face_landmarks_data("./data_files/train", "./data_files/train_data.txt")
# get_face_landmarks_data("./data_files/test", "./data_files/test_data.txt")
