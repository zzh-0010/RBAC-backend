# 使用文档
## 准备工作
### Mac os
如果没有homebrew，先安装homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

随后安装node.js
```bash
brew install node
```

node自带npm

现在克隆软件仓库内的代码并安装依赖
```bash
git clone -b Checking https://github.com/zzh-0010/RBAC-backend.git
cd RBAC-backend
rm -rf .git
npm install
```

### Windows及其它
大致同上，首选下载node.js（带有npm），再进入程序目录使用npm install安装相应依赖即可使用

## 使用

输入以下命令运行后端（生产环境）
```bash
npm run start
```

以下命令是在开发环境下运行，可以实时同步代码的修改，目前除了这个与生产环境启动没啥区别。
```bash
npm run dev
```

以下命令从测试环境启动并运行测试集
```bash
npm run test
```

### 手动测试内置角色
在程序目录内的requests目录提供手动测试案例，需要在VS code内安装REST client扩展，然后就可以使用request目录内的.rest文件测试api，点击send request即可在右边看到返回的信息，比较直观。
或者使用postman等应用发送请求。

## 说明
目前代码实现了基础的RBAC（Role-based access control）的访问控制模型，api有限，后期工作包括
- 完善该RBAC模型，增加角色分层以适应大量设备和功能的加入
- 添加基于ABAC(Attribute-based access control)的访问控制模型，以适应物联网的动态性需求和基于上下文的访问决策生成
- 加入机器学习实现自动生成决策、生成角色、发放令牌等

***为了测试方便所以放入了.env文件，因为其中的ssh仅为数据库提供访问权限，不涉及数据库所属账号，且数据库内不含敏感信息。***