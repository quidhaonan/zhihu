# myapp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

技术栈：vue vuex vue-router vant axios/qs less
问题：父组件传给子组件的时间，有很多种格式，需要进行切割转换

1. postcss-pxtorem 我们开发的时候，写的是 px 单位，但是 webpack 编译的时候，会把其都变为 rem（
    事先肯定需要一个基准值）
2. lib-fiexible 设置基准值
3. 路由懒加载：在 webpack 打包的时候，实现切割打包，第一次打开 app 看到的内容，事先打包到主 js 文件
   中，页面一加载，只先加载和渲染这部分信息，当后期需要跳转到指定的页面，再去把指定页面的内容加载回来
   渲染
4. 注释 /*webpackChunkName:'other'*/ 对路由懒加载有效，把其他的同时存放到一个 js 文件中（第5集
   1：30左右）
5. 动态绑定的图片不能用相对地址，要用 commonjs 中的 require 来进行，或者 es6 的 import 来进行
6. new Date().toLocaleString('zh-CN',{ hour12:false }) 获取当前时间，格式为 '2022/9/2
   08:31:00'
7.正则表达式中有 exec 这个方法,字符串中有 match 这个方法
8.结构赋值有 {} 和 [] 的区别
9.Object.freeze 冻结方法
10.ref 在 setup 的使用方法，在 Home 组件中
11.IntersectionObserver 的方法，在 Home 组件中
12.往网页中添加 css 样式和添加元素结点，在 Detail 组件
13.路由的 replace 和 push 的区别
14.引用 vuex 不一定要引入 useStore 来创建，可以直接引入 store 中的现成的
15.encodeURIComponent 对请求头的中文信息进行编码，运用在 axios 拦截中