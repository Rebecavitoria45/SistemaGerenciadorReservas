<template>
    <div class="container-principal">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContainerPrincipal',
  };
  </script>
  
  <style scoped>
  .container-principal {
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: flex-start;
    padding: 2rem;
    box-sizing: border-box;
    width: 100%; 
    max-width: 800px; 
  }
  </style>