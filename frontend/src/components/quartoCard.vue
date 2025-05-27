<template>
    <div class="quarto-card" @click="emitOpenPopup">
      <div class="card-header">
        <h3>Quarto #{{ quarto.numero_quarto }}</h3>
        <span :class="['status', quarto.disponivel ? 'disponivel' : 'indisponivel']">
          {{ quarto.disponivel ? 'Disponível' : 'Ocupado' }}
        </span>
      </div>
      <div class="card-body">
        <p><strong>Tipo:</strong> {{ quarto.tipo }}</p>
        <p><strong>Preço:</strong> R$ {{ formatarPreco(quarto.preco) }}</p>
        <p><strong>Capacidade:</strong> {{ quarto.capacidade }} {{ quarto.capacidade > 1 ? 'pessoas' : 'pessoa' }}</p>
      </div>
      <div class="card-footer">
        <button @click.stop="emitOpenPopup">Ver Detalhes</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuartoCard',
    props: {
      quarto: {
        type: Object,
        required: true,
        validator: (value) => {
          return (
            value.hasOwnProperty('numero_quarto') &&
            value.hasOwnProperty('tipo') &&
            value.hasOwnProperty('preco') &&
            value.hasOwnProperty('disponivel') &&
            value.hasOwnProperty('capacidade')
          );
        },
      },
    },
    methods: {
      emitOpenPopup() {
        this.$emit('open-popup', this.quarto.numero_quarto);
      },
      formatarPreco(preco) {
          if (preco === null || preco === undefined) return '0,00';
          return parseFloat(preco).toFixed(2).replace('.', ',');
      }
    },
  };
  </script>
  
  <style scoped>
  .quarto-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .quarto-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    background-color: #6200EE; /* Roxo */
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 1.3em;
  }
  
  .card-header .status {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8em;
    font-weight: bold;
  }
  
  .card-header .status.disponivel {
    background-color: #4CAF50; /* Verde para disponível */
  }
  
  .card-header .status.indisponivel {
    background-color: #D32F2F; /* Vermelho para indisponível */
  }
  
  
  .card-body {
    padding: 20px;
    flex-grow: 1; 
  }
  
  .card-body p {
    margin: 8px 0;
    font-size: 0.95em;
    color: #333;
  }
  
  .card-body p strong {
    color: #2c3e50;
    font-weight: 600;
  }
  
  .card-footer {
    padding: 15px;
    background-color: #f8f8f8;
    border-top: 1px solid #eee;
    text-align: right;
  }
  
  .card-footer button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s ease;
  }
  
  .card-footer button:hover {
    background-color: #0056b3;
  }
  </style>