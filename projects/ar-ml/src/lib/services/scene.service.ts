import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Raycaster, Vector3, WebGLRenderer } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { SceneConfig } from '../models/scene.config';
import { SceneInstance } from '../models/scene.instance';

@Injectable({
    providedIn: 'root'
})
export class SceneService {

    readonly WEBGL_FOV: number = 70;
    readonly UI_RENDER_PERSPECTIVE = 1500;

    readonly NEAREST_CAMERA_VALUE: number = 1;
    readonly FAREST_CAMERA_VALUE: number = 1000

    private raycaster: Raycaster = new Raycaster();
    private webGLScene: SceneInstance;
    private css3DScene: SceneInstance;

    constructor() {
    }

    public createScene(container: ElementRef, width: number, height: number): Observable<boolean> {
        const createScecneObservable = new Observable<boolean>(observer => {
            try {
                this.createWebGLScene(container, width, height);
                this.createCSS3DScene(container, width, height);
                observer.next(true);

                this.update();
            } catch (ex) {
                observer.error(ex);
            }
        });

        return createScecneObservable;
    }

    public getUIScene(): SceneInstance {
        return this.css3DScene;
    }

    public getObjectScene(): SceneInstance {
        return this.webGLScene;
    }

    public addRectangle(position: Vector3) {
        var geometry = new PlaneGeometry(0.02, 0.02);

        var material = new MeshBasicMaterial({ color: new Color(0, 1, 0) });

        var mesh = new Mesh(geometry, material);

        position = position.unproject(this.webGLScene.camera);

        mesh.position.set(position.x, position.y, position.z);

        this.webGLScene.scene.add(mesh);
    }

    public launchRay(x: number, y: number) {
        this.raycaster.setFromCamera({ x, y }, this.webGLScene.camera);
        console.log(this.raycaster.intersectObjects(this.webGLScene.scene.children, true));
    }

    private update() {
        window.requestAnimationFrame(() => this.update());

        if (this.webGLScene) {
            this.webGLScene.update();
        }

        if (this.css3DScene) {
            this.css3DScene.update();
        }
    }

    private createCSS3DScene(container: ElementRef, width: number, height: number) {
        const fov = 180 * (2 * Math.atan(height / 2 / this.UI_RENDER_PERSPECTIVE)) / Math.PI

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

    private createWebGLScene(container: ElementRef, width: number, height: number) {
        let camera = this.createCamera(this.WEBGL_FOV, width, height);

        camera.position.set(0, 0, 1);

        let config: SceneConfig = {
            camera: camera,
            width: width,
            height: height,
            renderer: new WebGLRenderer({ antialias: true, alpha: true }),
        }

        this.setRendererDefaultStyle(config.renderer.domElement.style, "10");

        container.nativeElement.appendChild(config.renderer.domElement);

        this.webGLScene = new SceneInstance(config);
    }

    private createCamera(fov: number, width: number, height: number): PerspectiveCamera {
        return new PerspectiveCamera(fov,
            width / height,
            this.NEAREST_CAMERA_VALUE,
            this.FAREST_CAMERA_VALUE);
    }

    private setRendererDefaultStyle(style: any, zIndex: string) {
        style.zIndex = zIndex;

        style.position = "absolute";
        style.top = "0";
        style.left = "0";
    }
}