# Task 01: 安装 glasscn-ui 库

## 任务信息

- **任务ID**: PHASE1-TASK01
- **优先级**: P0
- **预计工时**: 0.5 小时
- **依赖任务**: 无
- **责任人**: 前端开发

## 任务目标

安装 glasscn-ui 库及其依赖，为项目引入玻璃风格组件的能力。

## 详细说明

### 背景
glasscn-ui 是一个基于 shadcn/ui 架构的玻璃风格 UI 组件库，与项目现有的 shadcn/ui 基础设施兼容。通过 `shadcn@canary` CLI 工具可以直接安装 glasscn-ui 的组件到项目中。

### 操作步骤

#### 1. 验证 Tailwind CSS v4 安装

```bash
# 检查 package.json 中的 tailwindcss 版本
cat package.json | grep tailwindcss
```

预期输出: `"tailwindcss": "^4.1.14"`（或更高版本）

#### 2. 安装 glasscn-ui 基础组件

使用 shadcn CLI 安装 glasscn-ui 的基础组件：

```bash
# 安装 glass-button 组件
pnpm dlx shadcn@canary add https://glasscn.dev/r/glass-button.json

# 安装 glass-card 组件
pnpm dlx shadcn@canary add https://glasscn.dev/r/glass-card.json

# 安装 glass-alert 组件（可选，用于提示信息）
pnpm dlx shadcn@canary add https://glasscn.dev/r/glass-alert.json
```

**注意**:
- 使用 `pnpm dlx` 确保使用最新的 shadcn CLI
- 使用 `@canary` 版本以支持 Tailwind v4
- 组件会被安装到 `src/renderer/src/components/ui/glass/` 目录（需确认 CLI 配置）

#### 3. 验证安装结果

```bash
# 检查是否成功安装了玻璃组件
ls -la src/renderer/src/components/ui/glass/
```

预期看到以下文件：
- `glass-button.tsx`
- `glass-card.tsx`
- `glass-alert.tsx`（如果安装了）

#### 4. 检查 TypeScript 类型

```bash
npm run type-check
```

确保没有类型错误。

### 预期产出

- ✅ glasscn-ui 的 3 个基础组件成功安装
- ✅ 组件文件位于 `src/renderer/src/components/ui/glass/` 目录
- ✅ TypeScript 类型检查通过

## 潜在问题和解决方案

### 问题 1: CLI 找不到 shadcn 配置

**现象**: 运行 `shadcn add` 时提示找不到配置文件

**原因**: 项目可能缺少 `components.json` 配置文件

**解决方案**:
```bash
# 初始化 shadcn 配置（如果不存在）
pnpm dlx shadcn@canary init

# 根据提示选择：
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: Use CSS-based configuration
# - Components directory: src/renderer/src/components
# - Utils directory: src/renderer/src/lib
```

### 问题 2: 组件安装到错误的目录

**现象**: 组件被安装到根目录的 `components/ui/` 而不是 renderer 目录

**原因**: `components.json` 中的路径配置不正确

**解决方案**: 手动编辑 `components.json`:
```json
{
  "aliases": {
    "components": "@renderer/components",
    "ui": "@renderer/components/ui",
    "utils": "@renderer/lib/utils"
  }
}
```

### 问题 3: glasscn-ui 组件 URL 失效

**现象**: 无法从 `https://glasscn.dev/r/glass-button.json` 下载组件

**原因**: glasscn-ui 可能更新了 URL 结构或服务不可用

**解决方案**:
1. 访问 https://www.glasscn.dev/ 查看最新的组件 URL
2. 或手动创建玻璃组件（参考 Task 05-07）

## 验收标准

- [x] 至少 2 个 glasscn-ui 组件成功安装（glass-button、glass-card）
- [x] 组件文件存在于正确的目录结构中
- [x] `npm run type-check` 通过，无类型错误
- [x] 组件可以被正常导入：
  ```typescript
  import { GlassButton } from '@renderer/components/ui/glass/glass-button';
  import { GlassCard } from '@renderer/components/ui/glass/glass-card';
  ```

## 后续任务

- Task 02: 配置 Tailwind CSS 玻璃效果 utilities
- Task 05: 实现 GlassCard 组件（如果 glasscn-ui 安装失败，需手动实现）

## 参考资料

- [glasscn-ui 官网](https://www.glasscn.dev/)
- [glasscn-ui GitHub](https://github.com/TheOrcDev/glasscn-ui)
- [shadcn/ui CLI 文档](https://ui.shadcn.com/docs/cli)
