## 浏览器内核

1. ### Trident(IE内核)

   + IE浏览器

2. ### Gecko(Firefox内核)

   + Firefox浏览器

3. ### Webkit(Safari内核)

   + Safari浏览器

4. ### Chromium(谷歌浏览器 Blink?)

   + 基于Webkit内核的
   + 浏览器： 谷歌浏览器、360浏览器、猎豹浏览器、腾讯浏览器等

## 获取dom元素高度和宽度

1. ### body

   + 可见区域高：clientHeight
   + 可见区域宽：clientWidth
   + 可见区域高（包括边线的高）：offsetHeight
   + 可见区域的宽（包括边线的宽）：offsetWidth
   + 正文宽：scrollWidth
   + 正文高：scrollHeight
   + 滚动条（滑动标识）距离顶部：offsetTop
   + 滚动条（滑动标识）距离左侧：offsetLeft

2. ### 元素

   + 实际高度：offsetHeight
   + 实际宽度：offsetWidth
   + 距离左侧：offsetLeft
   + 距离顶部：offsetTop