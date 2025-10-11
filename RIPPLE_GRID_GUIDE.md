# RippleGrid 组件使用教程

## 📖 目录
- [简介](#简介)
- [基础使用](#基础使用)
- [作为背景使用](#作为背景使用)
- [在组件上叠加内容](#在组件上叠加内容)
- [自定义颜色](#自定义颜色)
- [完整属性参考](#完整属性参考)
- [示例场景](#示例场景)

---

## 简介

`RippleGrid` 是一个基于 WebGL 的动态网格波纹效果组件，具有以下特点：
- 🌊 流动的波纹动画效果
- 🎨 支持自定义颜色和彩虹模式
- 🖱️ 鼠标交互效果
- ⚡ 高性能 WebGL 渲染
- 🎛️ 丰富的自定义参数

---

## 基础使用

### 1. 导入组件

```vue
<script setup lang="ts">
import RippleGrid from '@/components/RippleGrid.vue';
</script>

<template>
  <RippleGrid />
</template>
```

### 2. 设置容器尺寸

组件会自动填充父容器，因此需要给父容器设置尺寸：

```vue
<template>
  <div class="h-screen w-full">
    <RippleGrid />
  </div>
</template>
```

---

## 作为背景使用

### 方法一：使用绝对定位（推荐）

将 `RippleGrid` 作为背景层，其他内容放在上层：

```vue
<template>
  <div class="relative h-screen w-full">
    <!-- 背景层 -->
    <div class="absolute inset-0 -z-10">
      <RippleGrid
        grid-color="#0ea5e9"
        :opacity="0.6"
      />
    </div>

    <!-- 内容层 -->
    <div class="relative z-10">
      <h1>你的内容</h1>
    </div>
  </div>
</template>
```

**关键点：**
- `absolute inset-0`：让背景完全覆盖父容器
- `-z-10`：将背景置于底层
- `z-10`：将内容置于上层

### 方法二：使用 Grid 布局

```vue
<template>
  <div class="grid h-screen">
    <RippleGrid class="col-start-1 row-start-1" />
    <div class="col-start-1 row-start-1 z-10">
      <h1>你的内容</h1>
    </div>
  </div>
</template>
```

---

## 在组件上叠加内容

### 示例 1：Hero Section 背景

```vue
<template>
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- RippleGrid 背景 -->
    <div class="absolute inset-0 -z-10">
      <RippleGrid
        grid-color="#8b5cf6"
        :opacity="0.7"
        :ripple-intensity="0.08"
        :glow-intensity="0.2"
      />
    </div>

    <!-- 前景内容 -->
    <div class="relative z-10 text-center px-4">
      <h1 class="text-6xl font-bold text-white mb-4">
        欢迎来到未来
      </h1>
      <p class="text-xl text-gray-200 mb-8">
        体验下一代交互设计
      </p>
      <button class="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold">
        开始探索
      </button>
    </div>
  </div>
</template>
```

### 示例 2：卡片布局配合背景

```vue
<template>
  <div class="relative min-h-screen p-8">
    <!-- 背景 -->
    <div class="absolute inset-0 -z-10">
      <RippleGrid
        grid-color="#10b981"
        :opacity="0.5"
        :mouse-interaction="true"
      />
    </div>

    <!-- 卡片网格 -->
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h3 class="text-2xl font-bold mb-2">特性 1</h3>
        <p>描述内容...</p>
      </div>
      <div class="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h3 class="text-2xl font-bold mb-2">特性 2</h3>
        <p>描述内容...</p>
      </div>
      <div class="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h3 class="text-2xl font-bold mb-2">特性 3</h3>
        <p>描述内容...</p>
      </div>
    </div>
  </div>
</template>
```

**样式技巧：**
- `backdrop-blur-sm`：毛玻璃效果
- `bg-white/90`：半透明背景
- 使用阴影增强层次感

---

## 自定义颜色

### 1. 使用十六进制颜色

```vue
<RippleGrid
  grid-color="#ff6b6b"  <!-- 红色 -->
/>

<RippleGrid
  grid-color="#4ecdc4"  <!-- 青色 -->
/>

<RippleGrid
  grid-color="#ffe66d"  <!-- 黄色 -->
/>
```

### 2. 启用彩虹模式

```vue
<RippleGrid
  :enable-rainbow="true"
/>
```

彩虹模式会忽略 `grid-color` 属性，使用动态变化的渐变色。

### 3. 常用配色方案

```vue
<!-- 科技蓝 -->
<RippleGrid
  grid-color="#00d4ff"
  :glow-intensity="0.3"
  :opacity="0.8"
/>

<!-- 霓虹紫 -->
<RippleGrid
  grid-color="#a855f7"
  :glow-intensity="0.4"
  :opacity="0.7"
/>

<!-- 矩阵绿 -->
<RippleGrid
  grid-color="#27FF64"
  :grid-thickness="20"
  :opacity="0.9"
/>

<!-- 赛博粉 -->
<RippleGrid
  grid-color="#ff006e"
  :glow-intensity="0.5"
  :ripple-intensity="0.1"
/>
```

---

## 完整属性参考

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable-rainbow` | `boolean` | `false` | 启用彩虹渐变模式 |
| `grid-color` | `string` | `'#27FF64'` | 网格颜色（十六进制） |
| `ripple-intensity` | `number` | `0.05` | 波纹强度（0-1） |
| `grid-size` | `number` | `10.0` | 网格大小 |
| `grid-thickness` | `number` | `15.0` | 网格线条粗细 |
| `fade-distance` | `number` | `1.5` | 边缘淡出距离 |
| `vignette-strength` | `number` | `2.0` | 暗角强度 |
| `glow-intensity` | `number` | `0.1` | 发光强度 |
| `opacity` | `number` | `1.0` | 整体透明度（0-1） |
| `grid-rotation` | `number` | `0` | 网格旋转角度（度） |
| `mouse-interaction` | `boolean` | `true` | 启用鼠标交互 |
| `mouse-interaction-radius` | `number` | `1.0` | 鼠标影响半径 |

### 属性详解

#### `ripple-intensity`
控制波纹的幅度。值越大，波纹越明显。
- `0.02-0.05`: 微妙效果
- `0.05-0.1`: 中等效果
- `0.1+`: 强烈效果

#### `grid-size`
控制网格的密度。值越小，网格越密集。
- `5-8`: 密集网格
- `8-12`: 中等网格
- `12+`: 稀疏网格

#### `grid-thickness`
控制线条的粗细。值越大，线条越细。
- `5-10`: 粗线条
- `10-20`: 中等线条
- `20+`: 细线条

#### `glow-intensity`
控制发光效果。值越大，发光越强。
- `0`: 无发光
- `0.1-0.3`: 轻微发光
- `0.3-0.5`: 强烈发光

#### `opacity`
控制整体透明度，适合做背景时使用。
- `0.3-0.5`: 很淡的背景
- `0.5-0.7`: 适中的背景
- `0.7-1.0`: 明显的效果

#### `grid-rotation`
旋转网格，创造不同的视觉效果。
- `0`: 默认方向
- `45`: 对角线效果
- `90`: 旋转90度

---

## 示例场景

### 场景 1：落地页 Hero 区域

```vue
<template>
  <div class="relative h-screen overflow-hidden">
    <!-- 深色背景 -->
    <div class="absolute inset-0 bg-slate-900" />

    <!-- RippleGrid 效果层 -->
    <div class="absolute inset-0">
      <RippleGrid
        grid-color="#3b82f6"
        :opacity="0.4"
        :ripple-intensity="0.06"
        :glow-intensity="0.25"
        :mouse-interaction="true"
        :mouse-interaction-radius="1.5"
      />
    </div>

    <!-- 渐变遮罩（可选） -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />

    <!-- 内容 -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-7xl font-bold text-white mb-6">
        创新从这里开始
      </h1>
      <p class="text-2xl text-blue-200 mb-12 max-w-2xl">
        探索未来科技，体验沉浸式交互设计
      </p>
      <div class="flex gap-4">
        <button class="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
          立即体验
        </button>
        <button class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold backdrop-blur-sm transition">
          了解更多
        </button>
      </div>
    </div>
  </div>
</template>
```

### 场景 2：产品展示区

```vue
<template>
  <div class="relative py-20 overflow-hidden">
    <!-- 背景 -->
    <div class="absolute inset-0 bg-black">
      <RippleGrid
        :enable-rainbow="true"
        :opacity="0.3"
        :ripple-intensity="0.04"
        :grid-rotation="45"
      />
    </div>

    <!-- 内容 -->
    <div class="relative z-10 max-w-6xl mx-auto px-4">
      <h2 class="text-5xl font-bold text-white text-center mb-16">
        核心特性
      </h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 特性卡片 -->
        <div class="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div class="text-4xl mb-4">🚀</div>
          <h3 class="text-2xl font-bold text-white mb-3">极致性能</h3>
          <p class="text-gray-300">基于 WebGL 的高性能渲染引擎</p>
        </div>

        <div class="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div class="text-4xl mb-4">🎨</div>
          <h3 class="text-2xl font-bold text-white mb-3">自定义样式</h3>
          <p class="text-gray-300">丰富的配置选项，打造独特视觉</p>
        </div>

        <div class="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div class="text-4xl mb-4">🖱️</div>
          <h3 class="text-2xl font-bold text-white mb-3">交互体验</h3>
          <p class="text-gray-300">流畅的鼠标交互动画效果</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 场景 3：登录/注册页面

```vue
<template>
  <div class="relative min-h-screen flex items-center justify-center p-4">
    <!-- 背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <RippleGrid
        grid-color="#a78bfa"
        :opacity="0.6"
        :ripple-intensity="0.08"
        :glow-intensity="0.3"
        :mouse-interaction="true"
      />
    </div>

    <!-- 登录表单 -->
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 class="text-3xl font-bold text-white text-center mb-8">
          欢迎回来
        </h2>

        <form class="space-y-6">
          <div>
            <label class="block text-white text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-white text-purple-900 rounded-xl font-semibold hover:bg-white/90 transition"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
```

### 场景 4：仪表盘背景

```vue
<template>
  <div class="relative min-h-screen">
    <!-- 背景 -->
    <div class="fixed inset-0 -z-10 bg-slate-950">
      <RippleGrid
        grid-color="#0ea5e9"
        :opacity="0.3"
        :ripple-intensity="0.03"
        :grid-size="15"
        :mouse-interaction="false"
      />
    </div>

    <!-- 仪表盘内容 -->
    <div class="relative z-10 p-6">
      <h1 class="text-3xl font-bold text-white mb-6">数据仪表盘</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- 数据卡片 -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400 text-sm">总用户数</p>
          <p class="text-3xl font-bold text-white mt-2">12,345</p>
        </div>
        <!-- 更多卡片... -->
      </div>

      <!-- 图表区域 -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 class="text-white text-xl font-semibold mb-4">流量趋势</h3>
        <!-- 图表组件 -->
      </div>
    </div>
  </div>
</template>
```

---

## 性能优化建议

### 1. 降低渲染负载

```vue
<!-- 在移动设备上使用更简单的配置 -->
<RippleGrid
  :grid-size="15"
  :glow-intensity="0"
  :mouse-interaction="false"
/>
```

### 2. 使用固定定位避免重绘

```vue
<div class="fixed inset-0 -z-10">
  <RippleGrid />
</div>
```

### 3. 条件渲染

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showRippleGrid = ref(false);

onMounted(() => {
  // 仅在桌面设备显示
  showRippleGrid.value = window.innerWidth > 768;
});
</script>

<template>
  <RippleGrid v-if="showRippleGrid" />
</template>
```

---

## 常见问题

### Q: 组件不显示？
A: 确保父容器有明确的高度。RippleGrid 会自动填充父容器，如果父容器高度为 0，组件也不会显示。

```vue
<!-- ❌ 错误：父容器没有高度 -->
<div>
  <RippleGrid />
</div>

<!-- ✅ 正确：给父容器设置高度 -->
<div class="h-screen">
  <RippleGrid />
</div>
```

### Q: 如何调整性能？
A: 可以通过以下方式优化：
- 减小 `glow-intensity`（发光效果消耗较多）
- 增大 `grid-size`（减少网格密度）
- 禁用 `mouse-interaction`
- 降低 `opacity`

### Q: 颜色看起来很淡？
A: 尝试调整以下参数：
- 增加 `opacity`
- 降低 `grid-thickness`
- 增加 `glow-intensity`

---

## 总结

RippleGrid 组件非常适合用作：
- ✅ 网站落地页背景
- ✅ 产品展示区域
- ✅ 登录/注册页面
- ✅ 仪表盘背景
- ✅ 任何需要科技感的场景

通过合理使用层叠、透明度和模糊效果，可以打造出令人惊艳的视觉体验！

---

**技术支持**：如有问题，请查阅源码或提交 Issue。
