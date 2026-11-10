"""
Model Training Script for Student Academic Performance & Risk Prediction
Uses: NumPy, Pandas, Scikit-learn, Joblib
Algorithms: RandomForestRegressor (Score/GPA) & RandomForestClassifier (Risk Level)
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

def generate_synthetic_academic_dataset(n_samples=2500, random_state=42):
    """
    Generates realistic synthetic data modeling university student academic dynamics:
    - weekly_study_hours: 2.0 to 45.0 hrs
    - topic_completion_ratio: 0.05 to 1.0
    - attendance_rate: 40.0 to 100.0%
    - streak_days: 0 to 60 days
    - pending_tasks: 0 to 25 tasks
    - hard_topic_mastery: 0.0 to 1.0
    - avg_session_duration: 15 to 120 minutes
    """
    np.random.seed(random_state)

    weekly_study_hours = np.random.normal(18.0, 7.5, n_samples).clip(2.0, 45.0)
    topic_completion_ratio = np.random.beta(5, 2.5, n_samples).clip(0.05, 1.0)
    attendance_rate = np.random.normal(82.0, 12.0, n_samples).clip(40.0, 100.0)
    streak_days = np.random.exponential(6.0, n_samples).clip(0, 60).astype(int)
    pending_tasks = np.random.poisson(4.0, n_samples).clip(0, 25)
    hard_topic_mastery = (topic_completion_ratio * 0.85 + np.random.normal(0, 0.08, n_samples)).clip(0.0, 1.0)
    avg_session_duration = np.random.normal(50.0, 18.0, n_samples).clip(15, 120)

    # Core academic performance function with realistic non-linear synergies & noise
    base_score = (
        0.32 * (weekly_study_hours / 40.0 * 100) +
        0.30 * (topic_completion_ratio * 100) +
        0.18 * attendance_rate +
        0.12 * (hard_topic_mastery * 100) +
        0.05 * (np.log1p(streak_days) / np.log1p(30) * 100) -
        0.03 * (pending_tasks * 2.5) +
        np.random.normal(0, 3.5, n_samples)
    )

    exam_score = base_score.clip(35.0, 99.5)
    # GPA on 4.0 scale
    gpa = (exam_score / 25.0).clip(1.5, 4.0)

    # Risk level classification
    risk_level = np.where(
        exam_score >= 75.0, 'Low',
        np.where(exam_score >= 60.0, 'Medium', 'High')
    )

    df = pd.DataFrame({
        'weekly_study_hours': np.round(weekly_study_hours, 1),
        'topic_completion_ratio': np.round(topic_completion_ratio, 2),
        'attendance_rate': np.round(attendance_rate, 1),
        'streak_days': streak_days,
        'pending_tasks': pending_tasks,
        'hard_topic_mastery': np.round(hard_topic_mastery, 2),
        'avg_session_duration': np.round(avg_session_duration, 1),
        'predicted_exam_score': np.round(exam_score, 1),
        'predicted_gpa': np.round(gpa, 2),
        'academic_risk_level': risk_level
    })

    return df

def train_and_export_models():
    print("Generating student performance dataset...")
    df = generate_synthetic_academic_dataset()

    feature_cols = [
        'weekly_study_hours',
        'topic_completion_ratio',
        'attendance_rate',
        'streak_days',
        'pending_tasks',
        'hard_topic_mastery',
        'avg_session_duration'
    ]

    X = df[feature_cols]
    y_score = df['predicted_exam_score']
    y_gpa = df['predicted_gpa']
    y_risk = df['academic_risk_level']

    X_train, X_test, y_s_train, y_s_test, y_g_train, y_g_test, y_r_train, y_r_test = train_test_split(
        X, y_score, y_gpa, y_risk, test_size=0.2, random_state=42
    )

    # 1. Regressor for Exam Score
    score_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42))
    ])
    score_pipeline.fit(X_train, y_s_train)
    score_preds = score_pipeline.predict(X_test)
    r2_score_val = r2_score(y_s_test, score_preds)
    rmse_score_val = np.sqrt(mean_squared_error(y_s_test, score_preds))
    print(f"Exam Score Regressor - R^2 Score: {r2_score_val:.4f}, RMSE: {rmse_score_val:.2f}")

    # 2. Regressor for GPA
    gpa_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42))
    ])
    gpa_pipeline.fit(X_train, y_g_train)
    gpa_preds = gpa_pipeline.predict(X_test)
    r2_gpa_val = r2_score(y_g_test, gpa_preds)
    print(f"GPA Regressor - R^2 Score: {r2_gpa_val:.4f}")

    # 3. Classifier for Academic Risk
    risk_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
    ])
    risk_pipeline.fit(X_train, y_r_train)
    risk_preds = risk_pipeline.predict(X_test)
    acc_risk_val = accuracy_score(y_r_test, risk_preds)
    print(f"Risk Classifier - Accuracy: {acc_risk_val * 100:.2f}%")

    # Feature Importance analysis
    rf_model = score_pipeline.named_steps['rf']
    feature_importances = dict(zip(feature_cols, [round(float(v), 4) for v in rf_model.feature_importances_]))
    print(f"Feature Importances: {feature_importances}")

    bundle = {
        'score_model': score_pipeline,
        'gpa_model': gpa_pipeline,
        'risk_model': risk_pipeline,
        'feature_cols': feature_cols,
        'feature_importances': feature_importances,
        'metrics': {
            'score_r2': round(float(r2_score_val), 4),
            'gpa_r2': round(float(r2_gpa_val), 4),
            'risk_accuracy': round(float(acc_risk_val), 4)
        }
    }

    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, 'model.joblib')
    joblib.dump(bundle, model_path)
    print(f"Models successfully saved to: {model_path}")

if __name__ == '__main__':
    train_and_export_models()

