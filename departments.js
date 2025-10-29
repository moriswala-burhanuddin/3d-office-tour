import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class DepartmentManager {
  constructor(scene) {
    this.scene = scene;
    this.departments = [];
    this.meshes = [];
    this.activeDepartment = null;

this.departmentData = [
  {
    name: 'Development Department',
    desc: 'Our core technical division where powerful web apps and backend systems come to life. The team builds production-ready Django, Python, and React projects with complete documentation, authentication systems, API integrations, and payment gateways. Every product here is optimized for performance, scalability, and clean architecture. VISIT FITPROJECTSBYMORIS OR CALL ON +91 81282 60653 OR CALL ON +91 81282 60653',
    position: { x: 20, y: 0, z: -8 },
    color: 0x3b82f6,
    accentColor: 0x60a5fa,
    icon: '💻'
  },
  {
    name: 'Marketing Department',
    desc: 'The creative hub focused on promoting projects through engaging campaigns, brand storytelling, and social media strategies. This team designs stunning product banners, writes impactful captions, and creates launch reels that connect directly with audiences. Their focus: to grow visibility and build the Fit Projects brand worldwide. VISIT FITPROJECTSBYMORIS OR CALL ON +91 81282 60653 ',
    position: { x: 38, y: 0, z: 8 },
    color: 0xf59e0b,
    accentColor: 0xfbbf24,
    icon: '📊'
  },
  {
    name: 'Student Projects',
    desc: 'A dedicated space for academic innovation where students upload their final-year projects with documentation, research reports, and code demos. This department also provides guidance, resources, and mentorship for college-level projects in web development, AI, IoT, and cybersecurity domains. VISIT FITPROJECTSBYMORIS OR CALL ON +91 81282 60653',
    position: { x: 56, y: 0, z: -8 },
    color: 0x10b981,
    accentColor: 0x34d399,
    icon: '🎓'
  },
  {
    name: 'AI Laboratory',
    desc: 'The most futuristic part of Fit Projects HQ — where intelligent systems are trained and tested. The AI Lab builds chatbots, image recognition systems, data analysis tools, and machine learning models. Here, experiments turn into real-world applications using TensorFlow, OpenAI APIs, and custom Django AI integrations. VISIT FITPROJECTSBYMORIS OR CALL ON +91 81282 60653',
    position: { x: 74, y: 0, z: 8 },
    color: 0x8b5cf6,
    accentColor: 0xa78bfa,
    icon: '🤖'
  },
  {
    name: 'Design Studio',
    desc: 'Where creativity meets technology. The Design Studio crafts professional UI/UX layouts, website mockups, logos, and marketing visuals. Designers here experiment with Figma, Photoshop, and 3D tools to create unique brand experiences. Their goal: make every Fit Projects product visually stunning and user-friendly. VISIT FITPROJECTSBYMORIS OR CALL ON +91 81282 60653',
    position: { x: 92, y: 0, z: -8 },
    color: 0xec4899,
    accentColor: 0xf472b6,
    icon: '🎨'
  }
];


    this.createDepartments();
  }

  createDepartments() {
    this.departmentData.forEach((dept, index) => {
      const deptGroup = new THREE.Group();
      deptGroup.userData = { department: dept };

      const buildingGeom = new THREE.BoxGeometry(7, 5, 6);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: dept.color,
        metalness: 0.4,
        roughness: 0.3,
        envMapIntensity: 1
      });
      const building = new THREE.Mesh(buildingGeom, buildingMat);
      building.position.set(0, 2.5, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      deptGroup.add(building);

      const windowRows = 3;
      const windowCols = 4;
      const windowSize = 0.6;
      const windowSpacing = 1.2;

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const window = new THREE.Mesh(
            new THREE.PlaneGeometry(windowSize, windowSize),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0xffffff,
              emissiveIntensity: 0.3,
              metalness: 0.8,
              roughness: 0.2
            })
          );
          const xPos = (col - windowCols / 2 + 0.5) * windowSpacing;
          const yPos = 2.5 + (row - windowRows / 2 + 0.5) * windowSpacing;
          window.position.set(xPos, yPos, 3.01);
          deptGroup.add(window);
        }
      }

      const roofGeom = new THREE.ConeGeometry(5, 1.5, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: dept.accentColor,
        metalness: 0.5,
        roughness: 0.4
      });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(0, 5.75, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      deptGroup.add(roof);

      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.8, 0.15),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.6
        })
      );
      signBoard.position.set(0, 6.5, 0);
      signBoard.castShadow = true;
      deptGroup.add(signBoard);

      const spotLight = new THREE.SpotLight(dept.color, 1.5, 15, Math.PI / 6, 0.3, 1);
      spotLight.position.set(0, 8, 0);
      spotLight.target.position.set(0, 0, 0);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      deptGroup.add(spotLight);
      deptGroup.add(spotLight.target);

      const ambientGlow = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 0.2, 32),
        new THREE.MeshBasicMaterial({
          color: dept.color,
          transparent: true,
          opacity: 0.15
        })
      );
      ambientGlow.position.set(0, 0.1, 0);
      ambientGlow.rotation.x = Math.PI / 2;
      deptGroup.add(ambientGlow);

      deptGroup.position.set(dept.position.x, dept.position.y, dept.position.z);

      this.scene.add(deptGroup);
      this.meshes.push(building);
      this.departments.push({
        data: dept,
        group: deptGroup,
        mesh: building,
        spotLight: spotLight
      });
    });
  }

  getPathToDepartment(startPos, deptIndex) {
    if (deptIndex < 0 || deptIndex >= this.departments.length) {
      return [];
    }

    const dept = this.departments[deptIndex];
    const deptPos = dept.group.position;

    const approachDistance = 10;
    const approachPos = new THREE.Vector3(
      deptPos.x - approachDistance,
      0,
      deptPos.z
    );

    const path = [];

    const currentX = startPos.x;
    const midX = (currentX + approachPos.x) / 2;

    path.push(new THREE.Vector3(midX, 0, startPos.z));

    path.push(new THREE.Vector3(midX, 0, approachPos.z));

    path.push(approachPos.clone());

    return path;
  }

  checkProximity(position) {
    const proximityDistance = 12;

    for (let i = 0; i < this.departments.length; i++) {
      const dept = this.departments[i];
      const distance = position.distanceTo(dept.group.position);

      if (distance < proximityDistance) {
        if (this.activeDepartment !== dept) {
          this.activeDepartment = dept;
          return dept.data;
        }
        return null;
      }
    }

    if (this.activeDepartment) {
      this.activeDepartment = null;
      return false;
    }

    return null;
  }

  getDepartmentData() {
    return this.departmentData;
  }

  getDepartmentCount() {
    return this.departments.length;
  }

  animateDepartments(delta) {
    const time = Date.now() * 0.001;

    this.departments.forEach((dept, index) => {
      const offset = index * Math.PI * 0.4;

      dept.group.position.y = Math.sin(time * 0.5 + offset) * 0.15;

      dept.spotLight.intensity = 1.5 + Math.sin(time * 2 + offset) * 0.3;
    });
  }
}
