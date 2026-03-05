import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Camera, PointerEventTypes } from "@babylonjs/core";
import { MovingEnemy } from "./enemy";

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const camera = new FreeCamera('cam', new Vector3(0, 0, -10), scene);
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(Vector3.Zero());

  const setOrtho = () => {
    const zoom = 5;
    const aspect = engine.getRenderWidth() / engine.getRenderHeight();
    camera.orthoTop = zoom;
    camera.orthoBottom = -zoom;
    camera.orthoLeft = -zoom * aspect;
    camera.orthoRight = zoom * aspect;
  };
  setOrtho();

  new HemisphericLight('h', new Vector3(0, 0, -1), scene);

  // 2D Plane for target
  const target = MeshBuilder.CreatePlane('target', { size: 0.4 }, scene);
  target.position = new Vector3(2, 0, 0);

  // 2D Plane for enemy
  const enemyMesh = MeshBuilder.CreatePlane('enemy', { size: 0.4 }, scene);
  enemyMesh.position = new Vector3(-2, 0, 0);

  const enemy = new MovingEnemy(enemyMesh, target, 0.05);

  // Click to move target on XY plane
  scene.onPointerObservable.add((evt) => {
    if (evt.type === PointerEventTypes.POINTERPICK || evt.type === PointerEventTypes.POINTERDOWN) {
      const p = scene.pick(scene.pointerX, scene.pointerY).pickedPoint;
      if (p) {
        target.position.x = p.x;
        target.position.y = p.y;
      }
    }
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => {
    engine.resize();
    setOrtho();
  });
});
