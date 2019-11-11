import { Injectable, ElementRef } from '@angular/core';
import { PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, Vector2, Raycaster, Vector3 } from 'three';
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
    private raycaster : Raycaster = new Raycaster();
    private webGLScene: SceneInstance;
    private css3DScene: SceneInstance;

    constructor(){
    }

    public createScene(container: ElementRef,  width : number, height : number){
        this.createCSS3DScene(container, width, height);
        this.createWebGLScene(container, width, height);

        this.AddSampleBoxToScene();
    }

    public addUIElement(element: ElementRef, positionType : PositionType, anchorType : AnchorType){

        let uiObject = new UIObject(
            element.nativeElement, 
            new Vector2(this.css3DScene.config.width, this.css3DScene.config.height),
            positionType, 
            anchorType,
            (x) => {
                x.rotation.y += 0.01;
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
    
    public launchRay(x : number, y : number){
        this.raycaster.setFromCamera({x,y}, this.camera);
        console.log(this.raycaster.intersectObjects(this.css3DScene.scene.children, true));
    }

    
    private createCSS3DScene(container: ElementRef,  width : number, height : number){
        this.createOrUseCamera(width, height);

        let config: SceneConfig = {
            width: width,
            height: height,
            renderer: new CSS3DRenderer(),
        }
        
        config.renderer.domElement.style.zIndex = "20";

        container.nativeElement.appendChild(config.renderer.domElement);
        
        this.css3DScene = new SceneInstance(config);
    }

    private createWebGLScene(container: ElementRef, width : number, height : number){
        this.createOrUseCamera(width, height);

        var canvas = document.createElement('canvas');
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "10";

        let config: SceneConfig = {
            width: width,
            height: height,
            renderer: new WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } ),
        }
        console.log(config.renderer.domElement);
        
        container.nativeElement.appendChild(config.renderer.domElement);

        this.webGLScene = new SceneInstance(config);
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