// rollup默认可以导出一个对象作为打包的配置文件
import babel from 'rollup-plugin-babel'
export default{
    // 入口
    input:'./src/index.js',
    // 出口
    output:{
        // 打包到vue.js
        file:'./dist/vue.js',
        // 打包后会在全局增添一个vue
        name:'Vue',//global.Vue
        // 打包格式：esm、es6模块、commonjs模块（node）、umd（统一模块规范，支持commonjs、amd）
        format:'umd',
        // 希望可以调试源代码
        sourcemap:true
    },
    plugins:[
        babel({
            // 排除node_modules下所有文件
            exclude:'node_modules/**'
        })
    ]
}