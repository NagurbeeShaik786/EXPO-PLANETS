import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

class EDAUtils:
    @staticmethod
    def generate_summary_stats(df):
        summary = {
            'shape': {'rows': int(df.shape[0]), 'columns': int(df.shape[1])},
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict(),
            'memory_usage': int(df.memory_usage(deep=True).sum())
        }

        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            summary['numeric_stats'] = numeric_df.describe().to_dict()

        return summary

    @staticmethod
    def plot_to_base64(fig):
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        return img_base64

    @staticmethod
    def create_distribution_plot(df, column):
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.histplot(df[column].dropna(), kde=True, ax=ax)
        ax.set_title(f'Distribution of {column}')
        ax.set_xlabel(column)
        ax.set_ylabel('Frequency')
        return EDAUtils.plot_to_base64(fig)

    @staticmethod
    def create_correlation_heatmap(df):
        numeric_df = df.select_dtypes(include=[np.number])

        if numeric_df.shape[1] < 2:
            return None

        fig, ax = plt.subplots(figsize=(12, 10))
        correlation = numeric_df.corr()
        sns.heatmap(correlation, annot=True, fmt='.2f', cmap='coolwarm', ax=ax, cbar_kws={'shrink': 0.8})
        ax.set_title('Feature Correlation Heatmap')
        return EDAUtils.plot_to_base64(fig)

    @staticmethod
    def create_missing_values_plot(df):
        missing = df.isnull().sum()
        missing = missing[missing > 0].sort_values(ascending=False)

        if missing.empty:
            return None

        fig, ax = plt.subplots(figsize=(10, 6))
        missing.plot(kind='bar', ax=ax)
        ax.set_title('Missing Values by Column')
        ax.set_xlabel('Column')
        ax.set_ylabel('Number of Missing Values')
        plt.xticks(rotation=45, ha='right')
        return EDAUtils.plot_to_base64(fig)

    @staticmethod
    def generate_full_report(df):
        report = {
            'summary': EDAUtils.generate_summary_stats(df),
            'plots': {}
        }

        numeric_cols = df.select_dtypes(include=[np.number]).columns[:5]
        for col in numeric_cols:
            try:
                report['plots'][f'{col}_distribution'] = EDAUtils.create_distribution_plot(df, col)
            except:
                pass

        try:
            corr_plot = EDAUtils.create_correlation_heatmap(df)
            if corr_plot:
                report['plots']['correlation'] = corr_plot
        except:
            pass

        try:
            missing_plot = EDAUtils.create_missing_values_plot(df)
            if missing_plot:
                report['plots']['missing_values'] = missing_plot
        except:
            pass

        return report
