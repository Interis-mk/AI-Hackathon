import { Vector3, Observer, Scene } from "@babylonjs/core";

export class MovingEnemy {
  mesh: any;
  target: any;
  speed: number;
  hp: number;
  private _obs: Observer<Scene> | null = null;

  constructor(mesh: any, target: any, speed = 0.03, hp = 10) {
    this.mesh = mesh;
    this.target = target;
    this.speed = speed;
    this.hp = hp;
    const scene = mesh.getScene();
    this._obs = scene.onBeforeRenderObservable.add(() => this._update());
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.dispose();
      this.mesh.dispose();
      return true; // Enemy died
    }
    return false;
  }

  private _update() {
    if (!this.mesh || !this.target) return;
    const mPos = this.mesh.position;
    const tPos = this.target.position;
    const dir = tPos.subtract(mPos);
    // Zero out Z for 2D movement on XY plane
    dir.z = 0;
    const dist = dir.length();
    if (dist > 0.05) {
      dir.normalize();
      const step = dir.scale(this.speed * (this.mesh.getScene().getAnimationRatio ? this.mesh.getScene().getAnimationRatio() : 1));
      this.mesh.position.addInPlace(step);
      // For 2D, rotate around Z axis to face target
      const angle = Math.atan2(dir.y, dir.x);
      this.mesh.rotation.z = angle;
    }
  }

  setTarget(target: any) {
    this.target = target;
  }

  setSpeed(s: number) {
    this.speed = s;
  }

  dispose() {
    if (this._obs && this.mesh) {
      this.mesh.getScene().onBeforeRenderObservable.remove(this._obs);
      this._obs = null;
    }
  }
}
