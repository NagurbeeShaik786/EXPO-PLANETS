import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetPrediction } from '../types/exoplanet';
import { Focus, Maximize2, Info } from 'lucide-react';

interface GalaxyVisualizationProps {
  planets: PlanetPrediction[];
}

export default function GalaxyVisualization({ planets }: GalaxyVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const planetGroupsRef = useRef<Map<string, THREE.Group>>(new Map());

  const [focusedPlanet, setFocusedPlanet] = useState<PlanetPrediction | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 50, 150);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 1000;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const starField = createStarField();
    scene.add(starField);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      scene.children.forEach(child => {
        if (child.userData.isOrbitingPlanet) {
          child.rotation.y += 0.001;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !camera || !scene) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const intersectableObjects: THREE.Object3D[] = [];
      scene.children.forEach(child => {
        if (child.userData.isPlanetSystem) {
          intersectableObjects.push(...child.children);
        }
      });

      const intersects = raycasterRef.current.intersectObjects(intersectableObjects);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        let group = intersectedObject.parent;

        while (group && !group.userData.isPlanetSystem) {
          group = group.parent;
        }

        if (group && group.userData.planetData) {
          focusOnPlanet(group, group.userData.planetData);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !camera || !scene) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const intersectableObjects: THREE.Object3D[] = [];
      scene.children.forEach(child => {
        if (child.userData.isPlanetSystem) {
          intersectableObjects.push(...child.children);
        }
      });

      const intersects = raycasterRef.current.intersectObjects(intersectableObjects);

      if (intersects.length > 0) {
        let group = intersects[0].object.parent;
        while (group && !group.userData.isPlanetSystem) {
          group = group.parent;
        }
        if (group && group.userData.planetData) {
          setHoveredPlanet(group.userData.planetData.name);
          document.body.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredPlanet(null);
      document.body.style.cursor = 'default';
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      document.body.style.cursor = 'default';
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.children.forEach(child => {
      if (child.userData.isPlanetSystem) {
        sceneRef.current?.remove(child);
      }
    });

    planetGroupsRef.current.clear();

    planets.forEach((planet, index) => {
      const planetSystem = createPlanetSystem(planet, index);
      planetSystem.userData.planetData = planet;
      planetGroupsRef.current.set(planet.name, planetSystem);
      sceneRef.current?.add(planetSystem);
    });
  }, [planets]);

  const focusOnPlanet = (group: THREE.Group, planet: PlanetPrediction) => {
    if (!cameraRef.current || !controlsRef.current) return;

    setFocusedPlanet(planet);

    const targetPosition = group.position.clone();
    const distance = 30;
    const cameraTargetPos = new THREE.Vector3(
      targetPosition.x + distance,
      targetPosition.y + distance * 0.5,
      targetPosition.z + distance
    );

    animateCamera(cameraTargetPos, targetPosition);
  };

  const animateCamera = (newPosition: THREE.Vector3, newTarget: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerpVectors(startPosition, newPosition, eased);
        controlsRef.current.target.lerpVectors(startTarget, newTarget, eased);
        controlsRef.current.update();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const resetView = () => {
    setFocusedPlanet(null);
    if (!cameraRef.current || !controlsRef.current) return;

    const defaultPosition = new THREE.Vector3(0, 50, 150);
    const defaultTarget = new THREE.Vector3(0, 0, 0);

    animateCamera(defaultPosition, defaultTarget);
  };

  const createStarField = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);

      const color = new THREE.Color();
      color.setHSL(0.6, Math.random() * 0.3, 0.7 + Math.random() * 0.3);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    return new THREE.Points(geometry, material);
  };

  const createPlanetSystem = (planet: PlanetPrediction, index: number) => {
    const group = new THREE.Group();
    group.userData.isPlanetSystem = true;

    const angle = (index / planets.length) * Math.PI * 2;
    const radius = 50 + index * 15;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    group.position.set(x, 0, z);

    const starGeometry = new THREE.SphereGeometry(planet.starRadius * 3, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: planet.temperature > 5000 ? 0xffffaa : 0xffaa44,
      emissive: planet.temperature > 5000 ? 0xffff00 : 0xff6600,
      emissiveIntensity: 1
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    group.add(star);

    const starLight = new THREE.PointLight(
      planet.temperature > 5000 ? 0xffffaa : 0xffaa44,
      2,
      100
    );
    group.add(starLight);

    const orbitRadius = planet.orbitalPeriod / 10;
    const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.1, orbitRadius + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    group.add(orbit);

    const planetGeometry = new THREE.SphereGeometry(Math.max(planet.planetRadius * 0.5, 0.5), 32, 32);
    const planetColor = planet.classification === 'CONFIRMED' ? 0x4488ff :
                       planet.classification === 'CANDIDATE' ? 0xffaa44 : 0x888888;
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: planetColor,
      emissive: planetColor,
      emissiveIntensity: 0.3,
      roughness: 0.7,
      metalness: 0.3
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(orbitRadius, 0, 0);
    planetMesh.userData.isOrbitingPlanet = true;
    group.add(planetMesh);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '20px Arial';
    context.fillText(planet.name, 10, 30);
    context.font = '14px Arial';
    context.fillText(`${planet.classification} (${(planet.confidence * 100).toFixed(0)}%)`, 10, 50);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const label = new THREE.Sprite(labelMaterial);
    label.position.set(0, planet.starRadius * 3 + 5, 0);
    label.scale.set(16, 4, 1);
    group.add(label);

    return group;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl" />

      {hoveredPlanet && !focusedPlanet && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 pointer-events-none">
          <Info className="w-4 h-4" />
          <span>Click to explore {hoveredPlanet}</span>
        </div>
      )}

      {focusedPlanet && (
        <>
          <button
            onClick={resetView}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Reset View</span>
          </button>

          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl max-w-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{focusedPlanet.name}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  focusedPlanet.classification === 'CONFIRMED' ? 'bg-green-500/20 text-green-300' :
                  focusedPlanet.classification === 'CANDIDATE' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {focusedPlanet.classification}
                </span>
              </div>
              <Focus className="w-6 h-6 text-blue-400" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Confidence</p>
                <p className="text-lg font-semibold">{(focusedPlanet.confidence * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Orbital Period</p>
                <p className="text-lg font-semibold">{focusedPlanet.orbitalPeriod.toFixed(2)} days</p>
              </div>
              <div>
                <p className="text-gray-400">Planet Radius</p>
                <p className="text-lg font-semibold">{focusedPlanet.planetRadius.toFixed(2)} R⊕</p>
              </div>
              <div>
                <p className="text-gray-400">Temperature</p>
                <p className="text-lg font-semibold">{focusedPlanet.temperature.toFixed(0)} K</p>
              </div>
              <div>
                <p className="text-gray-400">Star Radius</p>
                <p className="text-lg font-semibold">{focusedPlanet.starRadius.toFixed(2)} R☉</p>
              </div>
              <div>
                <p className="text-gray-400">Distance</p>
                <p className="text-lg font-semibold">{focusedPlanet.position.distance.toFixed(0)} ly</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
        <p className="text-gray-300">Click planets to explore • Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}
