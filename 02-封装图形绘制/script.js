







// 创建顶点着色器
let vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, /* glsl */`
    attribute vec4 v_position;
    void main() {
        gl_Position = v_position;
    }
`);
// 编译顶点着色器
gl.compileShader(vShader);

// 创建片段着色器
let fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, /* glsl */`
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
`);
// 编译片段着色器
gl.compileShader(fShader);

// 创建着色器程序，链接顶点着色器和片段着色器
let program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
}
gl.useProgram(program);

// 创建顶点数据
const position = gl.getAttribLocation(program, "v_position");
// 创建缓冲区
const vbo = gl.createBuffer();
// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
// 设置顶点数据
gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([0.0, 0.5, 0.5, 0.5, -0.5, -0.5]), 
    gl.STATIC_DRAW
);

// 将顶点数据提供给attribute变量
gl.vertexAttribPointer(
    position, //告诉attribute变量从哪里获取数据
    2, //每次提供2个数据
    gl.FLOAT,
    false, //不需要归一化数据
    0, //步长
    0 //开始读取数据的位置
);
// 开启attribute变量
gl.enableVertexAttribArray(position);

// 绘制
gl.drawArrays(gl.TRIANGLES, 0, 3);

/**
 * Comment tagged templates
 * 注释标签模板插件，用于GLSL语法高亮
 */