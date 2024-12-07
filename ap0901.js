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


  


  // シーン作成
  const scene = new THREE.Scene();


  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);


  // スコア表示
  let score = 0;
  let life = 3;
  function setScore(score) {
    document.getElementById("score").innerText
      = String(Math.round(score)).padStart(8, "0");
  //   document.getElementById("life").innerText
  //     = (life > 0) ? "○○○".substring(0, life) : "-- Game Over --";
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
  const blocksDR = new THREE.Group();
  const blocksDG = new THREE.Group();
  function makeblocksD(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockDR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({color: "red"})
      );
      blockDR.position.set(
        Math.random() * 6 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockDR.geometry.computeBoundingBox();
      blocksDR.add(blockDR);
    }
    // 緑ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockDG = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({color: "green"})
      );
      blockDG.position.set(
        Math.random() * 8 - 3,
        -1,
        Math.random() * 200 - 75
      )
      blockDG.geometry.computeBoundingBox();
      blocksDG.add(blockDG);
    }
    scene.add(blocksDR);
    scene.add(blocksDG);
  }
  function remakeblocksD() {
    scene.remove(blocksDR);
    blocksDR.clear();
    scene.remove(blocksDG);
    blocksDG.clear();
    makeblocksD();
  }
  // 上段用ブロック
  const blocksUR = new THREE.Group();
  const blocksUG = new THREE.Group();
  function makeblocksU(){
    // 赤ブロックを並べる
    for (let i = 0; i < 3; i++) {
      const blockUR = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({color: "red"})
      );
      blockUR.position.set(
        Math.random() * 6 - 3,
        51,
        Math.random() * 175 - 75
      )
      blockUR.geometry.computeBoundingBox();
      blocksUR.add(blockUR);
    }
    // 緑ブロックを並べる
    for (let i = 0; i < 5; i++) {
      const blockUG = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial({color: "green"})
      );
      blockUG.position.set(
        Math.random() * 8 - 3,
        51,
        Math.random() * 175 - 75
      )
      blockUG.geometry.computeBoundingBox();
      blocksUG.add(blockUG);
    }
    scene.add(blocksUR);
    scene.add(blocksUG);
  }
  function remakeblocksU() {
    scene.remove(blocksUR);
    blocksUR.clear();
    scene.remove(blocksUG);
    blocksUG.clear();
    makeblocksU();
  }
  
  // モデル側の当たり判定modelBoxの作成
  let modelBox;
  modelBox = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 2),
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

  function blockCheckD() {
    const modelBox2 = new THREE.Box3().setFromObject(modelBox);
    // 赤緑ボックスの衝突判定
    // 下段赤
    blocksDR.children.forEach((blockDR) => {
      const block1 = new THREE.Box3().setFromObject(blockDR);
      if(block1.intersectsBox(modelBox2) && blockDR.visible) {
        blockDR.visible = false;
      }
    });
    // 下段緑
    blocksDG.children.forEach((blockDG) => {
      const block2 = new THREE.Box3().setFromObject(blockDG);
      if(block2.intersectsBox(modelBox2) && blockDG.visible) {
        score += 100;
        blockDG.visible = false;
      }
    });
  }

  function blockCheckU() {
    const modelBox3 = new THREE.Box3().setFromObject(modelBox);
    // 上段赤
    blocksUR.children.forEach((blockUR) => {
      const block3 = new THREE.Box3().setFromObject(blockUR);
      if(block3.intersectsBox(modelBox3) && blockUR.visible) {
        blockUR.visible = false;
      }
    });
    // 上段緑
    blocksUG.children.forEach((blockUG) => {
      const block4 = new THREE.Box3().setFromObject(blockUG);
      if(block4.intersectsBox(modelBox3) && blockUG.visible) {
        score += 100;
        blockUG.visible = false;
      }
    });
  }


  // 平面の作成
  // const plane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(300, 300),
  //   new THREE.MeshLambertMaterial({ color: 0x404040 }));
  // plane.rotation.x = -Math.PI / 2;
  // plane.position.y = -5;
  // scene.add(plane);


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
  // 描画関数
  function render() {
    // xwing の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 10;
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

    // 上下位置の判定
    UDCheck();

    // ブロックとの判定
    blockCheckD();
    blockCheckU();

    // スコア更新
    setScore(score);

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