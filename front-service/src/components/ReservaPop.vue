<template>
    <div class="reserva-popup" v-if="isOpen">
      <div class="popup-content">
        <h3>Detalhes da Reserva #{{ reservaDetalhada.id }}</h3>
        <p>Cliente: {{ reservaDetalhada.nomeCliente }}</p>
        <p>Email: {{ reservaDetalhada.emailCliente }}</p>
        <p>Telefone: {{ reservaDetalhada.telefoneCliente }}</p>
        <p>Quarto: {{ reservaDetalhada.numeroQuarto }} ({{ reservaDetalhada.tipoQuarto }})</p>
        <p>Data de Entrada: {{ formatDate(reservaDetalhada.dataEntrada) }}</p>
        <p>Data de Saída: {{ formatDate(reservaDetalhada.dataSaida) }}</p>
        <p>Número de Hóspedes: {{ reservaDetalhada.numeroHospedes }}</p>
        <p>Valor Total: {{ formatCurrency(reservaDetalhada.valorTotal) }}</p>
        <p>Observações: {{ reservaDetalhada.observacoes || 'Nenhuma' }}</p>
        <button @click="closePopup" class="close-button">Fechar</button>
      </div>
    </div>
  </template>
  
  <script>
  import { formatDate } from '@/utils/date'; 
  import { formatCurrency } from '@/utils/currency'; 
  
  export default {
    props: {
      reservaDetalhada: {
        type: Object,
        default: () => ({}),
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close'],
    methods: {
      formatDate,
      formatCurrency,
      closePopup() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .reserva-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 500px;
  }
  
  .popup-content h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .popup-content p {
    margin-bottom: 0.5rem;
    color: #555;
  }
  
  .close-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1.5rem;
  }
  
  .close-button:hover {
    background-color: #c82333;
  }
  </style>