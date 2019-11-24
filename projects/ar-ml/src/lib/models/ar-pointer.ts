import { Mesh, Vector3, Geometry, Material } from 'three';
import { ObjectManager } from '../managers/object.manager';


export class ArPointer extends Mesh {

    readonly N_PREVIOUS_FRAMES_LENGHT = 20;
    readonly FRAMES_NOT_RECOGNIZE_TO_DIE = 120;

    private historicPositions: Vector3[] = [];
    private historicIndex :number = 0;
    private currentFramesNotDetected : number = 0;


    key: string;

    constructor(key: string, geometry: Geometry, material : Material, private objectManager : ObjectManager){
        super(geometry, material);
        this.key = key;

        this.historicPositions.forEach(x => x = new Vector3(100,100,100));
    }

    public update(){
        let date = new Date();
        date.getTime();

        if(this.currentFramesNotDetected >= this.FRAMES_NOT_RECOGNIZE_TO_DIE  ){
            this.objectManager.removeMeshObject(this.uuid);
        }
    }

    public setPosition(position: Vector3){
        this.position.set(position.x ,position.y, position.y);
        this.currentFramesNotDetected = 0;
    }

    public getMinDistanceToPosition(position: Vector3) : number {
        let distances = this.historicPositions.map(x => x.distanceTo(position));
        return Math.min(...distances);
    }

    public addPositionToHistoric() {
        let copyPosition = new Vector3(this.position.x, this.position.y, this.position.z);

        this.historicPositions[this.historicIndex] = copyPosition;
        this.historicIndex++;

        if(this.historicIndex >= this.N_PREVIOUS_FRAMES_LENGHT){
            this.historicIndex = 0;
        }

        this.currentFramesNotDetected++;
    }
}
