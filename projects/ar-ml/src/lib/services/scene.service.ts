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

    readonly WEBGL_FOV : number = 70;
    readonly UI_RENDER_PERSPECTIVE = 1500;
    
    readonly NEAREST_CAMERA_VALUE : number = 0.1;
    readonly FAREST_CAMERA_VALUE : number = 1000

    private raycaster : Raycaster = new Raycaster();
    private webGLScene: SceneInstance;
    private css3DScene: SceneInstance;

    constructor(){
    }

    public createScene(container: ElementRef,  width : number, height : number){
        this.createWebGLScene(container, width, height);
        this.createCSS3DScene(container, width, height);
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
            this.webGLScene.update();
        }

        if(this.css3DScene){
            this.css3DScene.update();
        }
    }
    
    public launchRay(x : number, y : number){
         this.raycaster.setFromCamera({x,y}, this.webGLScene.config.camera);
         console.log(this.raycaster.intersectObjects(this.webGLScene.scene.children, true));
    }

    
    private createCSS3DScene(container: ElementRef,  width : number, height : number){
        const fov = 180 * ( 2 * Math.atan( height / 2 / this.UI_RENDER_PERSPECTIVE ) ) / Math.PI

        let camera = this.createCamera(fov, width, height);

        camera.position.z = this.UI_RENDER_PERSPECTIVE;

        let config: SceneConfig = {
            camera: camera,
            width: width,
            height: height,
            renderer: new CSS3DRenderer(),
        }
        
        config.renderer.domElement.style.zIndex = "20";

        config.renderer.domElement.style.position = "absolute";
        config.renderer.domElement.style.top = "0";
        config.renderer.domElement.style.left = "0";

        container.nativeElement.appendChild(config.renderer.domElement);
        
        this.css3DScene = new SceneInstance(config);
    }

    private createWebGLScene(container: ElementRef, width : number, height : number){
        let camera = this.createCamera(this.WEBGL_FOV, width, height);

        camera.position.set(0, 0, 1);

        let config: SceneConfig = {
            camera: camera,
            width: width,
            height: height,
            renderer: new WebGLRenderer( { antialias: true, alpha: true } ),
        }

        config.renderer.domElement.style.zIndex = "10";

        config.renderer.domElement.style.position = "absolute";
        config.renderer.domElement.style.top = "0";
        config.renderer.domElement.style.left = "0";

        container.nativeElement.appendChild(config.renderer.domElement);

        this.webGLScene = new SceneInstance(config);
    }

    public AddSampleBoxToScene(){
        var geometry = new BoxGeometry( 0.2, 0.2, 0.2 );

        var material = new MeshNormalMaterial();

        var mesh = new Mesh( geometry, material );
        
        this.webGLScene.scene.add( mesh );
    }

    private createCamera(fov : number, width: number, height: number) : PerspectiveCamera {
        return  new PerspectiveCamera(fov,
            width / height, 
            this.NEAREST_CAMERA_VALUE,
            this.FAREST_CAMERA_VALUE );
    }
}