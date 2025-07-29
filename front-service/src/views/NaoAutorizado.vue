<template>
    <div class="not-authorized">
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <router-link to="/">Voltar para o início</router-link>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .not-authorized {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  