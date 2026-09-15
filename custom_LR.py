import numpy as np
from utils import *
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib


# Initialize parameters.
# Learning rate
# Batch size
# Number of iteration

class LogisticRegression:
    
    # Initialize parameters.
    # Learning rate
    # Batch size
    # Number of iteration

    def __init__(self, learning_rate=0.001, number_i=1000):
        self.lr = learning_rate
        self.number_i = number_i # number of iterations during training
        self.weights = None
        self.bias = None
        self.losses = []
         
    #Sigmoid method
    #transforms values to a value between 0 and 1. large value closer to 1 and smaller values closer to 0
    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    # binary cross entropy
    #sees how well my algorithm is.
    #if my predictions are very wrong the loss will be big and if its closer to the right value it will be smaller
    
    def compute_loss(self, y_true_value, y_p):
        epsilon = 1e-9
        y1 = y_true_value * np.log(y_p + epsilon)
        y2 = (1-y_true_value) * np.log(1 - y_p + epsilon)
        return -np.mean(y1 + y2)

    #finds line of best fit of the data.

    def fit(self, X, y):
        n_samples, n_features = X.shape

        # init parameters
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        z = np.dot(X, self.weights) + self.bias # linear function
        A = self._sigmoid(z) # trasforming it with sigmoid
        
        
        # gradient descent
        for _ in range(self.number_i):
            self.losses.append(self.compute_loss(y,A))
            dz = A - y # derivative of sigmoid 
            
            # compute gradients with respect to weight and bias
            dw = (1 / n_samples) * np.dot(X.T, dz)
            db = (1 / n_samples) * np.sum(dz)
            
            # update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db
    
    
    # predicting using model for a new X value
    def predict(self, X):
        threshold = .5
        y_hat = np.dot(X, self.weights) + self.bias
        y_predicted = self._sigmoid(y_hat)
        y_predicted_cls = [1 if i > threshold else 0 for i in y_predicted]
        
        return np.array(y_predicted_cls)

file_path = './dataset3.csv'
df = pd.read_csv(file_path)

data = df.values

x = data[:, :2]

# Selecting the third column as the target variable (y)
y = data[:, 2]

# Splitting the data into training and testing sets
# 80% for training and 20% for testing, with a fixed random seed for reproducibility
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

model = LogisticRegression(learning_rate=0.000001, number_i=1000000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(accuracy)

joblib.dump(model, 'logistic_model.pkl')