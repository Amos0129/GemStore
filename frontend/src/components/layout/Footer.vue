<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Company Info -->
      <div class="footer-section">
        <h3>關於我們</h3>
        <p class="company-description">
          晶礦飾品專注於提供高品質的天然水晶飾品，每一件作品都經過精心挑選，為您帶來正能量與美麗。
        </p>
        <div class="social-links">
          <a href="#" class="social-btn" title="YouTube">
            <i class="fab fa-youtube"></i>
          </a>
          <a href="#" class="social-btn" title="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="social-btn" title="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="social-btn" title="Podcast">
            <i class="fas fa-podcast"></i>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h3>快速連結</h3>
        <ul class="footer-links">
          <li><router-link to="/about">品牌故事</router-link></li>
          <li><router-link to="/contact">聯絡我們</router-link></li>
          <li><router-link to="/products">商品目錄</router-link></li>
          <li><router-link to="/live">直播購物</router-link></li>
        </ul>
      </div>

      <!-- Customer Service -->
      <div class="footer-section">
        <h3>客戶服務</h3>
        <ul class="footer-links">
          <li><a href="#">購物須知</a></li>
          <li><a href="#">常見問題</a></li>
          <li><a href="#">退換貨政策</a></li>
          <li><a href="#">配送資訊</a></li>
          <li><a href="#">隱私權政策</a></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div class="footer-section">
        <h3>聯絡方式</h3>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>service@crystal-jewelry.com</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span>0800-123-456</span>
          </div>
          <div class="contact-item">
            <i class="fab fa-line"></i>
            <span>@crystaljewelry</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-clock"></i>
            <span>週一至週五 09:00-18:00</span>
          </div>
        </div>
        
        <!-- Live Schedule -->
        <div class="live-schedule">
          <h4>直播時間</h4>
          <p>每週三/四/五 20:30 IG直播</p>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} 晶礦飾品. All rights reserved.
          </p>
          
          <!-- Payment Methods -->
          <div class="payment-methods">
            <i class="fas fa-credit-card"></i>
            <i class="fab fa-cc-visa"></i>
            <i class="fab fa-cc-mastercard"></i>
            <i class="fab fa-cc-jcb"></i>
            <i class="fab fa-cc-apple-pay"></i>
          </div>
          
          <!-- Kuse Branding -->
          <div class="kuse-branding" @click="openKuseLink">
            <span>made with</span>
            <svg viewBox="0,0,160,44" xmlns="http://www.w3.org/2000/svg">
              <path d="m.01,20.65C-.43,8.25,9.3-2.03,22.04.34,34.78,2.72,43.29,8.32,43.29,22.9s-8.66,19.01-22.03,20.3C7.9,44.5.46,33.05.01,20.65z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="m146.76,7.94c8.07,0,13.24,6.15,13.24,14.58v1.39h-20.75c.45,4.05,3.51,7.37,8.57,7.37,2.62,0,5.73-1.05,7.62-2.94l2.67,3.83c-2.67,2.55-6.62,3.88-10.9,3.88-8.07,0-14.08-5.6-14.08-14.08,0-7.76,5.67-14.02,13.63-14.02zm0,4.77c-5.01,0-7.29,3.83-7.57,7.1h15.13c-.11-3.16-2.28-7.1-7.57-7.1z" fill="currentColor"></path>
              <path d="m86.64,24.49c0,4.15,2.39,6.84,6.84,6.84,4.4,0,6.84-2.69,6.84-6.84V8.55h5.37v16.33c0,6.7-4.06,11.14-12.21,11.14-8.21,0-12.21-4.5-12.21-11.09V8.55h5.37v15.94zm32.99-16.55c4.49,0,8.06,1.47,10.6,3.86l-2.59,3.81c-2.05-2-5.28-3.08-8.06-3.08-2.88,0-4.84,1.37-4.84,3.32,0,1.91,2.64,2.54,5.81,3.27,4.59,1.08,10.26,2.4,10.26,8.46,0,4.94-3.76,8.41-11.14,8.41-4.98,0-8.94-1.76-11.24-4.11l2.54-4.11c1.86,1.91,5.18,3.67,8.84,3.67,3.91,0,5.57-1.66,5.57-3.62,0-2.3-2.88-2.98-6.21-3.76-4.54-1.08-9.87-2.3-9.87-8.06,0-4.5,4.2-8.06,10.31-8.06zM60.79,20.82,71.44,8.55h6.5L66.46,21.26,78.82,35.44h-6.5l-9.28-11.1-2.25,2.49v8.6h-5.33V8.55h5.33v12.27z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const openKuseLink = () => {
  window.open('https://kuse.ai', '_blank')
}
</script>

<style scoped>
.footer {
  @apply mt-auto;
  background-color: #FAFAFA;
  border-top: 1px solid rgba(196, 181, 253, 0.2);
}

.footer-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8;
}

.footer-section h3 {
  @apply text-xl font-semibold mb-4;
  color: #8B5CF6;
}

.company-description {
  @apply text-sm leading-relaxed mb-6;
  color: #6B21A8;
}

.social-links {
  @apply flex space-x-3;
}

.social-btn {
  @apply w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300;
  background-color: #FFFFFF;
  border: 1px solid rgba(196, 181, 253, 0.3);
  color: #8B5CF6;
}

.social-btn:hover {
  background-color: #C4B5FD;
  color: white;
}

.footer-links {
  @apply space-y-3;
}

.footer-links a {
  @apply transition-colors duration-300 text-sm;
  color: #6B21A8;
}

.footer-links a:hover {
  color: #F8BBD9;
}

.contact-info {
  @apply space-y-3;
}

.contact-item {
  @apply flex items-center space-x-3 text-sm;
  color: #6B21A8;
}

.contact-item i {
  @apply w-4;
  color: #C4B5FD;
}

.live-schedule {
  @apply mt-6 p-4 rounded-lg;
  background-color: rgba(196, 181, 253, 0.15);
}

.live-schedule h4 {
  @apply font-semibold mb-2;
  color: #8B5CF6;
}

.live-schedule p {
  @apply text-sm;
  color: #6B21A8;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.footer-bottom {
  @apply py-6;
  background-color: #F3F4F6;
  border-top: 1px solid rgba(196, 181, 253, 0.2);
}

.footer-bottom-content {
  @apply flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0;
}

.copyright {
  @apply text-sm;
  color: #6B21A8;
}

.payment-methods {
  @apply flex items-center space-x-4 text-xl;
  color: #C4B5FD;
}

.kuse-branding {
  @apply flex items-center space-x-2 text-gray-400 text-sm cursor-pointer hover:text-accent-blue transition-colors duration-300;
}

.kuse-branding svg {
  @apply h-5;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .footer-content {
    @apply grid-cols-1 gap-6 px-3 py-12;
  }
  
  .footer-section h3 {
    @apply text-lg mb-3;
  }
  
  .company-description {
    @apply text-xs leading-relaxed mb-4;
  }
  
  .social-links {
    @apply space-x-2;
  }
  
  .social-btn {
    @apply w-8 h-8;
  }
  
  .footer-links {
    @apply space-y-2;
  }
  
  .footer-links a {
    @apply text-xs;
  }
  
  .contact-item {
    @apply text-xs space-x-2;
  }
  
  .contact-item i {
    @apply w-3 text-xs;
  }
  
  .live-schedule {
    @apply mt-4 p-3;
  }
  
  .live-schedule h4 {
    @apply text-sm mb-1;
  }
  
  .live-schedule p {
    @apply text-xs;
  }
  
  .container {
    @apply px-3;
  }
  
  .footer-bottom {
    @apply py-4;
  }
  
  .footer-bottom-content {
    @apply text-center space-y-3 flex-col;
  }
  
  .copyright {
    @apply text-xs;
  }
  
  .payment-methods {
    @apply text-lg space-x-3;
  }
  
  .kuse-branding {
    @apply text-xs;
  }
}

@media (max-width: 480px) {
  .footer-content {
    @apply gap-5 py-10;
  }
  
  .footer-section h3 {
    @apply text-base mb-2;
  }
  
  .company-description {
    @apply text-xs mb-3;
  }
  
  .social-btn {
    @apply w-7 h-7 text-sm;
  }
  
  .footer-links a {
    @apply text-xs py-0.5;
  }
  
  .contact-item {
    @apply text-xs;
  }
  
  .live-schedule {
    @apply p-2;
  }
  
  .payment-methods {
    @apply text-base space-x-2;
  }
}
</style>