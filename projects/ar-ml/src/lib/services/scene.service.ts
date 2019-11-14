import { Injectable, ElementRef } from '@angular/core';
import { PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, Vector2, Raycaster } from 'three';
import { SceneConfig } from '../models/scene.config';
import { SceneInstance } from '../models/scene.instance';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { UIObject } from '../models/uiObject';
import { SceneObjectConfig } from '../models/scene-object-config';
import { Observable } from 'rxjs';

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

    public createScene(container: ElementRef,  width : number, height : number) : boolean{
        try{
            this.createWebGLScene(container, width, height);
            this.createCSS3DScene(container, width, height);
            return true;
        }catch(ex){
            return false;
        }  
    }

    public addUIElement(element: ElementRef, sceneObjectConfig: SceneObjectConfig) : string{

        let uiObject = new UIObject(
            element.nativeElement, 
            new Vector2(this.css3DScene.config.width, this.css3DScene.config.height),
            sceneObjectConfig
        );

        this.css3DScene.AddToScene(uiObject);

        return uiObject.uuid;
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
        
        this.setRendererDefaultStyle(config.renderer.domElement.style, "20");

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

        this.setRendererDefaultStyle(config.renderer.domElement.style, "10");

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

    private setRendererDefaultStyle(style: any, zIndex: string){
        style.zIndex = zIndex;

        style.position = "absolute";
        style.top = "0";
        style.left = "0";
    }
}