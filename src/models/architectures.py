from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC

class ModelArchitectures:
    @staticmethod
    def get_random_forest(n_estimators=100, max_depth=None, random_state=42):
        return RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=random_state,
            class_weight='balanced',
            n_jobs=-1,
            min_samples_split=5,
            min_samples_leaf=2
        )

    @staticmethod
    def get_gradient_boosting(n_estimators=100, learning_rate=0.1, random_state=42):
        return GradientBoostingClassifier(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            random_state=random_state,
            max_depth=5,
            subsample=0.8
        )

    @staticmethod
    def get_neural_network(hidden_layers=(100, 50), random_state=42):
        return MLPClassifier(
            hidden_layer_sizes=hidden_layers,
            random_state=random_state,
            max_iter=500,
            early_stopping=True,
            validation_fraction=0.1
        )

    @staticmethod
    def get_svm(kernel='rbf', random_state=42):
        return SVC(
            kernel=kernel,
            random_state=random_state,
            probability=True,
            class_weight='balanced'
        )

    @staticmethod
    def get_ensemble(n_estimators=50, random_state=42):
        base_estimator = RandomForestClassifier(
            n_estimators=10,
            max_depth=5,
            random_state=random_state
        )
        return AdaBoostClassifier(
            base_estimator=base_estimator,
            n_estimators=n_estimators,
            random_state=random_state
        )
