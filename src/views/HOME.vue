<template>
  <div class="relative min-h-screen overflow-hidden bg-[#000000] text-slate-100">

    <!-- 🎨 背景组件区域 - Particles 白色极简风格 -->
    <div class="absolute inset-0">
      <Particles
        :particle-count="500"
        :particle-spread="12"
        :speed="0.15"
        :particle-colors="['#ffffff', '#f0f0f0', '#e0e0e0']"
        :move-particles-on-hover="false"
        :particle-hover-factor="1"
        :alpha-particles="true"
        :particle-base-size="150"
        :size-randomness="1.2"
        :camera-distance="20"
        :disable-rotation="false"
        class-name="w-full h-full opacity-100"
      />
    </div>

    <CardNav
      :logo="logo"
      logoAlt="Company Logo"
      :items="items"
      baseColor="#0d1424"
      menuColor="#c9e7ff"
      buttonBgColor="#1c2a3f"
      buttonTextColor="#f8fbff"
      ease="power3.out"
    />

    <main
      class="relative z-10 mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 pb-40 pt-28 text-center"
    >
      <div class="space-y-6">
        <p class="text-xs uppercase tracking-[0.45em] text-slate-300/80">🐧 muxueliunian · mxlnuma.com 🐧</p>
        <h1 class="flex flex-wrap items-center justify-center gap-4 text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
          <span>Creative</span>
          <RotatingText
            :texts="[
              'coding',
              'components',
              'experiences',
              'solutions',
              'dashboards'
            ]"
            :rotation-interval="2500"
            :stagger-duration="0.03"
            stagger-from="first"
            split-by="characters"
            main-class-name="inline-flex"
            element-level-class-name="inline-block bg-gradient-to-r from-[#27ff64] to-[#00d9ff] bg-clip-text text-transparent font-bold"
          />
        </h1>
        <p class="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
          Building innovative web applications with passion · UMA Fan Data · gugugaga! 🐧
        </p>
      </div>
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <router-link 
          to="/dashiboard"
          class="rounded-[999px] bg-white px-10 py-4 text-base font-semibold text-slate-900 shadow-[0_10px_35px_rgba(255,255,255,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(255,255,255,0.2)]"  
        >UMA Fans</router-link>
        <button
          onclick="window.open('https://user.qzone.qq.com/2646438065', '_blank')"
          class="rounded-[999px] border border-emerald-400/60 bg-emerald-900/20 backdrop-blur-md px-10 py-4 text-base font-semibold text-emerald-200 shadow-[0_10px_40px_rgba(60,255,115,0.12)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:text-emerald-100"
        >
          作者的QQ空间
        </button>
      </div>

    </main>

  </div>
</template>

<script setup lang="ts">
// import RippleGrid from '@/components/RippleGrid.vue'; // 暂时注释
import Particles from '@/components/Particles.vue';
import CardNav from '@/components/CardNav.vue';
import logo from '../image/gugugaga.svg';
import RotatingText from '@/components/RotatingText.vue';

const items = [
  {
    label: '这里什么都没有',
    bgColor: '#112b55',
    textColor: '#e1f2ff',
    links: [
      { label: '是的确实是什么都没有', ariaLabel: 'About Company', to: '/dashiboard' }
    ]
  },
  {
    label: '哈哈哈哈',
    bgColor: '#0d2448',
    textColor: '#e1f2ff',
    links: [
      { label: '今天竞技场种马出货了', ariaLabel: 'Featured Projects', href: '#' },
      { label: '赛马娘太好玩了', ariaLabel: 'Project Case Studies', href: '#' }
    ]
  },
  {
    label: 'Contact',
    bgColor: '#15305a',
    textColor: '#e1f2ff',
    links: [
      { label: 'GitHub', ariaLabel: 'View my GitHub', href: 'https://github.com/muxueliunian' },
      { label: 'Email', ariaLabel: 'Email us', href: 'mailto:ruijiergadena@gmail.com' },
      { label: 'Twitter', ariaLabel: 'Twitter', href: 'https://twitter.com/瑞吉儿gaderna' },
      { label: 'LinkedIn', ariaLabel: 'LinkedIn', href: 'https://www.linkedin.com/mxln' }
    ]
  }
];
</script>
