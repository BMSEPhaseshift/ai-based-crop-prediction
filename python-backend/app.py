from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.preprocessing import LabelEncoder

# Initialize Flask app and enable CORS
app = Flask(__name__)
cors = CORS(app, resources=r'/*', origins='*', allow_headers='*', methods=['GET', 'POST', 'PUT', 'DELETE'], expose_headers='*', max_age=3600)

# Load the dataset
data = pd.read_csv("india_crop_data_with_sustainability_hf.csv")

# Preprocess data
X = data[['Region (State)', 'Avg Temp (°C)', 'Humidity (%)', 'Rainfall (mm)', 'Soil Type', 'Soil Quality Index']]
X = pd.get_dummies(X)  # Encode categorical features

# Prepare target variables
label_encoder = LabelEncoder()
data['Crop Name'] = label_encoder.fit_transform(data['Crop Name'])

y_classification = data['Crop Name']  # For crop name classification
y_regression = data[['Crop Yield (tons/hectare)', 'Sustainability Score', 'Water Efficiency']]  # For regression

# Train-test split
X_train, X_test, y_train_class, y_test_class = train_test_split(X, y_classification, test_size=0.2, random_state=42)
_, _, y_train_reg, y_test_reg = train_test_split(X, y_regression, test_size=0.2, random_state=42)

# Train models
classifier = RandomForestClassifier()
classifier.fit(X_train, y_train_class)

regressor = MultiOutputRegressor(RandomForestRegressor())
regressor.fit(X_train, y_train_reg)

# Evaluate models
y_pred_class = classifier.predict(X_test)
y_pred_reg = regressor.predict(X_test)

classification_accuracy = accuracy_score(y_test_class, y_pred_class)
regression_error = mean_squared_error(y_test_reg, y_pred_reg, multioutput='raw_values')

print(f"Classification Accuracy (Crop Name): {classification_accuracy}")
print(f"Regression MSE (Yield, Sustainability Score, Water Efficiency): {regression_error}")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print(data)
    if 'input' not in data or len(data['input']) != 6:
        return jsonify({"error": "Invalid input format. Expected 6 features."}), 400
    print("just checking")
    input_df = pd.DataFrame([data['input']], columns=['Region (State)', 'Avg Temp (°C)', 'Humidity (%)', 'Rainfall (mm)', 'Soil Type', 'Soil Quality Index'])
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=X.columns, fill_value=0)
    
    # Classification prediction with probabilities
    probabilities = classifier.predict_proba(input_df)
    
    # Get top N predictions
    top_n = 3
    top_indices = np.argsort(probabilities[0])[-top_n:][::-1]
    top_crops = label_encoder.inverse_transform(top_indices)

    # Regression prediction
    regression_pred = regressor.predict(input_df)
    print("checking 2nd")
    return jsonify({
        'top_crops': top_crops.tolist(),
        'yield': regression_pred[0][0],
        'sustainability_score': regression_pred[0][1],
        'water_efficiency': regression_pred[0][2],
    })

if __name__ == '__main__':
    app.run(debug=True)  # Ensure this is present to run the server in debug mode.