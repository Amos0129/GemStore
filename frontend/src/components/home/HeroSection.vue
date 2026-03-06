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
  background: #ADD8E6;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 182, 193, 0.3);
  z-index: 1;
}

.hero-container {
  @apply relative w-full h-full z-10;
}

.hero-slide {
  @apply absolute inset-0 opacity-0 transition-opacity duration-1000 flex items-center justify-center;
  z-index: 2;
}

.hero-slide.active {
  @apply opacity-100;
}

.hero-content {
  @apply text-center z-10 px-4 max-w-5xl mx-auto;
  position: relative;
  z-index: 3;
}

.hero-title {
  @apply text-5xl md:text-7xl font-bold mb-6;
  color: white;
  animation: fadeInUp 0.8s ease-out;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  @apply text-xl md:text-2xl mb-12;
  color: rgba(255, 255, 255, 0.9);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.cta-btn {
  @apply text-lg px-10 py-4 rounded-full font-semibold transition-all duration-300;
  background: white;
  color: #2E86AB;
  border: 2px solid #1B4F72;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.4);
}

.cta-btn:hover {
  background: #1B4F72;
  color: white;
  border-color: #1B4F72;
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 182, 193, 0.3);
}

.slide-indicators {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20;
}

.indicator {
  @apply w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
}

.indicator.active {
  @apply w-10;
  background-color: #1B4F72;
  box-shadow: 0 2px 10px rgba(255, 182, 193, 0.3);
}

.nav-arrow {
  @apply absolute top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center z-20;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #1B4F72;
  color: white;
  backdrop-filter: blur(20px);
}

.nav-arrow:hover {
  background: #1B4F72;
  border-color: #1B4F72;
  color: white;
  transform: translateY(-50%) scale(1.05);
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