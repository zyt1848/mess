/**
 * My WebGL class Shape
 */
class Shape {
    constructor(selector) {
        const canvas = document.querySelector(selector);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.gl = canvas.getContext("webgl");

        this.points = [0.0, 0.5, 0.5, 0.5, -0.5, -0.5];
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

    drawTriangle() {
        // 创建顶点数据
        const position = this.gl.getAttribLocation(this.program, "v_position");
        // 创建缓冲区
        const vbo = this.gl.createBuffer();
        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        // 设置顶点数据
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array([0.0, 0.5, 0.5, 0.5, -0.5, -0.5]), 
            this.gl.STATIC_DRAW
        );

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

        // 绘制
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    drawPoints() {
        // 创建顶点数据
        const position = this.gl.getAttribLocation(this.program, "v_position");
        // 创建缓冲区
        const vbo = this.gl.createBuffer();
        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        // 设置顶点数据
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array(this.points), 
            this.gl.STATIC_DRAW
        );

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

        // 绘制
        this.gl.drawArrays(this.gl.POINTS, 0, this.points.length / 2);
    }

    exchangePos(px, py) {
        let x = px / window.innerWidth * 2 - 1;
        let y = -(py / window.innerHeight * 2 - 1);
        return [x, y];
    }

    addPoints(x, y) {
        this.points.push(x, y);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    lineTo(x, y) {
        this.x = x;
        this.y = y;
    }


}

/**
 * 错误：
 * this.gl.useProgram(this.program); 报错
 * 原因：使用vscode查找替换将vShader的glsl源码的gl前面加了 this.
 * 
 * Uncaught Vertex shader is not compiled.
 * 原因：gl_PointSize = 10.0; // 数字不能加f
 * 
 * this.points.push(x, y); push进去的总是undefined数据？？？
 * index.html let pos = shape.exchangePos(event.x, event.y); 
 * push()的数据错误，应使用索引push数据
            shape.addPoints(pos[0], pos[1]);
 * 
 */
