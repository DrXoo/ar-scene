import { Injectable } from '@angular/core';
import { PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';
import { SceneConfig } from '../models/scene.config';
import { SceneInstance } from '../models/scene.instance';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'

@Injectable({
  providedIn: 'root'
})
export class SceneService {

    readonly FOV : number = 70;
    readonly NEAREST_CAMERA_VALUE : number = 0.1;
    readonly FAREST_CAMERA_VALUE : number = 10;

    private camera: PerspectiveCamera;
    private webGLScene: SceneInstance;
    private css3DScene: SceneInstance;

    constructor(){
    }

    public createCSS3DScene(canvas : HTMLCanvasElement, width : number, height : number){
        this.createOrUseCamera(width, height);

        let config: SceneConfig = {
            canvas: canvas,
            width: width,
            height: height,
            renderer: new CSS3DRenderer(),
        }

        this.webGLScene = new SceneInstance(config);
    }

    public createWebGLScene(canvas : HTMLCanvasElement, width : number, height : number){
        this.createOrUseCamera(width, height);

        let config: SceneConfig = {
            canvas: canvas,
            width: width,
            height: height,
            renderer: new WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } ),
        }

        this.webGLScene = new SceneInstance(config);

        this.AddSampleBoxToScene();
    }

    public update(){
        window.requestAnimationFrame(() => this.update());

        if(this.webGLScene){
            this.webGLScene.update(this.camera);
        }

        if(this.css3DScene){
            this.css3DScene.update(this.camera);
        }
    }   

    private AddSampleBoxToScene(){
        var geometry = new BoxGeometry( 0.2, 0.2, 0.2 );
        var material = new MeshNormalMaterial();

        var mesh = new Mesh( geometry, material );
        this.webGLScene.scene.add( mesh );
    }

    private createOrUseCamera(width: number, height: number) {
        if(!this.camera){
            this.camera = new PerspectiveCamera(this.FOV,
                width / height, 
                this.NEAREST_CAMERA_VALUE,
                this.FAREST_CAMERA_VALUE );
            this.camera.position.z = 1;
        }
    }
}