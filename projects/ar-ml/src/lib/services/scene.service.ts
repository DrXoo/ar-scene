import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';
import { SceneConfig } from '../models/scene.config';
import { SceneInstance } from '../models/scene.instance';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

@Injectable({
  providedIn: 'root'
})
export class SceneService {

    readonly FOV : number = 45;
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

        this.camera.position.x = 100;
        this.camera.position.y = 100;
        this.camera.position.z = 500;
        this.camera.lookAt(this.css3DScene.scene.position);
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

    public addDivToCSS3DScene(content : string){
        let css3dObject = this.createCSS3DObject(content);

        css3dObject.position.set(100,100,100);

        this.css3DScene.AddToScene(css3dObject);
        console.log(this.css3DScene.config.renderer);
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

    private createCSS3DObject(content: string){
        var wrapper = document.createElement('div');
        wrapper.innerHTML = content;
  
        // wrapper.style.width = '320px';
        // wrapper.style.height = '240px';
        // wrapper.style.backgroundColor = 'white'
        console.log(wrapper);
      //   div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
  
        // create a CSS3Dobject and return it.
        var object = new CSS3DObject(wrapper);
        return object;
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