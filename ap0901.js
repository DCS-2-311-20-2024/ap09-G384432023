//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38443-2023 佐々木真聡
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import { GUI } from "ili-gui";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/addons";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義(仮置き)
  const param = {
    opacity: 0.5, // 透明度
    background: false, // 背景
    follow: true, // 追跡
    birdsEye: false, // 俯瞰
    course: true, // コース
    axes: true, // 座標軸
    moveModel_x: false, // モデル位置移動(仮置き)
    moveModel_y: false, // モデル位置移動(仮置き)
    moveModel_z: false // モデル位置移動(仮置き)
  };

  // GUIコントローラの設定(仮置き)
  const gui = new GUI();
  gui.add(param, "opacity", 0.0, 1.0).name("ビルの透明度")
    .onChange(() => {
      buildings.children.forEach((building) => {
        building.material.opacity = param.opacity;
      })
    });
  gui.add(param, "background").name("背景");
  gui.add(param, "follow").name("追跡");
  gui.add(param, "birdsEye").name("俯瞰");
  gui.add(param, "course").name("コース");
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "moveModel_x").name("x移動");
  gui.add(param, "moveModel_y").name("y移動");
  gui.add(param, "moveModel_z").name("z移動");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(150,80,0);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x102040)
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラ制御(仮置き)
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.listenToKeyEvents(window);
  orbitControls.enableDamping = true;

  // モデルの読み込み(仮置き)
  let mainModel; // モデルを格納する変数
  function loadModel() { // モデル読み込み関数の定義
    const loader = new GLTFLoader();
    loader.load(
      "blue_falcon_with_liberties_taken.glb", // モデルのファイル
        (gltf) => {  // 読み込み終了時に実行される関数
        mainModel = gltf.scene; // モデルのシーンを取り出す
        scene.add(mainModel); // Three.jsのシーンに追加する
        // render(); // 描画開始
        setBackground();
      }
    );
  }
  loadModel(); // モデル読み込み実行

  // 背景の設定(仮置き)
  let renderTarget;
  function setBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "csl01.jpg",
      () => {
        renderTarget
          = new THREE.WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer, texture);
        scene.background = renderTarget.texture;
        render();
      }
    )
  }

  // 光源の設定(仮置き)
  // 環境ライト
  {
    const light = new THREE.AmbientLight();
    light.intensity=0.8;
    scene.add(light);
  }
  // スポットライト
  { 
    const light = new THREE.PointLight(0xffffff, 3000);
    light.position.set(0, 40, 0); 
    light.lookAt(0,0,0);
    scene.add(light);
  }

  // 構造物の作成(仮置き)
  const buildings = new THREE.Group();
  {
    // const w = 10;
    // const h = 20;
    // const d = 10;
    const gap = 10;
    const n = 10;
    let randomNumber1;
    let randomNumber2;
    for(let c = 0; c < n; c++) {
      for(let r = 0; r < n; r++) {
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 5),
          new THREE.MeshPhongMaterial({
            color: 0x408080,
            opacity: param.opacity,
            transparent: true
          })
        );
        randomNumber1 = Math.random()*50;
        randomNumber2 = Math.random()*50;
        building.position.set(
          // (gap + w) * c - (gap + w) * (n - 1) / 2,
          Math.random()*50 - randomNumber1,
          Math.random()*20,
          // (gap + w) * r - (gap + w) * (n - 1) / 2 
          Math.random()*50 - randomNumber2
        )
        buildings.add(building);
      }
    }
  }
  scene.add(buildings);

  // 平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0x404040 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  scene.add(plane);

  // 自動操縦コースの設定(仮置き)
  // 制御点
  const controlPoints = [
    [0, 0, 0],
    [0, 5, 40],
    [40, 5, 40],
    [40, 10, -20],
    [-40, 10, -20],
    [-40, 0, 20],
    [40, -3, 20],
    [40, -3, -40],
    [0, 0, -40],
  ]
  // コースの補間
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course = new THREE.CatmullRomCurve3(
    controlPoints.map((p, i) => {
      p0.set(...p);
      p1.set(...controlPoints[(i + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0), 
        (new THREE.Vector3()).lerpVectors(p0, p1, 1/3), 
        (new THREE.Vector3()).lerpVectors(p0, p1, 2/3),
      ];
    }).flat(), true
  );
  // コースの描画
  const points = course.getPoints(300);
  const courseObject = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: "red"})
  );
  scene.add(courseObject);

  // モデルのコースに対する位置の移動(仮置き)
  function moveModel(x, y, z) {
    mainModel.position.x += x;
    mainModel.position.y += y;
    mainModel.position.z += z;
  }

  // Windowサイズの変更処理
  window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false);

  // 描画処理
  // 描画のための変数(仮置き)
  const clock = new THREE.Clock();
  const mainModelPosition = new THREE.Vector3();
  const mainModelTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  let model_x;
  let model_y;
  let model_z;
  // 描画関数
  function render() {
    // mainModel の位置と向きの設定(仮置き)
    const elapsedTime = clock.getElapsedTime() / 30;
    course.getPointAt(elapsedTime % 1, mainModelPosition);
    mainModel.position.copy(mainModelPosition);
    // モデルのコースに対する位置の変更(仮置き)
    if(param.moveModel_x) {
      model_x = 1;
    } else {
      model_x = 0;
    }
    if(param.moveModel_y) {
      model_y = 1;
    } else {
      model_y = 0;
    }
    if(param.moveModel_z) {
      model_z = 1;
    } else {
      model_z = 0;
    }
    moveModel(model_x, model_y, model_z); //
    course.getPointAt((elapsedTime+0.01) % 1, mainModelTarget);
    mainModel.lookAt(mainModelTarget);

    // 背景の切り替え(仮置き)
    if(param.background) {
      scene.background = renderTarget.texture;
      plane.visible = false;
    }
    else {
      scene.background = null;
      plane.visible = true;
    }
    // カメラの位置の切り替え(仮置き)
    if(param.follow) {
      // mainModel後方から
      cameraPosition.lerpVectors(mainModelTarget, mainModelPosition, 4);
      cameraPosition.y += 2.5;
      camera.position.copy(cameraPosition);
      camera.lookAt(mainModel.position); // 飛行機を見る
      camera.up.set(0,1,0); // カメラの上をy軸正の向きにする
    }
    else if(param.birdsEye) {
      camera.position.set(0,150,0); // 上空から
      camera.lookAt(plane.position); // 平面の中央を見る
      camera.up.set(0,0,-1); // カメラの上をz軸負の向きにする
    }
    else {
      camera.position.set(10,-10,10); // 下の方から
      camera.lookAt(mainModel.position); // 飛行機を見る
      camera.up.set(0,1,0); // カメラの上をy軸正の向きにする
    }
    // コース表示の有無
    courseObject.visible = param.course;
    // 座標軸の有無
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  // render();
}

init();