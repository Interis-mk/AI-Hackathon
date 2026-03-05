import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Camera, PointerEventTypes, Color3, StandardMaterial } from "@babylonjs/core";
import { MovingEnemy } from "./enemy";
import { WaveManager, EnemyType } from "./waveManager";

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ui = document.createElement("div");
    ui.style.position = "absolute";
    ui.style.top = "20px";
    ui.style.left = "20px";
    ui.style.color = "#00ff00";
    ui.style.fontFamily = "monospace";
    ui.style.fontSize = "24px";
    ui.style.textShadow = "2px 2px 4px #000";
    ui.id = "ui-overlay";
    document.body.appendChild(ui);

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new FreeCamera("cam", new Vector3(0, 0, -10), scene);
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

    new HemisphericLight("h", new Vector3(0, 0, -1), scene);

    const player = MeshBuilder.CreatePlane("player", { size: 0.5 }, scene);
    const playerMat = new StandardMaterial("playerMat", scene);
    playerMat.emissiveColor = Color3.Blue();
    player.material = playerMat;

    // Bullet management
    const bullets: { mesh: any, velocity: Vector3 }[] = [];
    const bulletMat = new StandardMaterial("bulletMat", scene);
    bulletMat.emissiveColor = Color3.White();

    const shoot = (targetPoint: Vector3) => {
        const bullet = MeshBuilder.CreateSphere("bullet", { diameter: 0.15 }, scene);
        bullet.position = player.position.clone();
        const dir = targetPoint.subtract(player.position);
        dir.z = 0;
        dir.normalize();
        bullets.push({ mesh: bullet, velocity: dir.scale(0.15) });
    };

    scene.onPointerObservable.add((evt) => {
        if (evt.type === PointerEventTypes.POINTERPICK || evt.type === PointerEventTypes.POINTERDOWN) {
            const p = scene.pick(scene.pointerX, scene.pointerY).pickedPoint;
            if (p) {
                // Determine if move or shoot
                const isLeftClick = (evt.event as PointerEvent).button === 0;
                if (isLeftClick) {
                    player.position.x = p.x;
                    player.position.y = p.y;
                } else {
                    shoot(p);
                }
            }
        }
    });

    const types: EnemyType[] = [
        { name: "Tank", speed: 0.015, color: Color3.Red(), weight: 75, hp: 30 },
        { name: "Scout", speed: 0.04, color: Color3.Yellow(), weight: 25, hp: 10 }
    ];

    const waveManager = new WaveManager(scene, player, types);
    let nextWaveTimeout: any = null;

    engine.runRenderLoop(() => {
        const dt = engine.getDeltaTime() / 1000;
        waveManager.update(dt);

        // Update Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.mesh.position.addInPlace(b.velocity);
            
            // Check collision with enemies
            let hit = false;
            for (const enemy of waveManager.enemies) {
                if (b.mesh.intersectsMesh(enemy.mesh, false)) {
                    enemy.takeDamage(10);
                    hit = true;
                    break;
                }
            }

            if (hit || b.mesh.position.length() > 20) {
                b.mesh.dispose();
                bullets.splice(i, 1);
            }
        }

        let statusText = `WAVE: ${waveManager.currentWave}<br>TIME: ${Math.ceil(waveManager.waveTimer)}s`;
        if (!waveManager.isWaveActive) {
            if (waveManager.currentWave === 0) {
                statusText = "GET READY... WAVE 1 STARTING";
                if (!nextWaveTimeout) nextWaveTimeout = setTimeout(() => { waveManager.startNextWave(); nextWaveTimeout = null; }, 3000);
            } else {
                statusText = `WAVE ${waveManager.currentWave} CLEAR!<br>NEXT WAVE IN 5s`;
                if (!nextWaveTimeout) nextWaveTimeout = setTimeout(() => { waveManager.startNextWave(); nextWaveTimeout = null; }, 5000);
            }
        }
        ui.innerHTML = statusText;
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
        setOrtho();
    });
});