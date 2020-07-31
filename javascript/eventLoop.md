## 原理

1. 先执行一个宏任务、再执行所有的微任务（反复这个循环）

## [异步任务](https://juejin.im/post/6844903901578133512)

1. 宏任务（Macro-Task）：参与事件循环的异步任务（别的线程里面完成的 -- 怎么理解？）
   + eg: I/O、request-Animation-Frame、set-Timeout、set-Interval、set-Immediate
2. 微任务（Micro-Task）：不参与事件循环的["异步"](https://juejin.im/post/6844903877477662727)(假异步)任务 -（同一个事件循环中，比宏任务优先级高、主线程任务完成后立即执行， 没有在憋得线程里完成）
   + eg: process_next-Tick (node.js)、Mutation-Observer、Promise

## 拓展

1. [Chrome事件循环（Event-Loop)]((https://juejin.im/post/6844903704156438536))
2. 事件驱动（Event Driven) - ([发布订阅模式/观察者模式](https://www.jianshu.com/p/9f2c8ae57cac))
3. 消息循环（Message-Loop）
4. 运行循环（Run-Loop）