export class CameraController{

    private videoElement: HTMLVideoElement;

    constructor(){}

    start(videoElement: HTMLVideoElement){
        this.videoElement = videoElement;
        this.loadCameraFeed();
    }

    canAccessCamera() : boolean {
        return ((!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)));
    }

    private existsVideoInputDevice() : boolean{
        var result = false;
        navigator.mediaDevices.enumerateDevices().then(devices => {
            result = devices.filter(device => device.kind == 'videoinput').length > 0;
        });
        return result;
    }

    private loadCameraFeed(){
        var userMediaRequest = navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: "environment"}});

        userMediaRequest.then((stream) => {
            this.videoElement.srcObject = stream;
            this.videoElement.play();
        });
        
        userMediaRequest.catch(error => { console.log("Error: "+error)});
    }
}