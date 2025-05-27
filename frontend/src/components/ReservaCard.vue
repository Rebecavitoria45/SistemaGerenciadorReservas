<template>
  <div class="reserva-card" @click="emitOpenPopup">
    <div class="card-header">
      <h3>Reserva #{{ reserva.id_reserva }}</h3>
      <span class="status">Confirmada</span> 
    </div>
    <div class="card-body">
      <p><strong>Usuário ID:</strong> {{ reserva.usuario_id }}</p>
      <p><strong>Quarto:</strong> {{ reserva.numero_quarto }}</p>
      <p><strong>Data da Reserva:</strong> {{ formatarData(reserva.data_reserva) }}</p>
      <p><strong>Check-in:</strong> {{ formatarData(reserva.check_in) }}</p>
      <p><strong>Check-out:</strong> {{ formatarData(reserva.check_out) }}</p>
      <p><strong>Pessoas:</strong> {{ reserva.numero_pessoas }}</p>
      <p><strong>Preço:</strong> R$ {{ formatarPreco(reserva.preco_reserva) }}</p>
    </div>
    <div class="card-footer">
      <button @click.stop="emitOpenPopup">Ver Detalhes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservaCard',
  props: {
    reserva: {
      type: Object,
      required: true,
      // Validação básica para garantir que os campos esperados existam
      validator: (value) => {
        return (
          value.hasOwnProperty('id_reserva') &&
          value.hasOwnProperty('usuario_id') &&
          value.hasOwnProperty('numero_quarto') &&
          value.hasOwnProperty('data_reserva') &&
          value.hasOwnProperty('check_in') &&
          value.hasOwnProperty('check_out') &&
          value.hasOwnProperty('numero_pessoas') &&
          value.hasOwnProperty('preco_reserva')
        );
      },
    },
  },
  methods: {
    emitOpenPopup() {
      // Emite um evento para o componente pai (ReservasPage) quando o card é clicado
      this.$emit('open-popup', this.reserva.id_reserva);
    },
    formatarData(dataString) {
      if (!dataString) return 'N/A';
      // Converte a string de data para um objeto Date e formata para o padrão brasileiro
      try {
        const date = new Date(dataString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
      } catch (e) {
        console.error("Erro ao formatar data:", e);
        return dataString; // Retorna a string original em caso de erro
      }
    },
    formatarPreco(preco) {
        if (preco === null || preco === undefined) return '0,00';
        // Converte para número e formata com duas casas decimais, usando vírgula para decimal
        return parseFloat(preco).toFixed(2).replace('.', ',');
    }
  },
};
</script>

<style scoped>
/* Estilos similares ao UsuarioCard, mas com cores adaptadas para Reservas */
.reserva-card {
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

.reserva-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #4CAF50; /* Verde */
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
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
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