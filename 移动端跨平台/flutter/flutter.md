## [Flutter开发 环境安装](https://www.jianshu.com/p/c3ec3cdc77b3)

1. ### [android sdk安装及配置](https://www.cnblogs.com/huckleberry/p/12323901.html)

   + 在[androidDevTools官网](https://www.androiddevtools.cn/)下载SDK Tools 

   + 启动SDK Tools下载android SDK

     - Tools目录下的下载前三个

       ![1598531522903](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1598531522903.png)

     - API下载最新的即可（目前的是Android10）

       ![1598531553067](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1598531553067.png)

     - Extras的全选

       ![1598531578147](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1598531578147.png)

   + 配置SDK环境变量

     - 添加ANDROID_SDK_HOME：SDK安装目录（此处是androidSDKManage）
     - path添加 %ANDROID_SDK_HOME%\platform-tools;%ANDROID_SDK_HOME%\tools; 

   + 检测是否安装成功

     - 命令：adb
     - 命令：android -h

2. ### dart安装及配置(flutter开发可忽略安装dart-sdk, flutter内置了)

3. ### fluter 安装及配置

4. ### IDE环境配置

   + [power shell 5.1安装](https://docs.microsoft.com/zh-cn/powershell/scripting/windows-powershell/wmf/setup/install-configure?view=powershell-7)
     -  $PSVersionTable 查看当前版本
   + [visual studio开发](https://flutter.io/using-ide-vscode/; https://flutter.dev/docs/development/tools/vs-code)
     - 安装flutter、dart插件
     - 快捷键 Ctrl + Shift + P 调出 vs的命令行
     - 输入 Flutter: New Project 然后enter确认
     - 输入项目名称
     - 选择项目路径
