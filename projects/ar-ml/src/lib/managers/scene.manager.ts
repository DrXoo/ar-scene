import { Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';

export class SceneModel{
    scene : Scene;
}

export class SceneManager {

    readonly FOV : number = 70;
    readonly NEAREST_CAMERA_VALUE : number = 0.1;
    readonly FAREST_CAMERA_VALUE : number = 10;

    private webGLRenderer = new WebGLRenderer();
    private canvas : HTMLCanvasElement;
    private mesh: Mesh;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private width: number;
    private height: number;

    constructor(){
    }

    public createScene(canvas : HTMLCanvasElement, width : number, height : number){
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.camera = new PerspectiveCamera(this.FOV,
            this.width / this.height, 
            this.NEAREST_CAMERA_VALUE,
            this.FAREST_CAMERA_VALUE );

        this.camera.position.z = 1;

        this.updateCanvasSize();

        this.scene = new Scene();
        this.AddSampleBoxToScene();

        this.webGLRenderer = new WebGLRenderer( { canvas: this.canvas, antialias: true, alpha: true } );
        this.webGLRenderer.setSize( this.width, this.height );
        this.update();
    }

    public AddSampleBoxToScene(){
        var geometry = new BoxGeometry( 0.2, 0.2, 0.2 );
        var material = new MeshNormalMaterial();
    
        this.mesh = new Mesh( geometry, material );
        this.scene.add( this.mesh );
    }

    public update(){
        window.requestAnimationFrame(() => this.update());
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.webGLRenderer.render(this.scene, this.camera);
    
        this.updateCanvasSize();
    
        this.camera.aspect =  this.width / this.height;
        this.camera.updateProjectionMatrix();
    
        this.webGLRenderer.setSize( this.width, this.height );
    }


    private updateCanvasSize(){
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
}