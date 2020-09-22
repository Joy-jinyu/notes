## js构建工具
1. ###  grant: 
    * **优点**: 灵活，只执行我们定制的任务
    * **缺点**：集成度低，需要书写大量的配置才可用
    * **背景**：弥补npm script的不足出现的
2. ###  gulp:
    * **优点**: 引入了流的概念
    * **缺点**：和grant一样
    * **背景**: grunt版本的增强，在grunt的版本的基础之上增加了监听文档、读写文档、流的处理
3. ###  Fis3:
    * **优点**: 内置了许多的功能，无需做大量的配置就可以完成许多的功能
    * **缺点**：已经停止维护了，不支持最新的node.js
    * **背景**: 
4. ###  webpack:
    * **优点**: 模块化的概念，一切文件皆模块.loader转换文件, plugin注入钩子,最后多个模块合并生成一个文件
    * **缺点**：只能模块化处理文件
    * **背景**:
5. ###  rollup:
    * **优点**: Tree shaking, 将打包过程中已定义但是没使用的文件进行scope, 减小最终文件的打包大小；目前webpack也已经具有此功能，但是rollup打包出来的文件总是最小的；
    * **缺点**：功能不如webpack完善, 但是配置和使用很简单；不支持Code Splite
    * **背景**: webpack流行之后的替代品

## 功能

1. ### Loader

    * css-loader style-loader 实现js加载css文件
2. ### Plugin

    * extract-text-webpack-plugin 实现spliteCode
3. ### webpack-dev-server

    * --watch 实现实时监听文件
4. ### 模块热替换

    * --hot 实现模块热替换和--watch同样的效果， 区别是hot能够在不刷新界面的情况下实现效果变换

5. ### SourceMap

    * --devtool source-map参数，即可在浏览器上调试源代码

## 核心概念

1. ### Entry

    * 入口，执行的第一步，从入口开始

2. ### Module

    * 模块, 一切皆模块， 一个模块对应一个文件。

3. ### Loader

    * 模块转化器. 按需求转化成需要的新内容

4. ### Plugin

    * 构建流程中在特定时机注入扩展逻辑

5. ### Output

    *  输出结果, 我们最终想要的结果

6. ### Chunk

    * 代码块， 一个Chunk由多个模块合成， 用于代码和并与分割



## Error
1. ### Path variable [contenthash] not implemented in this context

    **解决方案**：webpack4已经包含了contenthash这个关键字，所以改为md5:contenthash:hex:8

