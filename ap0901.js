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
  // 制御変数の定義
  const param = {
    opacity: 1.0, // 透明度(検証用)
    follow: true, // 追跡
    birdsEye: false, // 俯瞰
    course: true, // コース
    axes: true, // 座標軸
    speedUp: false, // スピード2倍(検証用)
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "opacity", 0.0, 1.0).name("modelBoxの透明度")
    .onChange(() => {
     modelBox.material.opacity = param.opacity;
    });
  gui.add(param, "follow").name("追跡");
  gui.add(param, "birdsEye").name("俯瞰");
  gui.add(param, "course").name("コース");
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "speedUp").name("スピード2倍モード");


  


  // シーン作成
  const scene = new THREE.Scene();


  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);


  // スコア表示
  // let score = 0;
  // let life = 3;
  // function setScore(score) {
  //   document.getElementById("score").innerText
  //     = String(Math.round(score)).padStart(8, "0");
  //   document.getElementById("life").innerText
  //     = (life > 0) ? "○○○".substring(0, life) : "-- Game Over --";
  // }


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


  // カメラ制御
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;


  // モデルの読み込み
  let xwing; // モデルを格納する変数
  function loadModel() { // モデル読み込み関数の定義
    const loader = new GLTFLoader();
    loader.load(
      "xwing.glb", // モデルのファイル
        (gltf) => {  // 読み込み終了時に実行される関数
        xwing = gltf.scene; // モデルのシーンを取り出す
        scene.add(xwing); // Three.jsのシーンに追加する
        render(); // 描画開始
      }
    );
  }
  loadModel(); // モデル読み込み実行

  // モデルのスピード変更
  function modelSpeedChange() {
    if(param.speedUp) {
      speed = 10;
    } else {
      speed = 20;
    }
  }


  // 光源の設定
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


  // モデルの横移動
  function moveModel(x) {
    xwing.position.x += x;
    modelBox.position.x += x;
  }

  // キー操作対応
  let rightPressed = false;
  let leftPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }
  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }
  function down() {
    if (rightPressed) {
      if(xwing.position.y > 25) {
        moveModel(3);
      } else {
        moveModel(-3);
      }
    } else if (leftPressed) {
      if(xwing.position.y > 25) {
        moveModel(-3);
      } else {
        moveModel(3);
      }
    }
  }

  // ブロックの生成
  // 下段用ブロック
  const blocksD = new THREE.Group();
  function makeblocksD(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({color: "red"})
      );
      blockR.position.set(
        Math.random() * 6 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockR.geometry.computeBoundingBox();
      blocksD.add(blockR);
    }
    // 緑ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockG = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({color: "green"})
      );
      blockG.position.set(
        Math.random() * 8 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockG.geometry.computeBoundingBox();
      blocksD.add(blockG);
    }
    scene.add(blocksD);
  }
  function remakeblocksD() {
    scene.remove(blocksD);
    blocksD.clear();
    makeblocksD();
  }
  // 上段用ブロック
  const blocksU = new THREE.Group();
  function makeblocksU(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 2),
        new THREE.MeshLambertMaterial({color: "red"})
      );
      blockR.position.set(
        Math.random() * 6 - 3,
        50,
        Math.random() * 200 - 75
      )
      blockR.geometry.computeBoundingBox();
      blocksU.add(blockR);
    }
    // 緑ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockG = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 2),
        new THREE.MeshLambertMaterial({color: "green"})
      );
      blockG.position.set(
        Math.random() * 8 - 3,
        50,
        Math.random() * 200 - 75
      )
      blockG.geometry.computeBoundingBox();
      blocksU.add(blockG);
    }
    scene.add(blocksU);
  }
  function remakeblocksU() {
    scene.remove(blocksU);
    blocksU.clear();
    makeblocksU();
  }
  
  // モデル側の当たり判定modelBoxの作成
  let modelBox;
  modelBox = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 2),
    new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF,
      opacity: param.opacity,
      transparent: true
    })
  );
  modelBox.geometry.computeBoundingBox();
  scene.add (modelBox);

  // 下段移動判定用ボックスの作成
  const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 10),
    new THREE.MeshLambertMaterial({color: 0x404040})
  );
  box1.position.set(0, 25, -175);
  box1.geometry.computeBoundingBox();
  scene.add(box1);
  // 上段移動判定用ボックスの作成
  const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 10),
    new THREE.MeshLambertMaterial({color: 0x404040})
  );
  box2.position.set(0, 25, 175);
  box2.geometry.computeBoundingBox();
  scene.add(box2);

  // 上下段移動判定用ボックスの通過、赤緑ボックスの衝突判定
  function blockCheck() {
    let hit = false;
    const modelBoxC = new THREE.Box3().setFromObject(modelBox);
    if (!hit) {
      // 上下段移動判定用ボックスの通過
      let boxD = new THREE.Box3().setFromObject(box1);
      let boxU = new THREE.Box3().setFromObject(box2);
      if (boxD.intersectsBox(modelBoxC)) {
        hit = true;
        remakeblocksD();
      } else if (boxU.intersectsBox(modelBoxC)) {
        hit = true;
        remakeblocksU();
      }
      // 赤緑ボックスの衝突判定
      blocksD.children.forEach((blockR) => {
        let block1 = new THREE.Box3().setFromObject(blockR);
        if(block1.intersectsBox(modelBoxC)) {
          hit = true;
          blockR.visible = false;
        }
      })
      blocksD.children.forEach((blockG) => {
        let block2 = new THREE.Box3().setFromObject(blockG);
        if(block2.intersectsBox(modelBoxC)) {
          hit = true;
          blockG.visible = false;
        }
      })
      blocksU.children.forEach((blockR) => {
        let block3 = new THREE.Box3().setFromObject(blockR);
        if(block3.intersectsBox(modelBoxC)) {
          hit = true;
          blockR.visible = false;
        }
      })
      blocksU.children.forEach((blockG) => {
        let block4 = new THREE.Box3().setFromObject(blockG);
        if(block4.intersectsBox(modelBoxC)) {
          hit = true;
          blockG.visible = false;
        }
      })
    }
  }


  // 平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshLambertMaterial({ color: 0x404040 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  scene.add(plane);


  // 自動操縦コースの設定
  // 制御点
  const controlPoints = [
    [0, 50, 175],
    [0, 50, -175],
    [0, 0, -175],
    [0, 0, 175]
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


  


  // 描画処理
  // 描画のための変数
  const clock = new THREE.Clock();
  const xwingPosition = new THREE.Vector3();
  const xwingTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  let speed = 20;
  // 描画関数
  function render(time) {
    // xwing の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / speed;
    course.getPointAt(elapsedTime % 1, xwingPosition);
    xwing.position.copy(xwingPosition);
    course.getPointAt((elapsedTime+0.01) % 1, xwingTarget);
    xwing.lookAt(xwingTarget);
    // カメラの位置の切り替え
    if(param.follow) {
      // xwing後方から
      cameraPosition.lerpVectors(xwingTarget, xwing.position, 4);
      cameraPosition.y += 2.5;
      camera.position.copy(cameraPosition);
      camera.lookAt(xwing.position); // 飛行機を見る
      camera.up.set(0,1,0); // カメラの上をy軸正の向きにする
    }
    else if(param.birdsEye) {
      camera.position.set(0,750,0); // 上空から
      camera.lookAt(plane.position); // 平面の中央を見る
      camera.up.set(0,0,-1); // カメラの上をz軸負の向きにする
    }
    else {
      camera.position.set(10,-10,10); // 下の方から
      camera.lookAt(xwing.position); // 飛行機を見る
      camera.up.set(0,1,0); // カメラの上をy軸正の向きにする
    }


    // ブロック生成
    blockCheck();

    // スピード変更
    modelSpeedChange();

    // キー入力対応
    down();
    
    // modelBoxの位置
   modelBox.position.copy(xwing.position);

    // // スコア更新
    // setScore(score);

    // コース表示の有無
    courseObject.visible = param.course;

    // 座標軸の有無
    axes.visible = param.axes;

    // 描画
    renderer.render(scene, camera);

    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }
  
}

init();