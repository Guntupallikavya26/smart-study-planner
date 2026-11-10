import sys
from main import (
    health_check,
    predict_performance,
    identify_weak_subjects,
    get_recommendations,
    get_progress_analysis,
    StudentFeatures,
    SubjectInput,
    StudyAnalysisRequest
)

def test_functions():
    print("Testing health_check()...")
    health = health_check()
    print("Health:", health)
    assert health["status"] == "UP"
    assert health["model_loaded"] is True

    print("\nTesting predict_performance()...")
    features = StudentFeatures(
        weekly_study_hours=24.5,
        topic_completion_ratio=0.78,
        attendance_rate=92.0,
        streak_days=8,
        pending_tasks=3,
        hard_topic_mastery=0.70,
        avg_session_duration=50.0
    )
    pred = predict_performance(features)
    print("Prediction:", pred)
    assert pred["predicted_exam_score"] > 60.0
    assert pred["predicted_gpa"] > 2.5
    assert pred["academic_risk_level"] in ["Low", "Medium", "High"]

    print("\nTesting identify_weak_subjects()...")
    subjects = [
        SubjectInput(
            id=1,
            code="MATH301",
            name="Advanced Calculus",
            difficulty="Hard",
            daysUntilExam=12,
            totalTopics=8,
            completedTopics=3,
            topics=[
                {"title": "Triple Integrals", "completed": False, "difficulty": "Hard"},
                {"title": "Green's Theorem", "completed": False, "difficulty": "Hard"},
                {"title": "Partial Derivatives", "completed": True, "difficulty": "Medium"}
            ]
        ),
        SubjectInput(
            id=2,
            code="CS201",
            name="Data Structures",
            difficulty="Medium",
            daysUntilExam=28,
            totalTopics=6,
            completedTopics=5,
            topics=[]
        )
    ]
    weak = identify_weak_subjects(subjects)
    print("Weak Subjects:", weak)
    assert len(weak["weak_subjects"]) == 2
    assert weak["weak_subjects"][0]["code"] == "MATH301", "MATH301 should be identified as more vulnerable"

    print("\nTesting get_recommendations()...")
    req = StudyAnalysisRequest(
        student_id=1,
        features=features,
        subjects=subjects
    )
    recs = get_recommendations(req)
    print("Recommendations:", recs)
    assert len(recs["recommendations"]) > 0

    print("\nTesting get_progress_analysis()...")
    prog = get_progress_analysis(req)
    print("Progress Analysis:", prog)
    assert prog["momentum_score"] > 50

    print("\n=======================================================")
    print("ALL 5 DATA SCIENCE & ML CAPABILITIES VERIFIED 100% OK!")
    print("=======================================================")

if __name__ == "__main__":
    test_functions()
