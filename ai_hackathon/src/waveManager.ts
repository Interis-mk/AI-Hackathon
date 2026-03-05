import { Scene, MeshBuilder, Vector3, Color3, StandardMaterial } from "@babylonjs/core";
import { MovingEnemy } from "./enemy";

export interface EnemyType {
    name: string;
    speed: number;
    hp: number;
    color: Color3;
    weight: number;
}

export class WaveManager {
    private _scene: Scene;
    private _player: any;
    private _enemies: MovingEnemy[] = [];
    private _currentWave = 0;
    private _enemyTypes: EnemyType[];
    
    public waveTimer = 0;
    public isWaveActive = false;

    constructor(scene: Scene, player: any, enemyTypes: EnemyType[]) {
        this._scene = scene;
        this._player = player;
        this._enemyTypes = enemyTypes;
    }

    public startNextWave() {
        this._currentWave++;
        this.isWaveActive = true;
        const enemyCount = 3 + (this._currentWave * 2);
        this.waveTimer = 10 + (this._currentWave * 5);
        for (let i = 0; i < enemyCount; i++) {
            this._spawnEnemy();
        }
    }

    private _spawnEnemy() {
        const type = this._getRandomEnemyType();
        const mesh = MeshBuilder.CreatePlane(type.name, { size: 0.4 }, this._scene);
        const mat = new StandardMaterial(`${type.name}Mat`, this._scene);
        mat.diffuseColor = type.color;
        mat.emissiveColor = type.color;
        mesh.material = mat;
        const angle = Math.random() * Math.PI * 2;
        const radius = 6;
        mesh.position = new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        const enemy = new MovingEnemy(mesh, this._player, type.speed, type.hp);
        this._enemies.push(enemy);
    }

    private _getRandomEnemyType(): EnemyType {
        const totalWeight = this._enemyTypes.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;
        for (const type of this._enemyTypes) {
            if (random < type.weight) return type;
            random -= type.weight;
        }
        return this._enemyTypes[0];
    }

    public update(deltaTime: number) {
        if (!this.isWaveActive) return;
        this._enemies = this._enemies.filter(e => e.hp > 0);
        this.waveTimer -= deltaTime;
        if (this.waveTimer <= 0) {
            this.waveTimer = 0;
            this.endWave();
        }
    }

    public endWave() {
        this.isWaveActive = false;
        this._enemies.forEach(e => {
            if(e.mesh) e.mesh.dispose();
            e.dispose();
        });
        this._enemies = [];
    }

    public get currentWave() { return this._currentWave; }
    public get enemies() { return this._enemies; }
}