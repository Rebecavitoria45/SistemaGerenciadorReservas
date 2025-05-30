<template>
  <div class="quarto-card" @click="emitOpenPopup">
    <div class="card-header">
      <h3>Quarto #{{ quarto.numero_quarto }}</h3>
      <span :class="['status', quarto.disponivel ? 'disponivel' : 'ocupado']">
        {{ quarto.disponivel ? 'Disponível' : 'Ocupado' }}
      </span>
    </div>
    <div class="card-body">
      <p><i class="fas fa-bed"></i> <strong>Tipo:</strong> {{ quarto.tipo }}</p>
      <p><i class="fas fa-money-bill-wave"></i> <strong>Preço:</strong> R$ {{ formatarPreco(quarto.preco) }}</p>
      <p><i class="fas fa-users"></i> <strong>Capacidade:</strong> {{ quarto.capacidade }} {{ quarto.capacidade > 1 ? 'pessoas' : 'pessoa' }}</p>
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
        const requiredProps = ['numero_quarto', 'preco', 'disponivel', 'capacidade', 'tipo'];
        return requiredProps.every(prop => value.hasOwnProperty(prop));
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
  min-width: 280px; 
}

.quarto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #4CAF50; 
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
  background-color: rgba(0, 0, 0, 0.2); 
}

.card-header .status.disponivel {
  background-color: #28a745; 
}

.card-header .status.ocupado { 
  background-color: #dc3545; 
}

.card-body {
  padding: 20px;
  flex-grow: 1; 
}

.card-body p {
  margin: 8px 0;
  font-size: 0.95em;
  color: #333;
  display: flex; 
  align-items: center;
}

.card-body p i { 
  margin-right: 8px;
  color: #6c757d; 
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