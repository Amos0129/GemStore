<template>
  <section class="hero">
    <div class="hero-container">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="hero-slide"
        :class="{ active: currentSlide === index }"
      >
        <div class="hero-content">
          <h1 class="hero-title">{{ slide.title }}</h1>
          <p class="hero-subtitle">{{ slide.subtitle }}</p>
          <button 
            class="cta-btn"
            @click="handleCTAClick(slide.action)"
          >
            {{ slide.buttonText }}
          </button>
        </div>
        <div class="hero-image" v-if="slide.image">
          <img :src="slide.image" :alt="slide.title" />
        </div>
      </div>
      
      <!-- Slide Indicators -->
      <div class="slide-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          class="indicator"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></button>
      </div>
      
      <!-- Navigation Arrows -->
      <button class="nav-arrow prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-arrow next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)
let slideInterval = null

const slides = [
  {
    title: '探索晶礦之美',
    subtitle: '精選天然水晶飾品，為您帶來能量與美麗',
    buttonText: '立即選購',
    action: 'shop',
    image: null
  },
  {
    title: '每週直播特惠',
    subtitle: '週三/四/五 20:30 IG直播，限時優惠不容錯過',
    buttonText: '查看直播',
    action: 'live',
    image: null
  },
  {
    title: '新年好禮',
    subtitle: '滿$2026送紅包袋，滿$3888抽$1000購物金',
    buttonText: '了解更多',
    action: 'promotion',
    image: null
  }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 5000)
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

const handleCTAClick = (action) => {
  switch (action) {
    case 'shop':
      router.push('/products')
      break
    case 'live':
      router.push('/live')
      break
    case 'promotion':
      router.push('/products?category=sale')
      break
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.hero {
  @apply relative h-screen overflow-hidden flex items-center justify-center;
  background-color: #FFFFFF;
}

.hero-container {
  @apply relative w-full h-full;
}

.hero-slide {
  @apply absolute inset-0 opacity-0 transition-opacity duration-1000 flex items-center justify-center;
}

.hero-slide.active {
  @apply opacity-100;
}

.hero-content {
  @apply text-center z-10 px-4 max-w-4xl mx-auto;
}

.hero-title {
  @apply text-5xl md:text-7xl font-bold mb-6;
  color: #8B5CF6;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  @apply text-xl md:text-2xl mb-8;
  color: #6B21A8;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.cta-btn {
  @apply text-white text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300;
  background-color: #C4B5FD;
  color: #581C87;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.cta-btn:hover {
  background-color: #8B5CF6;
  color: white;
  transform: translateY(-2px);
}

.slide-indicators {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20;
}

.indicator {
  @apply w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300;
  background-color: rgba(196, 181, 253, 0.4);
}

.indicator.active {
  @apply w-8;
  background-color: #8B5CF6;
}

.nav-arrow {
  @apply absolute top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center z-20;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(196, 181, 253, 0.3);
  color: #8B5CF6;
}

.nav-arrow:hover {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  color: white;
}

.nav-arrow.prev {
  @apply left-8;
}

.nav-arrow.next {
  @apply right-8;
}

.hero-image {
  @apply absolute inset-0 z-0;
}

.hero-image img {
  @apply w-full h-full object-cover opacity-20;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .hero {
    @apply h-screen;
  }
  
  .hero-content {
    @apply px-6 max-w-full;
  }
  
  .hero-title {
    @apply text-3xl font-bold mb-4;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    @apply text-base mb-6 leading-relaxed;
  }
  
  .cta-btn {
    @apply text-base px-6 py-3 w-full max-w-xs mx-auto block;
  }
  
  .nav-arrow {
    @apply w-12 h-12 text-base;
  }
  
  .nav-arrow.prev {
    @apply left-3;
  }
  
  .nav-arrow.next {
    @apply right-3;
  }
  
  .slide-indicators {
    @apply bottom-6;
  }
  
  .indicator {
    @apply w-2 h-2;
  }
  
  .indicator.active {
    @apply w-6;
  }
}

@media (max-width: 480px) {
  .hero-title {
    @apply text-2xl mb-3;
  }
  
  .hero-subtitle {
    @apply text-sm mb-5;
  }
  
  .cta-btn {
    @apply text-sm px-5 py-2.5;
  }
}
</style>