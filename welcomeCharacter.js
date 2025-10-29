import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class WelcomeCharacter {
  constructor(scene, position, color = 0xffffff) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.color = color;
    this.isVisible = false;

    this.createCharacter();
    this.group.position.copy(position);
    this.group.scale.set(0.01, 0.01, 0.01);
    this.scene.add(this.group);
  }

  createCharacter() {
    const skinTone = 0xffdbac;
    const shirtColor = this.color;

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.3, 0.8, 8, 16),
      new THREE.MeshStandardMaterial({
        color: shirtColor,
        metalness: 0.2,
        roughness: 0.7
      })
    );
    body.position.set(0, 1.0, 0);
    body.castShadow = true;
    this.group.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({
        color: skinTone,
        metalness: 0.1,
        roughness: 0.8
      })
    );
    head.position.set(0, 1.85, 0);
    head.castShadow = true;
    this.group.add(head);

    const eyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    eyeL.position.set(-0.08, 1.9, 0.22);
    this.group.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.set(0.08, 1.9, 0.22);
    this.group.add(eyeR);

    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    smile.position.set(0, 1.75, 0.22);
    smile.rotation.z = Math.PI;
    smile.rotation.x = 0.3;
    this.group.add(smile);

    const armL = new THREE.Group();
    const upperArmL = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.4, 6, 12),
      new THREE.MeshStandardMaterial({ color: shirtColor })
    );
    upperArmL.castShadow = true;
    armL.add(upperArmL);

    const handL = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 12),
      new THREE.MeshStandardMaterial({ color: skinTone })
    );
    handL.position.set(0, -0.3, 0);
    handL.castShadow = true;
    armL.add(handL);

    armL.position.set(-0.35, 1.2, 0);
    armL.rotation.z = -0.3;
    this.group.add(armL);
    this.armL = armL;

    const armR = armL.clone();
    armR.position.set(0.35, 1.2, 0);
    armR.rotation.z = 0.3;
    this.group.add(armR);
    this.armR = armR;

    const legL = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.5, 8, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    legL.position.set(-0.12, 0.35, 0);
    legL.castShadow = true;
    this.group.add(legL);

    const legR = legL.clone();
    legR.position.set(0.12, 0.35, 0);
    this.group.add(legR);

    const pointLight = new THREE.PointLight(this.color, 0.5, 3);
    pointLight.position.set(0, 1.5, 0);
    this.group.add(pointLight);
    this.pointLight = pointLight;
  }

  show() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.animateScale(1);
    }
  }

  hide() {
    if (this.isVisible) {
      this.isVisible = false;
      this.animateScale(0.01);
    }
  }

  animateScale(targetScale) {
    const startScale = this.group.scale.x;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentScale = startScale + (targetScale - startScale) * easeProgress;
      this.group.scale.set(currentScale, currentScale, currentScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  update(delta) {
    if (!this.isVisible) return;

    const time = Date.now() * 0.001;

    if (this.armL) {
      this.armL.rotation.z = -0.3 + Math.sin(time * 3) * 0.4;
      this.armL.rotation.x = Math.sin(time * 3 + Math.PI / 2) * 0.2;
    }
    if (this.armR) {
      this.armR.rotation.z = 0.3 - Math.sin(time * 3) * 0.4;
      this.armR.rotation.x = Math.sin(time * 3 + Math.PI / 2) * 0.2;
    }

    this.group.position.y += Math.sin(time * 2) * 0.001;

    this.group.rotation.y = Math.sin(time * 0.5) * 0.1;

    if (this.pointLight) {
      this.pointLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
  }
}

export class WelcomeCharacterManager {
  constructor(scene, departmentManager) {
    this.scene = scene;
    this.departmentManager = departmentManager;
    this.characters = [];

    this.createCharacters();
  }

  createCharacters() {
    const departments = this.departmentManager.departments;

    departments.forEach((dept, index) => {
      const pos = dept.group.position.clone();
      pos.x -= 6;
      pos.y = 0;
      pos.z += 3;

      const character = new WelcomeCharacter(
        this.scene,
        pos,
        dept.data.color
      );

      this.characters.push({
        character: character,
        department: dept
      });
    });
  }

  update(delta, robotPosition) {
    this.characters.forEach((charData) => {
      const distance = robotPosition.distanceTo(charData.department.group.position);

      if (distance < 15) {
        charData.character.show();
      } else {
        charData.character.hide();
      }

      charData.character.update(delta);
    });
  }
}
