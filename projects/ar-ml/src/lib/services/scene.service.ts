import { Injectable, ElementRef } from '@angular/core';
import { PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, Object3D, Group, Geometry, Vector3 } from 'three';
import { SceneConfig } from '../models/scene.config';
import { SceneInstance } from '../models/scene.instance';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { UIObject } from '../models/uiObject';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

    readonly FOV : number = 45;
    readonly perspective = 1500;
    
    readonly NEAREST_CAMERA_VALUE : number = 0.1;
    readonly FAREST_CAMERA_VALUE : number = 1000

    private camera: PerspectiveCamera;
    private webGLScene: SceneInstance;
    private css3DScene: SceneInstance;

    constructor(){
    }

    public createCSS3DScene(container: ElementRef,  width : number, height : number){
        this.createOrUseCamera(width, height);

        let renderer = new CSS3DRenderer();

        let config: SceneConfig = {
            width: width,
            height: height,
            renderer: renderer,
        }
        container.nativeElement.appendChild(config.renderer.domElement);
        
        this.css3DScene = new SceneInstance(config);
    }

    public createWebGLScene(canvas : HTMLCanvasElement, width : number, height : number){
        this.createOrUseCamera(width, height);

        let config: SceneConfig = {
            // canvas: canvas,
            width: width,
            height: height,
            renderer: new WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } ),
        }

        this.webGLScene = new SceneInstance(config);

        this.AddSampleBoxToScene();
    }

    public attachDOMToCSS3DRenderer(element: ElementRef){
        var wrapper = document.createElement('div');
        wrapper.appendChild(element.nativeElement);
        console.log(element);
        console.log(element.nativeElement.clientWidth / 2);
        let uiObject = new UIObject(
            wrapper, 
            PositionType.ABSOLUTE, 
            AnchorType.LEFT,
            (x) => {
                //x.rotation.y += 0.01;
            }
        );

        this.css3DScene.AddToScene(uiObject);
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
            const fov = 180 * ( 2 * Math.atan( height / 2 / this.perspective ) ) / Math.PI
            this.camera = new PerspectiveCamera(fov,
                width / height, 
                this.NEAREST_CAMERA_VALUE,
                this.FAREST_CAMERA_VALUE );
            this.camera.position.set(0, 0, this.perspective);
        }
    }
}