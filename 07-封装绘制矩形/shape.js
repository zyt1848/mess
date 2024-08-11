/**
 * My WebGL class Shape
 */
'use strict'
class Shape {
    constructor(selector) {
        const canvas = document.querySelector(selector);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.gl = canvas.getContext("webgl");

        this.points = [];
        this.rectPoints = [];
    }

    initShader() {
        // 创建顶点着色器
        this.vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vShader, /*glsl*/`
            attribute vec4 v_position;
            void main() {
                gl_PointSize = 10.0; // 数字不能加f
                gl_Position = v_position;
            }
        `);
        // 编译顶点着色器
        this.gl.compileShader(this.vShader);

        // 创建片段着色器
        this.fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fShader, /*glsl*/`
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
            }
        `);
        // 编译片段着色器
        this.gl.compileShader(this.fShader);
    }

    initProgram() {
        // 创建着色器程序，链接顶点着色器和片段着色器
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vShader);
        this.gl.attachShader(this.program, this.fShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw this.gl.getProgramInfoLog(this.program);
        }
        this.gl.useProgram(this.program);
    }

    initAttrib() {
        // 创建顶点数据
        const position = this.gl.getAttribLocation(this.program, "v_position");
        // 创建缓冲区
        const vbo = this.gl.createBuffer();
        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        // 将顶点数据提供给attribute变量
        this.gl.vertexAttribPointer(
            position, //告诉attribute变量从哪里获取数据
            2, //每次提供2个数据
            this.gl.FLOAT,
            false, //不需要归一化数据
            0, //步长
            0 //开始读取数据的位置
        );
        // 开启attribute变量
        this.gl.enableVertexAttribArray(position);
    }

    drawPoints() {
        // 设置顶点数据
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array(this.points), 
            this.gl.STATIC_DRAW
        );

        // 绘制点
        this.gl.drawArrays(this.gl.POINTS, 0, this.points.length / 2);
    }

    drawLines() {
        // 设置顶点数据
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array(this.points), 
            this.gl.STATIC_DRAW
        );

        // 绘制连续线段
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.points.length / 2);
    }

    // 将末尾两个点转换为矩形的四个顶点
    // transformRect() {
    //     const [x1, y2, x2, y1] = this.points.slice(-4);
    //     this.rectPoints = [];
    //     this.rectPoints.push(x1, y1);
    //     this.rectPoints.push.apply(this.rectPoints, this.points.slice(-4));
    //     this.rectPoints.push(x2, y2);
    //     // console.log(this.rectPoints);
    // }

    drawRect(x, y, width, height) {
        this.rectPoints = [
            x, y + height,
            x, y,
            x + width, y + height,
            x + width, y
        ];
        // 设置顶点数据
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array(this.rectPoints), 
            this.gl.STATIC_DRAW
        );

        // 绘制矩形
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.rectPoints.length / 2);
    }

    // 将鼠标点击坐标(x,y)转换到[-1,1]范围内
    exchangePos(px, py) {
        let x = px / window.innerWidth * 2 - 1;
        let y = -(py / window.innerHeight * 2 - 1);
        return [x, y];
    }

    addPoint(x, y) {
        this.points.push(x, y);
    }

}
