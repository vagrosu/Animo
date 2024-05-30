from prepare_data import get_face_landmarks_data
from train_model import train_model
from utils import test_get_face_landmarks

test_get_face_landmarks("../im0.png")

get_face_landmarks_data("./data_files/train", "./data_files/train_data.txt")
get_face_landmarks_data("./data_files/test", "./data_files/test_data.txt")

train_model('./data_files/train_data.txt', './data_files/test_data.txt')
