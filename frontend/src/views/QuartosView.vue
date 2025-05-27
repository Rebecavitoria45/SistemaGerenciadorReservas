<template>
  <div class="quartos-page">
    <h2>Gerenciamento de Quartos</h2>

    <p v-if="loading">Carregando quartos...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="quartos && quartos.length" class="quartos-grid">
      <QuartoCard
        v-for="quarto in quartos"
        :key="quarto.numero_quarto"
        :quarto="quarto"
        @open-popup="handleOpenPopup"
      />
    </div>
    <p v-else-if="!loading && !error && (!quartos || quartos.length === 0)" class="no-rooms-message">Nenhum quarto encontrado.</p>
  </div>
</template>

<script>
import QuartoCard from '../components/quartoCard.vue';
import axios from 'axios';

export default {
  name: 'QuartosPage',
  components: {
    QuartoCard, 
  },
  data() {
    return {
      quartos: [], 
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchQuartos();
  },
  methods: {
    async fetchQuartos() {
      try {
        this.loading = true;
        this.error = null;

        console.log("Tentando buscar quartos...");
        const response = await axios.get('http://localhost:3002/listar'); 
        
        console.log("Dados recebidos da API de quartos:", response.data);
        
        if (Array.isArray(response.data)) {
            this.quartos = response.data;
        } else {
            console.error("Formato inesperado da API de quartos. Esperado um array, recebido:", response.data);
            this.error = "Erro no formato dos dados da API de quartos.";
        }

      } catch (err) {
        console.error('Erro ao buscar quartos:', err);
        if (err.response) {
          this.error = `Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido do servidor.'}`;
          console.error("Detalhes da resposta de erro:", err.response.data);
        } else if (err.request) {
          this.error = 'Erro de rede: O servidor de quartos não está respondendo. Verifique se ele está online e a URL do backend está correta.';
          console.error("Nenhuma resposta recebida do servidor:", err.request);
        } else {
          this.error = 'Ocorreu um erro inesperado ao configurar a requisição.';
          console.error("Erro na requisição Axios:", err.message);
        }
      } finally {
        this.loading = false;
      }
    },
    handleOpenPopup(roomNumber) {
      console.log(`Você clicou para abrir o popup do quarto com número: ${roomNumber}`);
    },
  },
};
</script>

<style scoped>
.quartos-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.quartos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 25px;
  justify-content: center;
  align-items: start;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

.no-rooms-message {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>