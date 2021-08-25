## `Css `-- Cascading Style Sheet

### [Cascading](https://blog.csdn.net/Jasper917/article/details/105421710) 

浏览器用来解决冲突的一套规则

#### 解决冲突的流程

```flow
start=>start: 发生冲突
originCond=>condition: 是否来自同一样式源
originNoOpt=>operation: 选择优先级高的样式源
pointCond=>condition: 是否来自同一指定级
pointNoOpt=>operation: 选择优先级高的指定级
end=>end: 按照顺序选择顺序靠后的代码块
start->originCond
originCond(yes)->pointCond
originCond(no)->originNoOpt->pointCond
pointCond(yes)->end
pointCond(no)->pointNoOpt->end
```

#### 样式源

#### 指定级

#### 顺序