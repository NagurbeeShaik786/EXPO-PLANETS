import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

class ExoplanetVisualizer:
    def __init__(self):
        sns.set_style('darkgrid')
        plt.rcParams['figure.figsize'] = (12, 8)

    def plot_orbital_periods(self, data, save_path=None):
        fig, ax = plt.subplots()
        ax.hist(data['koi_period'].dropna(), bins=50, edgecolor='black')
        ax.set_xlabel('Orbital Period (days)')
        ax.set_ylabel('Frequency')
        ax.set_title('Distribution of Exoplanet Orbital Periods')
        ax.set_xscale('log')

        if save_path:
            plt.savefig(save_path)
        else:
            plt.show()

        plt.close()

    def plot_planet_radii(self, data, save_path=None):
        fig, ax = plt.subplots()
        ax.hist(data['koi_prad'].dropna(), bins=50, edgecolor='black')
        ax.set_xlabel('Planet Radius (Earth radii)')
        ax.set_ylabel('Frequency')
        ax.set_title('Distribution of Exoplanet Radii')

        if save_path:
            plt.savefig(save_path)
        else:
            plt.show()

        plt.close()

    def plot_classification_distribution(self, predictions, save_path=None):
        classifications = [p['classification'] for p in predictions]

        fig, ax = plt.subplots()
        ax.bar(range(len(classifications)), classifications)
        ax.set_xlabel('Classification')
        ax.set_ylabel('Count')
        ax.set_title('Exoplanet Classification Distribution')

        if save_path:
            plt.savefig(save_path)
        else:
            plt.show()

        plt.close()
