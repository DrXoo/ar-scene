# AR Scene
### Angular library
The purpose of this library is to simplify the creation of AR applications using Angular with capacitor. 
It is mainly a ThreeJS wrapper which load *Angular Components* dynamically inside a **CSS3DRenderer**.
You can also instantiate some 3D Objects with **WebGLRenderer**

## How to use it

> A 3D Engine has a life cycle totally different compared to
> web applications, here everything runs in a single component in
> your app and you need to specify the components to be loaded
> instead of using any routing

### Instantiate the scene

```html
<ar-ml  (onError)="onSceneError($event)"
		(onSceneReady)="onSceneReady($event)"  >
</ar-ml>
```

 - OnError: When an error happened at creating the scene or opening the camera
	 - Parameter: Message with the error
 - OnSceneReady: When the scene is ready to receive orders
	 - Parameter: ArSceneParameters object
		 - ObjectManager
		 - video (HTMLVideoElement) which will be the camera feed
### ObjectManager
This class act as a manager of created objects. You can use this manager on your component after instantiate the scene. This is not an angular service.
 - addUIObject: Creates a single UI Object where you want
 - manageUIObjects: Track a position and creates an UI object or changes the position if it is already created
 - manageArPointers: Track a position and creates a Mesh object or changes the position if it is already created
 - removeUIObject: Removes an UI Object
 - removeMeshObject: Removes a Mesh Object
### ArComponent interface
Every component that you want to be inside your AR Scene you need to implement this interface.
### ObjectNotificationService
If you need to remove your ArComponent from itself you can use this service.
## Examples
### Create single UI element
Creates an UI element in the mouse position clicked
```typescript
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
    this.objectManager.manageUIObjects(CardExampleComponent,
      <ArTrackConfig>{
        x: event.layerX,
        y: event.layerY,
        width: this.video.clientWidth,
        height: this.video.clientHeight,
        key: 'test'
      })
  }
```
### Manages UI Elements with Tensorflow
```typescript
  private async detect() {

    let predictions = await this.model.detect(this.video);

    predictions = predictions.filter(x => x.score > this.MIN_PROBABILITY_DETECT);
    if (predictions.length > 0) {
      predictions.forEach(element => {
        this.objectManager.manageUIObjects(CardExampleComponent,
          <ArTrackConfig>{
            x: element.bbox[0],
            y: element.bbox[1] + element.bbox[3]/2,
            width: this.video.clientWidth,
            height: this.video.clientHeight,
            key: element.class
          })
      });
    }

    requestAnimationFrame(() => this.detect());
  }
```
