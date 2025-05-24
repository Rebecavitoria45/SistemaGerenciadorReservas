<template>
    <div class="info-card" v-if="isVisible">
      <h3>{{ title }}</h3>
      <ul v-if="items.length > 0">
        <li v-for="(item, index) in items" :key="index">
          <slot :item="item"></slot>
        </li>
      </ul>
      <p v-else>{{ emptyMessage }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'InfoCard',
    props: {
      isVisible: Boolean,
      title: String,
      items: Array,
      emptyMessage: String,
    },
  };
  </script>
  
  <style scoped>
  .info-card {
    position: absolute;
    top: 50px; 
    right: 30px; 
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 4px;
    z-index: 10;
    width: 300px; 
  }
  
  .info-card h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  .info-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .info-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .info-card li:last-child {
    border-bottom: none;
  }
  </style>