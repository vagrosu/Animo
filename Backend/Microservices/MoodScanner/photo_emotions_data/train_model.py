import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import GridSearchCV


def load_data(filename):
    data = np.loadtxt(filename)
    X = data[:, :-1]
    label = data[:, -1]
    return X, label


def train_model(train_data_file_path, test_data_file_path):
    X_train, label_train = load_data(train_data_file_path)
    X_test, label_test = load_data(test_data_file_path)

    param_grid = {
        'bootstrap': [True, False],
        'max_depth': [10, 20, 30, 40],
        'max_features': ['auto', 'sqrt'],
        'min_samples_leaf': [1, 2, 4, 10],
        'min_samples_split': [2, 5, 10, 20],
        'n_estimators': [100, 200, 300, 500],
    }

    rf = RandomForestClassifier()
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=3)
    grid_search.fit(X_train, label_train)

    means = grid_search.cv_results_['mean_test_score']
    stds = grid_search.cv_results_['std_test_score']
    params = grid_search.cv_results_['params']

    print("Grid Search Results:")
    for mean, std, param in zip(means, stds, params):
        print(f"{param} -> Mean accuracy: {mean:.4f}, Std: {std:.4f}")

    best_rf = grid_search.best_estimator_
    y_pred = best_rf.predict(X_test)
    accuracy = accuracy_score(label_test, y_pred)
    print(f"Optimized Accuracy: {accuracy * 100:.2f}%")
    print("Confusion Matrix:")
    print(confusion_matrix(label_test, y_pred))

    with open('./best_rf_model.pkl', 'wb') as f:
        pickle.dump(best_rf, f)

    print("Model saved to best_rf_model.pkl")
