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
    reload: false
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "reload").name("リスタート");

  // シーン作成
  const scene = new THREE.Scene();


  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  axes.visible = false;
  scene.add(axes);


  // スコア表示
  let score = 0;
  let life = 3;
  function setScore(score) {
    document.getElementById("score").innerText
      = String(Math.round(score)).padStart(8, "0");
    document.getElementById("life").innerText
      = (life > 0) ? "○○○".substring(0, life) : "-- Game Over --";
  }


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

  // 光源の設定
  // 環境ライト
  {
    const light = new THREE.AmbientLight();
    light.intensity=0.8;
    scene.add(light);
  }
  // スポットライト
  { 
    const light1 = new THREE.PointLight(0xffffff, 3000);
    light1.position.set(0, 100, 0); 
    light1.lookAt(0,0,0);
    scene.add(light1);
  }
  { 
    const light2 = new THREE.PointLight(0xffffff, 3000);
    light2.position.set(0, -100, 0); 
    light2.lookAt(0,0,0);
    scene.add(light2);
  }


  // モデルの横移動
  function moveModel(x) {
    xwing.position.x += x;
    modelBox.position.x += x;
  }

  // キー操作対応
  let rightPressed = false;
  let leftPressed = false;
  let enterPressed = false;
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
    } else if(e.key == "Enter") {
      enterPressed = true;
    }
  }
  function down() {
    if (rightPressed) {
      // →で右移動
      if(xwing.position.y > 25) {
        moveModel(3);
      } else {
        moveModel(-3);
      }
    } else if (leftPressed) {
      // ←で左移動
      if(xwing.position.y > 25) {
        moveModel(-3);
      } else {
        moveModel(3);
      }
    } else if (enterPressed) {
      // enterでリスタート
      location.reload();
    }
  }

  // ブロックの生成
  // 下段用ブロック
  const blocksDR = new THREE.Group();
  const blocksDY = new THREE.Group();
  function makeblocksD(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockDR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({
          color: "red",
          transparent: true,
          opacity: 0.5
        })
      );
      blockDR.position.set(
        Math.random() * 6 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockDR.geometry.computeBoundingBox();
      blocksDR.add(blockDR);
    }
    // 黄色ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockDY = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({
          color: "yellow",
          transparent: true,
          opacity: 0.5
        })
      );
      blockDY.position.set(
        Math.random() * 8 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockDY.geometry.computeBoundingBox();
      blocksDY.add(blockDY);
    }
    scene.add(blocksDR);
    scene.add(blocksDY);
  }
  function remakeblocksD() {
    scene.remove(blocksDR);
    blocksDR.clear();
    scene.remove(blocksDY);
    blocksDY.clear();
    makeblocksD();
  }
  // 上段用ブロック
  const blocksUR = new THREE.Group();
  const blocksUY = new THREE.Group();
  function makeblocksU(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockUR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({
          color: "red",
          transparent: true,
          opacity: 0.5
        })
      );
      blockUR.position.set(
        Math.random() * 6 - 3,
        51,
        Math.random() * 175 - 75
      )
      blockUR.geometry.computeBoundingBox();
      blocksUR.add(blockUR);
    }
    // 黄色ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockUY = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({
          color: "yellow",
          transparent: true,
          opacity: 0.5
        })
      );
      blockUY.position.set(
        Math.random() * 8 - 3,
        51,
        Math.random() * 175 - 75
      )
      blockUY.geometry.computeBoundingBox();
      blocksUY.add(blockUY);
    }
    scene.add(blocksUR);
    scene.add(blocksUY);
  }
  function remakeblocksU() {
    scene.remove(blocksUR);
    blocksUR.clear();
    scene.remove(blocksUY);
    blocksUY.clear();
    makeblocksU();
  }
  
  // モデル側の当たり判定modelBoxの作成
  let modelBox;
  modelBox = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 2),
    new THREE.MeshLambertMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0
    })
  );
  modelBox.geometry.computeBoundingBox();
  scene.add (modelBox);

  // 下段移動判定用ボックスの作成
  const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 10),
    new THREE.MeshLambertMaterial({
      color: 0x404040,
      opacity: 0.0,
      transparent: true
    })
  );
  box1.position.set(0, 25, -175);
  box1.geometry.computeBoundingBox();
  scene.add(box1);
  // 上段移動判定用ボックスの作成
  const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 10),
    new THREE.MeshLambertMaterial({
      color: 0x404040,
      opacity: 0,
      transparent: true
    })
  );
  box2.position.set(0, 25, 175);
  box2.geometry.computeBoundingBox();
  scene.add(box2);

  // 上下段移動判定用ボックスの通過
  function UDCheck() {
    const modelBox1 = new THREE.Box3().setFromObject(modelBox);
    // 上下段移動判定用ボックスの通過
    const boxD = new THREE.Box3().setFromObject(box1);
    const boxU = new THREE.Box3().setFromObject(box2);
    if (boxD.intersectsBox(modelBox1)) {
      remakeblocksD();
    } else if (boxU.intersectsBox(modelBox1)) {
      remakeblocksU();
    }
  }
  // 下段赤黄ボックスの衝突判定
  function blockCheckD(time) {
    const modelBox2 = new THREE.Box3().setFromObject(modelBox);
    // 下段赤
    blocksDR.children.forEach((blockDR) => {
      const block1 = new THREE.Box3().setFromObject(blockDR);
      if(block1.intersectsBox(modelBox2) && blockDR.visible) {
        life += -1;
        blockDR.visible = false;
      }
    });
    // 下段黄色
    blocksDY.children.forEach((blockDY) => {
      const block2 = new THREE.Box3().setFromObject(blockDY);
      if(block2.intersectsBox(modelBox2) && blockDY.visible) {
        if(life > 0) {
          score += 100 * time;
        }
        blockDY.visible = false;
      }
    });
  }
  // 上段赤黄ボックスの衝突判定
  function blockCheckU(time) {
    const modelBox3 = new THREE.Box3().setFromObject(modelBox);
    // 上段赤
    blocksUR.children.forEach((blockUR) => {
      const block3 = new THREE.Box3().setFromObject(blockUR);
      if(block3.intersectsBox(modelBox3) && blockUR.visible) {
        life += -1;
        blockUR.visible = false;
      }
    });
    // 上段黄色
    blocksUY.children.forEach((blockUY) => {
      const block4 = new THREE.Box3().setFromObject(blockUY);
      if(block4.intersectsBox(modelBox3) && blockUY.visible) {
        if(life > 0) {
          score += 100 * time;
        }
        blockUY.visible = false;
      }
    });
  }



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
  courseObject.visible = false;
  scene.add(courseObject);


  


  // 描画処理
  // 描画のための変数
  const clock = new THREE.Clock();
  const xwingPosition = new THREE.Vector3();
  const xwingTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  // 描画関数
  function render() {
    // xwing の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 10;
    course.getPointAt(elapsedTime % 1, xwingPosition);
    xwing.position.copy(xwingPosition);
    course.getPointAt((elapsedTime+0.01) % 1, xwingTarget);
    xwing.lookAt(xwingTarget);
    // カメラの位置の再設定
    cameraPosition.lerpVectors(xwingTarget, xwing.position, 4);
    cameraPosition.y += 2.5;
    camera.position.copy(cameraPosition);
    camera.lookAt(xwing.position); // 飛行機を見る
    camera.up.set(0,1,0); // カメラの上をy軸正の向きにする

    // 上下位置の判定
    UDCheck();

    // ブロックとの判定
    blockCheckD(elapsedTime);
    blockCheckU(elapsedTime);

    // スコア更新
    setScore(score);

    // キー入力対応
    down();
    
    // modelBoxの位置
   modelBox.position.copy(xwing.position);

    // リスタート
    if(param.reload) {
      location.reload();
    }

    // 描画
    renderer.render(scene, camera);

    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }
  
}

init();