import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class AdvancedRobot {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.parts = {};
    this.isWalking = false;
    this.walkSpeed = 3.5;
    this.targetPosition = null;
    this.pathQueue = [];
    this.currentPathIndex = 0;

    this.createRobot();
    this.addToScene();
  }

  createRobot() {
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.3,
      envMapIntensity: 1
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.8,
      roughness: 0.2
    });

    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      metalness: 0.3,
      roughness: 0.5
    });

    const torso = new THREE.Group();
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.2, 0.8),
      metalMaterial
    );
    mainBody.castShadow = true;
    torso.add(mainBody);

    const chestPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.6, 0.15),
      lightMaterial
    );
    chestPlate.position.set(0, 0.2, 0.43);
    chestPlate.castShadow = true;
    torso.add(chestPlate);

    const shoulderL = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      darkMetalMaterial
    );
    shoulderL.position.set(-0.85, 0.8, 0);
    shoulderL.castShadow = true;
    torso.add(shoulderL);

    const shoulderR = shoulderL.clone();
    shoulderR.position.set(0.85, 0.8, 0);
    torso.add(shoulderR);

    torso.position.set(0, 1.6, 0);
    this.group.add(torso);
    this.parts.torso = torso;

    const head = new THREE.Group();
    const headMain = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.8, 0.85),
      metalMaterial
    );
    headMain.castShadow = true;
    head.add(headMain);

    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.3, 0.15),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    visor.position.set(0, 0.05, 0.45);
    visor.castShadow = true;
    head.add(visor);

    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8),
      darkMetalMaterial
    );
    antenna.position.set(0, 0.6, 0);
    antenna.castShadow = true;
    head.add(antenna);

    const antennaTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.8
      })
    );
    antennaTip.position.set(0, 0.8, 0);
    head.add(antennaTip);

    head.position.set(0, 3.0, 0);
    this.group.add(head);
    this.parts.head = head;

    const armL = new THREE.Group();
    const upperArmL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.9, 12),
      metalMaterial
    );
    upperArmL.castShadow = true;
    armL.add(upperArmL);

    const elbowL = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      darkMetalMaterial
    );
    elbowL.position.set(0, -0.5, 0);
    elbowL.castShadow = true;
    armL.add(elbowL);

    const lowerArmL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.12, 0.8, 12),
      metalMaterial
    );
    lowerArmL.position.set(0, -0.9, 0);
    lowerArmL.castShadow = true;
    armL.add(lowerArmL);

    const handL = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.3, 0.2),
      darkMetalMaterial
    );
    handL.position.set(0, -1.35, 0);
    handL.castShadow = true;
    armL.add(handL);

    armL.position.set(-1.05, 2.1, 0);
    this.group.add(armL);
    this.parts.armL = armL;

    const armR = armL.clone();
    armR.position.set(1.05, 2.1, 0);
    this.group.add(armR);
    this.parts.armR = armR;

    const legL = new THREE.Group();
    const hipL = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 12),
      darkMetalMaterial
    );
    hipL.castShadow = true;
    legL.add(hipL);

    const thighL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.2, 0.9, 12),
      metalMaterial
    );
    thighL.position.set(0, -0.5, 0);
    thighL.castShadow = true;
    legL.add(thighL);

    const kneeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      darkMetalMaterial
    );
    kneeL.position.set(0, -0.95, 0);
    kneeL.castShadow = true;
    legL.add(kneeL);

    const calfL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.18, 0.9, 12),
      metalMaterial
    );
    calfL.position.set(0, -1.4, 0);
    calfL.castShadow = true;
    legL.add(calfL);

    const footL = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.2, 0.6),
      darkMetalMaterial
    );
    footL.position.set(0, -1.9, 0.15);
    footL.castShadow = true;
    legL.add(footL);

    legL.position.set(-0.4, 0.5, 0);
    this.group.add(legL);
    this.parts.legL = legL;

    const legR = legL.clone();
    legR.position.set(0.4, 0.5, 0);
    this.group.add(legR);
    this.parts.legR = legR;

    this.group.position.set(0, 0, 0);

    const glowLight = new THREE.PointLight(0x06b6d4, 0.5, 5);
    glowLight.position.set(0, 3, 0);
    this.group.add(glowLight);
    this.parts.glowLight = glowLight;
  }

  addToScene() {
    this.scene.add(this.group);
  }

  setPath(path) {
    this.pathQueue = path;
    this.currentPathIndex = 0;
    if (path.length > 0) {
      this.targetPosition = path[0].clone();
    }
  }

  startWalking() {
    this.isWalking = true;
  }

  stopWalking() {
    this.isWalking = false;
    this.targetPosition = null;
    this.resetLimbAnimations();
  }

  resetLimbAnimations() {
    if (this.parts.legL) {
      this.parts.legL.rotation.x = 0;
      this.parts.armL.rotation.x = 0;
    }
    if (this.parts.legR) {
      this.parts.legR.rotation.x = 0;
      this.parts.armR.rotation.x = 0;
    }
  }

  update(delta) {
    if (this.isWalking && this.targetPosition) {
      const direction = new THREE.Vector3()
        .subVectors(this.targetPosition, this.group.position)
        .normalize();

      const distance = this.group.position.distanceTo(this.targetPosition);
      const moveAmount = this.walkSpeed * delta;

      if (distance > 0.1) {
        const actualMove = Math.min(moveAmount, distance);
        this.group.position.add(direction.multiplyScalar(actualMove));

        const angle = Math.atan2(direction.x, direction.z);
        this.group.rotation.y = angle;

        this.animateWalking(delta);
      } else {
        this.currentPathIndex++;
        if (this.currentPathIndex < this.pathQueue.length) {
          this.targetPosition = this.pathQueue[this.currentPathIndex].clone();
        } else {
          this.stopWalking();
        }
      }
    } else {
      this.idleAnimation(delta);
    }
  }

  animateWalking(delta) {
    const time = Date.now() * 0.003;
    const legSwing = Math.sin(time * 4) * 0.5;
    const armSwing = Math.sin(time * 4) * 0.4;

    if (this.parts.legL && this.parts.legR) {
      this.parts.legL.rotation.x = legSwing;
      this.parts.legR.rotation.x = -legSwing;
    }

    if (this.parts.armL && this.parts.armR) {
      this.parts.armL.rotation.x = -armSwing * 0.8;
      this.parts.armR.rotation.x = armSwing * 0.8;
    }

    if (this.parts.torso) {
      this.parts.torso.position.y = 1.6 + Math.abs(Math.sin(time * 4)) * 0.08;
      this.parts.torso.rotation.z = Math.sin(time * 4) * 0.05;
    }

    if (this.parts.head) {
      this.parts.head.rotation.z = Math.sin(time * 2) * 0.03;
    }
  }

  idleAnimation(delta) {
    const time = Date.now() * 0.001;

    if (this.parts.torso) {
      this.parts.torso.position.y = 1.6 + Math.sin(time * 0.8) * 0.03;
    }

    if (this.parts.head) {
      this.parts.head.rotation.y = Math.sin(time * 0.5) * 0.1;
      this.parts.head.rotation.z = Math.sin(time * 0.6) * 0.02;
    }

    if (this.parts.armL) {
      this.parts.armL.rotation.x = Math.sin(time * 0.7) * 0.05;
    }
    if (this.parts.armR) {
      this.parts.armR.rotation.x = Math.sin(time * 0.7 + Math.PI) * 0.05;
    }

    if (this.parts.glowLight) {
      this.parts.glowLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
  }

  getPosition() {
    return this.group.position.clone();
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }
}
