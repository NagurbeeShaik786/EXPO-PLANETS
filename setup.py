from setuptools import setup, find_packages

setup(
    name='exoplanet-detector',
    version='1.0.0',
    description='AI-powered exoplanet detection and 3D visualization',
    author='Your Name',
    author_email='your.email@example.com',
    packages=find_packages(),
    install_requires=[
        'flask>=3.0.0',
        'flask-cors>=4.0.0',
        'numpy>=1.24.3',
        'pandas>=2.0.3',
        'scikit-learn>=1.3.0',
        'scipy>=1.11.2',
        'matplotlib>=3.7.2',
        'seaborn>=0.12.2',
        'joblib>=1.3.2',
        'pyyaml>=6.0.1',
        'python-dotenv>=1.0.0',
    ],
    python_requires='>=3.8',
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Astronomy',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
    ],
    entry_points={
        'console_scripts': [
            'exoplanet-detector=app.run:main',
        ],
    },
)
