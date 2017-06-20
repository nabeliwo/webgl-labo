import matIV from '../../libs/minMatrix';
import {
  createShader,
  createProgram,
  createVbo,
  setAttribute
} from '../helper';

export default class Renderer {
  constructor() {
    // canvasエレメントを取得
    const c = document.getElementById('canvas');
    c.width = 300;
    c.height = 300;

    // webglコンテキストを取得
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // 頂点シェーダとフラグメントシェーダの生成
    const v_shader = createShader(gl, 'vs', `
      attribute vec3 position;
      attribute vec4 color;
      uniform   mat4 mvpMatrix;
      varying   vec4 vColor;

      void main(void) {
        vColor = color;
        gl_Position = mvpMatrix * vec4(position, 1.0);
      }
    `);
    const f_shader = createShader(gl, 'fs', `
      precision mediump float;

      varying vec4 vColor;

      void main(void) {
        gl_FragColor = vColor;
      }
    `);

    // プログラムオブジェクトの生成とリンク
    const prg = createProgram(gl, v_shader, f_shader);

    // attributeLocationを配列に取得
    const attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');

    // attributeの要素数を配列に格納
    const attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;

    // 頂点の位置情報を格納する配列
    const vertexPosition = [
      [
        0.0, 3.4, 0.0,
        4.0, -3.4, 0.0,
        -4.0, -3.4, 0.0
      ],
      [
        2.4, 0.2, 0.2,
        0.0, -3.8, 0.2,
        -2.4, 0.2, 0.2
      ]
    ];

    // 頂点の色情報を格納する配列
    const vertexColor = [
      [
        0.25, 0.56, 0.75, 1.0,
        0.25, 0.56, 0.75, 1.0,
        0.25, 0.56, 0.75, 1.0
      ],
      [
        0.41, 0.8, 0.8, 1.0,
        0.41, 0.8, 0.8, 1.0,
        0.41, 0.8, 0.8, 1.0
      ]
    ];

    // minMatrix.js を用いた行列関連処理
    // matIVオブジェクトを生成
    const m = new matIV();

    // 各種行列の生成と初期化
    const mMatrix = m.identity(m.create());
    const vMatrix = m.identity(m.create());
    const pMatrix = m.identity(m.create());
    const tmpMatrix = m.identity(m.create());
    const mvpMatrix = m.identity(m.create());

    // ビュー×プロジェクション座標変換行列
    m.lookAt([0.0, 0.0, 10.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    // インスタンス変数の宣言
    this.gl = gl;
    this.count = 0;
    this.m = m;
    this.prg = prg;
    this.attLocation = attLocation;
    this.attStride = attStride;
    this.vertexPosition = vertexPosition;
    this.vertexColor = vertexColor;
    this.mMatrix = mMatrix;
    this.tmpMatrix = tmpMatrix;
    this.mvpMatrix = mvpMatrix;
    this.render = this.render.bind(this);
    this.loop = null;
  }

  render() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.count++;
    const rad = (this.count % 360) * Math.PI / 180;

    for (let i = 0, l = this.vertexPosition.length; i < l; i++) {
      // VBOの生成
      const positionVbo = createVbo(this.gl, this.vertexPosition[i]);
      const colorVbo = createVbo(this.gl, this.vertexColor[i]);

      // VBO を登録する
      setAttribute(this.gl, [positionVbo, colorVbo], this.attLocation, this.attStride);

      // uniformLocationの取得
      const uniLocation = this.gl.getUniformLocation(this.prg, 'mvpMatrix');

      this.m.identity(this.mMatrix);
      this.m.rotate(this.mMatrix, rad, [0, 1, 0], this.mMatrix);

      this.m.multiply(this.tmpMatrix, this.mMatrix, this.mvpMatrix);
      this.gl.uniformMatrix4fv(uniLocation, false, this.mvpMatrix);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    this.gl.flush();

    this.loop = requestAnimationFrame(this.render);
  }

  stop() {
    cancelAnimationFrame(this.loop);
  }
}
