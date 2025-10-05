from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score
)
import numpy as np

class ModelEvaluator:
    def __init__(self):
        self.metrics = {}

    def evaluate(self, y_true, y_pred, y_proba=None):
        self.metrics['accuracy'] = accuracy_score(y_true, y_pred)
        self.metrics['precision'] = precision_score(y_true, y_pred, average='weighted', zero_division=0)
        self.metrics['recall'] = recall_score(y_true, y_pred, average='weighted', zero_division=0)
        self.metrics['f1_score'] = f1_score(y_true, y_pred, average='weighted', zero_division=0)

        self.metrics['confusion_matrix'] = confusion_matrix(y_true, y_pred).tolist()

        self.metrics['classification_report'] = classification_report(
            y_true, y_pred,
            target_names=['FALSE_POSITIVE', 'CANDIDATE', 'CONFIRMED'],
            output_dict=True
        )

        if y_proba is not None and len(np.unique(y_true)) > 2:
            try:
                self.metrics['roc_auc'] = roc_auc_score(y_true, y_proba, multi_class='ovr', average='weighted')
            except:
                pass

        return self.metrics

    def get_summary(self):
        summary = {
            'accuracy': self.metrics.get('accuracy', 0),
            'precision': self.metrics.get('precision', 0),
            'recall': self.metrics.get('recall', 0),
            'f1_score': self.metrics.get('f1_score', 0)
        }
        return summary

    def print_report(self):
        print("Model Evaluation Metrics")
        print("=" * 50)
        print(f"Accuracy:  {self.metrics.get('accuracy', 0):.4f}")
        print(f"Precision: {self.metrics.get('precision', 0):.4f}")
        print(f"Recall:    {self.metrics.get('recall', 0):.4f}")
        print(f"F1 Score:  {self.metrics.get('f1_score', 0):.4f}")

        if 'roc_auc' in self.metrics:
            print(f"ROC AUC:   {self.metrics['roc_auc']:.4f}")

        print("\nConfusion Matrix:")
        print(np.array(self.metrics.get('confusion_matrix', [])))
