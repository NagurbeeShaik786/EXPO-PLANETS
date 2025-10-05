import numpy as np
import json

class Galaxy3DGenerator:
    def __init__(self, config=None):
        self.config = config or {}
        self.max_planets = self.config.get('max_planets_display', 100)
        self.galaxy_radius = self.config.get('galaxy_radius', 1000)

    def generate_planet_system(self, prediction, index):
        angle = (index / self.max_planets) * 2 * np.pi
        radius = 50 + index * 15

        system = {
            'id': prediction.get('name', f'Planet-{index}'),
            'name': prediction.get('name', f'Planet-{index}'),
            'classification': prediction['classification'],
            'confidence': prediction['confidence'],
            'position': {
                'x': float(np.cos(angle) * radius),
                'y': 0,
                'z': float(np.sin(angle) * radius)
            },
            'star': {
                'radius': float(prediction.get('koi_srad', 1.0)) * 3,
                'temperature': float(prediction.get('koi_teq', 5000)),
                'color': self.get_star_color(prediction.get('koi_teq', 5000))
            },
            'planet': {
                'radius': max(float(prediction.get('koi_prad', 1.0)) * 0.5, 0.5),
                'orbitalPeriod': float(prediction.get('koi_period', 10)),
                'orbitalRadius': float(prediction.get('koi_period', 10)) / 10,
                'temperature': float(prediction.get('koi_teq', 300)),
                'color': self.get_planet_color(prediction['classification'])
            },
            'coordinates': {
                'ra': float(prediction.get('ra', 0)) if prediction.get('ra') else None,
                'dec': float(prediction.get('dec', 0)) if prediction.get('dec') else None
            }
        }

        return system

    def get_star_color(self, temperature):
        if temperature > 5000:
            return '#ffffaa'
        elif temperature > 3500:
            return '#ffaa44'
        else:
            return '#ff6600'

    def get_planet_color(self, classification):
        colors = {
            'CONFIRMED': '#4488ff',
            'CANDIDATE': '#ffaa44',
            'FALSE_POSITIVE': '#888888'
        }
        return colors.get(classification, '#888888')

    def generate_galaxy_data(self, predictions):
        systems = []

        for idx, pred in enumerate(predictions[:self.max_planets]):
            system = self.generate_planet_system(pred, idx)
            systems.append(system)

        galaxy_data = {
            'systems': systems,
            'metadata': {
                'total_systems': len(systems),
                'confirmed_count': sum(1 for s in systems if s['classification'] == 'CONFIRMED'),
                'candidate_count': sum(1 for s in systems if s['classification'] == 'CANDIDATE'),
                'false_positive_count': sum(1 for s in systems if s['classification'] == 'FALSE_POSITIVE')
            }
        }

        return galaxy_data

    def create_starfield(self, num_stars=10000):
        stars = []

        for _ in range(num_stars):
            star = {
                'x': float(np.random.uniform(-self.galaxy_radius, self.galaxy_radius)),
                'y': float(np.random.uniform(-self.galaxy_radius, self.galaxy_radius)),
                'z': float(np.random.uniform(-self.galaxy_radius, self.galaxy_radius)),
                'color': self.random_star_color()
            }
            stars.append(star)

        return stars

    def random_star_color(self):
        hue = np.random.uniform(0.55, 0.65)
        lightness = np.random.uniform(0.7, 1.0)
        return f'hsl({hue * 360}, 30%, {lightness * 100}%)'
