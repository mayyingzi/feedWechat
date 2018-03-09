# Vue Boilerplate


## 环境配置
node: v6.0.0 以上的LTS版本  

npm: v5.0.0 以上的版本

## 项目配置

``` bash
# 安装依赖包
npm install

# 使用内测环境数据进行开发
npm run dev

# 使用其它环境数据进行开发, env 为 beta, abtest or release
npm run dev:<env>

# 打包到内测
npm run build

# 打包到不同环境, env 为 beta, abtest or release
npm run build:<env>

# 打包并查看打包分析 build后面加env 一样可以打包到不同环境
npm run build --report

# 运行单元测试
npm run unit

# 运行所有测试
npm test
```
