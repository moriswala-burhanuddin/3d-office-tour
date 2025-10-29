
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { AdvancedRobot } from './robot.js';
import { DepartmentManager } from './departments.js';
import { WelcomeCharacterManager } from './welcomeCharacter.js';

class OfficeApplication {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.robot = null;
    this.departmentManager = null;
    this.characterManager = null;
    this.clock = new THREE.Clock();
    this.isTourActive = false;
    this.currentDepartmentIndex = -1;

    this.init();
    this.setupUI();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1628);
    this.scene.fog = new THREE.Fog(0x0a1628, 50, 150);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    this.camera.position.set(-8, 6, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);

    this.setupLights();
    this.createEnvironment();

    this.robot = new AdvancedRobot(this.scene);
    this.departmentManager = new DepartmentManager(this.scene);
    this.characterManager = new WelcomeCharacterManager(this.scene, this.departmentManager);

    window.addEventListener('resize', () => this.onWindowResize());

    this.hideLoader();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(50, 40, 30);
    mainLight.castShadow = true;
    mainLight.shadow.camera.left = -60;
    mainLight.shadow.camera.right = 60;
    mainLight.shadow.camera.top = 60;
    mainLight.shadow.camera.bottom = -60;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.5);
    fillLight.position.set(-30, 20, -20);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 10, -50);
    this.scene.add(rimLight);
  }

  createEnvironment() {
    const floorGeometry = new THREE.PlaneGeometry(250, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.2,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(50, 0, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    const gridHelper = new THREE.GridHelper(250, 50, 0x334155, 0x1e293b);
    gridHelper.position.set(50, 0.01, 0);
    this.scene.add(gridHelper);

    this.createWalls();
    this.createCeilingLights();
    this.createDecorations();
  }

  createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.1,
      roughness: 0.9
    });

    const wallHeight = 8;
    const wallThickness = 0.5;

    const wallNorth = new THREE.Mesh(
      new THREE.BoxGeometry(250, wallHeight, wallThickness),
      wallMaterial
    );
    wallNorth.position.set(50, wallHeight / 2, -20);
    wallNorth.receiveShadow = true;
    wallNorth.castShadow = true;
    this.scene.add(wallNorth);

    const wallSouth = new THREE.Mesh(
      new THREE.BoxGeometry(250, wallHeight, wallThickness),
      wallMaterial
    );
    wallSouth.position.set(50, wallHeight / 2, 20);
    wallSouth.receiveShadow = true;
    wallSouth.castShadow = true;
    this.scene.add(wallSouth);

    for (let i = 0; i < 8; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, wallHeight * 0.7, 0.1),
        new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.3,
          roughness: 0.7
        })
      );
      panel.position.set(10 + i * 15, wallHeight * 0.5, -19.8);
      panel.castShadow = true;
      this.scene.add(panel);

      const panelSouth = panel.clone();
      panelSouth.position.z = 19.8;
      this.scene.add(panelSouth);
    }
  }

  createCeilingLights() {
    for (let i = 0; i < 10; i++) {
      const lightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.1, 8),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2
        })
      );
      lightPanel.position.set(10 + i * 10, 7.8, 0);
      this.scene.add(lightPanel);

      const spotlight = new THREE.PointLight(0xffffff, 0.8, 20);
      spotlight.position.set(10 + i * 10, 7.5, 0);
      spotlight.castShadow = true;
      this.scene.add(spotlight);
    }
  }

  createDecorations() {
    for (let i = 0; i < 15; i++) {
      const plant = new THREE.Group();

      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 0.6, 12),
        new THREE.MeshStandardMaterial({
          color: 0x8b4513,
          metalness: 0.2,
          roughness: 0.8
        })
      );
      pot.position.y = 0.3;
      pot.castShadow = true;
      plant.add(pot);

      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          metalness: 0,
          roughness: 0.9
        })
      );
      foliage.position.y = 0.9;
      foliage.castShadow = true;
      plant.add(foliage);

      const side = i % 2 === 0 ? -18 : 18;
      plant.position.set(8 + i * 7, 0, side);
      this.scene.add(plant);
    }
  }

  setupUI() {
    const enterBtn = document.getElementById('enter-btn');
    const deptList = document.getElementById('dept-list');
    const departmentPopup = document.getElementById('department-popup');
    const visitBtn = document.getElementById('visit-btn');

    enterBtn.addEventListener('click', () => {
      deptList.classList.toggle('expanded');
      if (!this.isTourActive) {
        this.populateDepartmentList();
      }
    });

    visitBtn.addEventListener('click', () => {
      if (this.currentDepartmentIndex >= 0) {
        departmentPopup.classList.remove('active');
      }
    });

    this.populateDepartmentList();
  }

  populateDepartmentList() {
    const deptList = document.getElementById('dept-list');
    const departments = this.departmentManager.getDepartmentData();

    const existingItems = deptList.querySelectorAll('.dept-list-item');
    if (existingItems.length > 0) return;

    departments.forEach((dept, index) => {
      const item = document.createElement('div');
      item.className = 'dept-list-item';
      item.innerHTML = `
        <div class="dept-color-indicator" style="background-color: #${dept.color.toString(16).padStart(6, '0')}"></div>
        <div class="dept-item-text">${dept.name}</div>
      `;

      item.addEventListener('click', () => {
        this.navigateToDepartment(index);
        document.querySelectorAll('.dept-list-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });

      deptList.appendChild(item);
    });
  }

  navigateToDepartment(index) {
    const path = this.departmentManager.getPathToDepartment(
      this.robot.getPosition(),
      index
    );

    if (path.length > 0) {
      this.robot.setPath(path);
      this.robot.startWalking();
      this.isTourActive = true;
      this.currentDepartmentIndex = index;
    }
  }

  updateCamera() {
    const robotPos = this.robot.getPosition();

    const cameraDistance = 12;
    const cameraHeight = 6;
    const cameraOffset = new THREE.Vector3(-cameraDistance, cameraHeight, cameraDistance);

    const targetCameraPos = robotPos.clone().add(cameraOffset);
    this.camera.position.lerp(targetCameraPos, 0.05);

    const lookAtPos = robotPos.clone();
    lookAtPos.y += 2;
    this.camera.lookAt(lookAtPos);
  }

  checkDepartmentProximity() {
    const robotPos = this.robot.getPosition();
    const result = this.departmentManager.checkProximity(robotPos);

    const popup = document.getElementById('department-popup');
    const title = document.getElementById('dept-title');
    const desc = document.getElementById('dept-desc');

    if (result && result.name) {
      title.textContent = result.name;
      desc.textContent = result.desc;
      popup.classList.add('active');
    } else if (result === false) {
      popup.classList.remove('active');
    }
  }

  hideLoader() {
    const progressBar = document.getElementById('progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          document.getElementById('loading-screen').classList.add('hidden');
        }, 300);
      }
    }, 50);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    this.robot.update(delta);
    this.departmentManager.animateDepartments(delta);
    this.characterManager.update(delta, this.robot.getPosition());

    this.updateCamera();
    this.checkDepartmentProximity();

    this.renderer.render(this.scene, this.camera);
  }
}

new OfficeApplication();
