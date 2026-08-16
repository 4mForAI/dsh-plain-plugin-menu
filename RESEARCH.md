# DeepSeek Harness 插件研究摘要

研究基线：DeepSeek 官方仓库 `deepseek-ai/deepseek-harness`，`master` 分支，检索日期 2026-08-16。

## 定义

DSH 由 Cordis 驱动，核心理念是 Everything is a Plugin。模型适配器、工具注册表、会话日志、agent loop 和 Web UI 都是同一棵插件树中的节点。扩展 DSH 的正常方式是在配置树中挂载一个新插件，而不是修改所谓“核心”。注册项属于当前插件 fiber；fiber 卸载时，注册项按生命周期自动撤销。

最小函数插件：

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'

export function apply(ctx: Context) {
  // register capabilities
}
```

还支持默认导出的对象插件和继承 `Service` 的类插件。需要其他服务时导出 `inject`，例如 `export const inject = ['tools']`。

## 配置要求

插件同时导出 TypeScript `Config` 类型和同名 Schemastery schema。schema 在加载时验证并填默认值；无效配置应让插件响亮失败。官方约定是：不同部署可能采用不同值的参数都应进入配置，不能硬编码。

配置改变会触发热替换。依赖 `ctx` 的 effect 自动清理；手工资源用 `ctx.effect(() => disposer)` 归入生命周期。

## Bundle 与 profile

`package.json` 中的两种 DSH manifest 不能混淆：

- `dsh.bundle.patch`：说明一个可分发 npm 包贡献哪一层 Cordis patch。
- `dsh.profile.bundles`：说明某个可启动 profile 按什么顺序叠加 bundle。

`dsh plugin --profile web add <source>` 会在 `$DSH_HOME/profiles/web` 中转发给 pnpm，然后把真正声明 `dsh.bundle` 的依赖加入 profile 层栈。remove 反向处理。bundle patch、profile 自己的 patch、home patch 和 `--patch` overlay 依次叠加；后层同 id 覆盖前层，而且 `config` 整体替换。

## Web UI 插件

Web 插件是双面交付：

- Node/Host 入口由 Cordis Loader 加载，可提供服务或注册 HTTP route。
- 浏览器入口由 `package.json` 的 `dsh.client` 声明发现，通过 `exports['./client']` 加载。

浏览器插件使用 `ctx.slots.register` 组合 UI。向别的包声明的 slot 注册时，要用 `ctx.slots.inject(slot, callback)` 等待声明出现，并在声明消失时自动撤销。本项目使用：

- `sidebar.footer.action`：左侧栏底部菜单入口。
- `shell.overlay`：覆盖全窗口的插件目录和管理面板。

## 安装期风险

从 Git 安装拿到源码，不会自动拥有构建产物。作者要提供自包含 `prepare`；pnpm 10+ 又会在用户显式设置 `allowBuilds` 前阻止它。这个授权意味着代码在安装时直接在用户机器执行，且不受 agent 沙箱保护。官方建议审查源码并锁定 commit；npm 预构建包或 tarball可免安装期构建授权。

## 对本插件的直接影响

- 目录信息和 profile 修改放在 Host，浏览器只通过同源 HTTP 调用。
- 安装/卸载复用官方 CLI 语义，避免直接修改 profile manifest 导致层栈漂移。
- 插件集合变化要重启：官方 client module Host 对包元数据有进程内缓存，plugin-set change 在 restart 后进入新启动图。
- “可靠”不能用单一分数下结论，因此 UI 展示原始公开信号和保守状态文案，不宣称安全认证。
- 官方仍为 developer preview，本项目把兼容目标和验证日期写进文档。
