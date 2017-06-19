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
    const vertex_position = [
      0.0, 1.0, 0.0,
      1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];

    // 頂点の色情報を格納する配列
    const vertex_color = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];

    // VBOの生成
    const position_vbo = createVbo(gl, vertex_position);
    const color_vbo = createVbo(gl, vertex_color);

    // VBO を登録する
    setAttribute(gl, [position_vbo, color_vbo], attLocation, attStride);

    // uniformLocationの取得
    const uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

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
    m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    // 一つ目のモデルを移動するためのモデル座標変換行列
    m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);

    // モデル×ビュー×プロジェクション(一つ目のモデル)
    m.multiply(tmpMatrix, mMatrix, mvpMatrix);

    // インスタンス変数の宣言
    this.gl = gl;
    this.count = 0;
    this.m = m;
    this.mMatrix = mMatrix;
    this.tmpMatrix = tmpMatrix;
    this.mvpMatrix = mvpMatrix;
    this.uniLocation = uniLocation;
    this.render = this.render.bind(this);
    this.loop = null;
  }

  render() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.count++;

    const rad = (this.count % 360) * Math.PI / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    this.m.identity(this.mMatrix);
    this.m.translate(this.mMatrix, [x, y + 1.0, 0.0], this.mMatrix);

    this.m.multiply(this.tmpMatrix, this.mMatrix, this.mvpMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation, false, this.mvpMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    
    this.m.identity(this.mMatrix);
    this.m.translate(this.mMatrix, [1.0, -1.0, 0.0], this.mMatrix);
    this.m.rotate(this.mMatrix, rad, [0, 1, 0], this.mMatrix);

    this.m.multiply(this.tmpMatrix, this.mMatrix, this.mvpMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation, false, this.mvpMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    
    const s = Math.sin(rad) + 1.0;
    this.m.identity(this.mMatrix);
    this.m.translate(this.mMatrix, [-1.0, -1.0, 0], this.mMatrix);
    this.m.scale(this.mMatrix, [s, s, 0.0], this.mMatrix);

    this.m.multiply(this.tmpMatrix, this.mMatrix, this.mvpMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation, false, this.mvpMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

    this.gl.flush();

    this.loop = requestAnimationFrame(this.render);
  }

  stop() {
    cancelAnimationFrame(this.loop);
  }
}
