<template>
  <div class="reserva-card" @click="emitOpenPopup">
    <div class="card-image-container">
      <img :src="reserva.imagemUrl || 'https://via.placeholder.com/200x150/F8F8F8/000000?text=Quarto'" alt="Imagem do Quarto" class="card-image">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ reserva.nomeCliente }}</h3>
      <p class="card-detail">Quarto: <strong>{{ reserva.numeroQuarto }}</strong></p>
      <p class="card-detail">Entrada: {{ formatDate(reserva.dataEntrada) }}</p>
      <p class="card-detail">Saída: {{ formatDate(reserva.dataSaida) }}</p>
    </div>
    <div class="card-actions">
      <button class="details-button">Ver Detalhes</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reserva: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitOpenPopup() {
      this.$emit('open-popup', this.reserva.id);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    },
  },
};
</script>

<style scoped>
.reserva-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-width: 250px;
  max-width: 350px; 
  margin: auto; 
}

.reserva-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image-container {
  width: 100%;
  padding-bottom: 75%; 
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.card-content {
  padding: 15px;
  flex-grow: 1; 
}

.card-title {
  font-size: 1.4em;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
}

.card-detail {
  font-size: 0.95em;
  color: #555;
  margin-bottom: 5px;
  line-height: 1.4;
}

.card-detail strong {
  color: #1a73e8; 
}

.card-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: center;
}

.details-button {
  background-color: #4CAF50; 
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%; 
}

.details-button:hover {
  background-color: #45a049; 
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .reserva-card {
    max-width: none;
  }
}
</style>