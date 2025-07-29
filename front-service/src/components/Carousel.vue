<template>
    <div class="carousel">
      <img
        v-for="(imagem, index) in imagens"
        :key="index"
        :src="imagem"
        alt="Imagem do carrossel"
        class="carousel-image"
      />
    </div>
  </template>
  

  <script>
  import img1 from '@/assets/pexels1.jpg';
  import img2 from '@/assets/pexels2.jpg';
  import img3 from '@/assets/pexels3.jpg';
  
  export default {
    name: 'Carousel',
    data() {
      return {
        imagens: [img1, img2, img3],
      };
    },
  };
  </script>
  
  <style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 10px;
  scroll-behavior: smooth;
  padding: 10px 0;
}

.carousel-image {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  border-radius: 10px;
  scroll-snap-align: start;
}
</style>
