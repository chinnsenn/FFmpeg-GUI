# 贡献指南

感谢您对 FFmpeg GUI 项目的关注！我们欢迎所有形式的贡献。

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [报告 Bug](#报告-bug)
- [功能建议](#功能建议)

---

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 使用友善和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性暗示的语言或图像
- 挑衅、侮辱或贬损性评论
- 公开或私下的骚扰
- 未经许可发布他人的私人信息
- 其他在专业环境中不适当的行为

---

## 如何贡献

贡献方式包括但不限于：

1. **代码贡献**
   - 修复 Bug
   - 添加新功能
   - 性能优化
   - 重构代码

2. **文档贡献**
   - 改进文档
   - 翻译文档
   - 编写教程

3. **测试贡献**
   - 编写单元测试
   - 执行手动测试
   - 报告 Bug

4. **设计贡献**
   - UI/UX 改进
   - 图标设计
   - 界面优化

5. **社区贡献**
   - 回答问题
   - 参与讨论
   - 推广项目

---

## 开发流程

### 1. 准备开发环境

#### 前置要求

- Node.js >= 18.x LTS
- npm >= 8.x
- Git
- 代码编辑器（推荐 VSCode）

#### 克隆仓库

```bash
# Fork 仓库到您的账号
# 然后克隆您的 Fork

git clone https://github.com/YOUR_USERNAME/FFmpeg-GUI.git
cd FFmpeg-GUI
```

#### 安装依赖

```bash
npm install
```

#### 启动开发服务器

```bash
npm run dev
```

### 2. 创建分支

从 `main` 分支创建特性分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/issue-number-description
```

**分支命名规范**：

- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `test/xxx` - 测试相关
- `chore/xxx` - 构建/工具相关

### 3. 开发

#### 项目结构

```
src/
├── main/              # Electron 主进程
│   ├── ffmpeg/        # FFmpeg 核心功能
│   ├── ipc/           # IPC 处理器
│   ├── utils/         # 工具函数
│   └── index.ts       # 主进程入口
├── renderer/          # React 渲染进程
│   └── src/
│       ├── components/  # React 组件
│       ├── pages/       # 页面组件
│       ├── router/      # 路由配置
│       ├── lib/         # 工具库
│       └── App.tsx      # 应用入口
└── shared/            # 共享代码
    ├── constants.ts   # 常量定义
    ├── types.ts       # TypeScript 类型
    └── format-presets.ts  # 格式预设
```

#### 关键文件说明

| 文件/目录 | 用途 |
|-----------|------|
| `src/main/index.ts` | 主进程入口，创建窗口 |
| `src/main/ipc/` | IPC 通道处理器 |
| `src/main/ffmpeg/manager.ts` | FFmpeg 任务管理器 |
| `src/renderer/src/App.tsx` | 渲染进程根组件 |
| `src/shared/types.ts` | 全局类型定义 |
| `vite.config.ts` | Vite 配置 |
| `tsconfig.json` | TypeScript 配置 |

#### 添加新功能

1. **主进程功能**（如新的 FFmpeg 操作）

   ```typescript
   // src/main/ffmpeg/your-feature.ts
   export class YourFeature {
     // 实现功能
   }

   // src/main/ipc/yourHandlers.ts
   import { ipcMain } from 'electron';
   import { IPC_CHANNELS } from '@shared/constants';

   export function registerYourHandlers() {
     ipcMain.handle(IPC_CHANNELS.YOUR_CHANNEL, async () => {
       // 处理逻辑
     });
   }
   ```

2. **渲染进程功能**（如新的 UI 组件）

   ```typescript
   // src/renderer/src/components/YourComponent/YourComponent.tsx
   export function YourComponent() {
     // 组件实现
   }
   ```

3. **添加 IPC 通道**

   ```typescript
   // src/shared/constants.ts
   export const IPC_CHANNELS = {
     // ... 现有通道
     YOUR_CHANNEL: 'your:channel',
   };
   ```

### 4. 测试

#### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并查看覆盖率
npm run test:coverage

# 运行测试 UI
npm run test:ui
```

#### 编写测试

```typescript
// src/__tests__/your-feature.test.ts
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../path/to/your-feature';

describe('YourFeature', () => {
  it('should do something', () => {
    const result = yourFunction();
    expect(result).toBe(expected);
  });
});
```

### 5. 代码检查

```bash
# 类型检查
npm run type-check

# ESLint 检查
npm run lint

# 格式化代码
npm run format
```

---

## 代码规范

### TypeScript

- 使用 TypeScript 严格模式
- 为所有公共 API 添加类型注解
- 避免使用 `any`，使用 `unknown` 代替
- 优先使用接口而非类型别名（公共 API）

**示例**：

```typescript
// ✅ 好的
interface Task {
  id: string;
  status: TaskStatus;
  progress: number;
}

function processTask(task: Task): void {
  // ...
}

// ❌ 不好的
function processTask(task: any) {
  // ...
}
```

### React 组件

- 使用函数组件 + Hooks
- 组件名使用 PascalCase
- Props 接口命名为 `ComponentNameProps`
- 使用 `React.memo` 优化性能（需要时）

**示例**：

```typescript
interface TaskCardProps {
  task: Task;
  onCancel: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onCancel }) => {
  // ...
};
```

### 命名规范

- **变量/函数**: camelCase
- **类/接口/类型**: PascalCase
- **常量**: UPPER_SNAKE_CASE
- **私有成员**: 前缀 `_`（可选）

```typescript
// 变量和函数
const maxConcurrent = 2;
function handleTaskCancel() {}

// 类和接口
class FFmpegManager {}
interface TaskOptions {}

// 常量
const IPC_CHANNELS = {};
const MAX_RETRY_COUNT = 3;
```

### 文件命名

- 组件文件：PascalCase，如 `TaskCard.tsx`
- 工具文件：camelCase，如 `formatTime.ts`
- 测试文件：与源文件同名 + `.test`，如 `TaskCard.test.tsx`

### 注释

- 为复杂逻辑添加注释
- 使用 JSDoc 注释公共 API
- 注释要简洁明了

```typescript
/**
 * 解析 FFmpeg 输出的时长信息
 * @param output - FFmpeg 输出字符串
 * @returns 时长（秒），解析失败返回 0
 */
export function parseDuration(output: string): number {
  // 匹配格式：Duration: HH:MM:SS.ms
  const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (!match) return 0;

  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}
```

---

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关
- `ci`: CI 配置

### Scope 范围（可选）

- `main`: 主进程
- `renderer`: 渲染进程
- `ffmpeg`: FFmpeg 相关
- `ui`: UI 组件
- `build`: 构建相关

### 示例

```bash
# 新功能
git commit -m "feat(ffmpeg): add H.265 encoding support"

# Bug 修复
git commit -m "fix(ui): resolve progress bar display issue"

# 文档
git commit -m "docs: update installation guide"

# 重构
git commit -m "refactor(main): simplify task queue logic"
```

### 完整示例

```
feat(ffmpeg): add batch conversion support

- Add batch file upload functionality
- Implement parallel processing for multiple files
- Update UI to show batch progress

Closes #123
```

---

## Pull Request 流程

### 1. 确保代码质量

```bash
# 运行所有检查
npm run type-check
npm run lint
npm test
```

### 2. 更新文档

- 更新 README.md（如果需要）
- 更新相关文档
- 添加 CHANGELOG 条目

### 3. 提交 PR

1. 推送分支到您的 Fork

```bash
git push origin feature/your-feature-name
```

2. 在 GitHub 上创建 Pull Request

3. 填写 PR 模板

### 4. PR 标题

PR 标题应遵循提交规范：

```
feat: Add batch conversion support
fix: Resolve memory leak in task queue
docs: Update user guide for compression
```

### 5. PR 描述模板

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新

## 变更描述
简要描述此 PR 的变更内容

## 相关 Issue
Closes #issue_number

## 测试
- [ ] 添加了单元测试
- [ ] 所有测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已运行 lint 和 type-check
- [ ] 更新了相关文档
- [ ] 添加了必要的注释
```

### 6. Code Review

- 积极响应 review 意见
- 及时修改代码
- 保持沟通

### 7. 合并

PR 通过 review 并且 CI 检查通过后，维护者会合并您的 PR。

---

## 报告 Bug

### 提交前检查

1. 搜索现有 Issues，避免重复
2. 使用最新版本复现问题
3. 收集必要信息

### Bug 报告模板

```markdown
## Bug 描述
简要描述 bug

## 复现步骤
1. 打开应用
2. 点击「转换」
3. 选择文件
4. 观察到错误

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 环境信息
- 操作系统：macOS 14.0
- 应用版本：0.1.0
- FFmpeg 版本：6.0

## 日志（如果有）
粘贴相关日志

## 截图（如果有）
添加截图
```

---

## 功能建议

欢迎提出新功能建议！

### 建议模板

```markdown
## 功能描述
清晰描述您想要的功能

## 使用场景
描述为什么需要这个功能

## 期望实现
描述您期望的实现方式

## 可选方案
是否有其他实现方式
```

---

## 获取帮助

- **问题讨论**: [GitHub Discussions](https://github.com/your-repo/FFmpeg-GUI/discussions)
- **Bug 报告**: [GitHub Issues](https://github.com/your-repo/FFmpeg-GUI/issues)
- **邮件联系**: dev@ffmpeg-gui.com

---

## 致谢

感谢所有贡献者的付出！您的贡献让这个项目变得更好。

查看所有贡献者：[Contributors](https://github.com/your-repo/FFmpeg-GUI/graphs/contributors)

---

**再次感谢您的贡献！🎉**
