import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  BokehPass,
  BokehPassParamters,
} from 'three/examples/jsm/postprocessing/BokehPass.js';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-three-js-scene',
  templateUrl: './three-js-scene.component.html',
  styleUrls: ['./three-js-scene.component.css'],
})
export class ThreeJsSceneComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private stats: Stats = new Stats();
  private scrollPercent: number = 0;
  private composer!: EffectComposer;
  private object3D!: THREE.Mesh;
  private clock: THREE.Clock = new THREE.Clock();
  private isAnimationFrameRequested = false;

  @ViewChild('ngThree') ngThree: any;
  @Input() scrollPosition: number = 0;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThreeJs();
    this.createScene();
    this.load3DObject();
    this.createCamera();
    this.createRenderer();
    this.createPostProcessing();
    this.animate();
    this.addLight();

    // window.addEventListener('resize', () => {
    //   this.resizeRenderer();
    // });

    // fromEvent(window, 'scroll')
    //   .pipe(throttleTime(16)) // Adjust the throttle time as needed
    //   .subscribe(() => {
    //     // this.updatePosition();
    //     this.requestAnimationFrame();
    //   });

    this.animate();
  }

  ngOnDestroy(): void {
    // Clean up resources if needed
  }

  private initThreeJs(): void {
    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Initialize any Three.js related setup here
    // For example, you may want to configure WebGLRenderer options.
    // See: https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  }

  private playScrollAnimations(): void {
    this.animationScripts.forEach((a) => {
      if (this.scrollPercent >= a.start && this.scrollPercent < a.end) {
        a.func();
      }
    });
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  onScroll(): void {
    this.scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
          document.documentElement.clientHeight)) *
      100;
    // Update your UI or perform other actions based on the scroll percentage
  }

  private lerp(x: number, y: number, a: number): number {
    return (1 - a) * x + a * y;
  }

  private scalePercent(start: number, end: number): number {
    return (this.scrollPercent - start) / (end - start);
  }

  private animationScripts: { start: number; end: number; func: () => void }[] =
    [
      // Add your animation scripts here
    ];
  private createScene(): void {
    this.scene = new THREE.Scene();
  }

  private createCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 3000,
      0.1,
      1000
    );
    // this.camera.position.z = this.calculateCameraZPosition();
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  }

  // private calculateCameraZPosition(): number {
  //   // Calculate the appropriate z-position based on your scene content
  //   // You may need to adjust this based on the depth of your objects
  //   // For example, find the maximum distance from the camera to any object in the scene
  //   // this.maxObjectDistance = MAX_DISTANCE;

  //   // Set the camera position based on the maximum distance
  //   return 4 / Math.tan((this.camera.fov * Math.PI) / 360);
  // }

  private createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, 3000);
    this.elementRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  }

  private createPostProcessing(): void {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bokehPassParams: BokehPassParamters = {
      // focus: 1.0,
      // aperture: 0.12,
      // maxblur: 0.4,
      focus: 2.0,
      aperture: 0.1,
      maxblur: 0.8,
    };

    const bokehPass = new BokehPass(this.scene, this.camera, bokehPassParams);
    this.composer.addPass(bokehPass);
  }

  private load3DObject(): void {
    const loader = new GLTFLoader();

    loader.load('assets/3d-models/Rose 🌹 .gltf', (gltf: any) => {
      this.object3D = gltf.scene.children[0] as THREE.Mesh;

      this.object3D.position.set(0.7, 2.1, 0);
      this.object3D.rotation.set(0, 0, 0);
      this.object3D.scale.set(25, 25, 25);

      this.scene.add(this.object3D);
    });
  }

  private addLight(): void {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        this.render();
      };
      animateFn();
    });
  }

  private render(): void {
    if (this.object3D) {
      this.object3D.rotation.y += 0.004;
    }

    this.composer.render();
  }

  private resizeRenderer(): void {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(newWidth, newHeight);
    this.composer.setSize(newWidth, newHeight);
  }

  // private updatePosition(): void {
  //   if (this.elementRef.nativeElement) {
  //     const scrollOffset = this.scrollPosition * 0.1;
  //     this.elementRef.nativeElement.style.top = `${scrollOffset}px`;
  //   }
  // }

  private requestAnimationFrame(): void {
    if (!this.isAnimationFrameRequested) {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.render();
          this.isAnimationFrameRequested = false;
        });
      });
      this.isAnimationFrameRequested = true;
    }
  }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   // Handle scroll event if needed
  // }
}
