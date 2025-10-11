<template>
  <div class="relative min-h-screen overflow-hidden bg-[#000000] text-slate-100">
    

    <div class="absolute inset-0">
      <RippleGrid
        grid-color="#27ff64"
        :grid-size="20"
        :grid-thickness="10"
        :fade-distance="1.6"
        :vignette-strength="6"
        :opacity="0.9"
        :ripple-intensity="0.05"
        :glow-intensity="0.8"
        :mouse-interaction="true"
        :mouse-interaction-radius="0.5"

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
        <p class="text-xs uppercase tracking-[0.45em] text-slate-300/80">🐧gugu and gaga !🐧</p>
        <h1 class="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
          GUGU🐧💕 and GAGA🐧❤️ change the world 🌍🌎🌏!
        </h1>
        <p class="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
          ling gan gu li gu li gua ca lin gan gu ling gan gu !
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
import RippleGrid from '@/components/RippleGrid.vue';
import CardNav from '@/components/CardNav.vue';
import logo from '../image/gugugaga.svg';

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
