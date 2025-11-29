<!-- src/App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <transition name="sci-fi" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* 科幻风格过渡动画 */
.sci-fi-enter-active,
.sci-fi-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sci-fi-enter-from {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(10px) brightness(1.5);
}

.sci-fi-leave-to {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(5px) brightness(0.5);
}

.sci-fi-enter-to,
.sci-fi-leave-from {
  opacity: 1;
  transform: scale(1);
  filter: blur(0) brightness(1);
}
</style>