<template>
  <div class="quartos-container">
    <h1>Quartos</h1>

    <div v-if="loading" class="loading-message">Carregando quartos...</div>
    <div v-else-if="error" class="error-message">
      Ocorreu um erro ao carregar os quartos: {{ error.message }}
    </div>
    <div v-else-if="quartos.length === 0" class="no-results">Nenhum quarto encontrado.</div>
    <div v-else class="cards-container">
      <div v-for="quarto in quartosPaginados" :key="quarto.id" class="quarto-card">
        <h2>Quarto {{ quarto.numero }}</h2>
        <p><strong>Tipo:</strong> {{ quarto.tipo }}</p>
        <p><strong>Status:</strong> {{ quarto.status }}</p>
      </div>
    </div>

    <div v-if="quartos.length > 0" class="paginacao">
      <button @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
      <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Quartos',
  data() {
    return {
      paginaAtual: 1,
      porPagina: 6,
      quartos: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.quartos.length / this.porPagina);
    },
    quartosPaginados() {
      const start = (this.paginaAtual - 1) * this.porPagina;
      return this.quartos.slice(start, start + this.porPagina);
    }
  },
  methods: {
    async fetchQuartos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('https://api.example.com/quartos');
        this.quartos = response.data;
      } catch (err) {
        this.error = err;
        console.error('Erro ao buscar quartos:', err);
      } finally {
        this.loading = false;
      }
    },
    paginaAnterior() {
      if (this.paginaAtual > 1) this.paginaAtual--;
    },
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
    }
  },
  created() {
    this.fetchQuartos();
  }
};
</script>

<style scoped>
.quartos-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2.5em;
  font-weight: 700;
}

.loading-message, .error-message, .no-results {
  text-align: center;
  font-size: 1.2em;
  color: #666;
  padding: 30px;
  border-radius: 8px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
}

.error-message {
  color: #d9534f;
  background-color: #fcecec;
  border-color: #ebccd1;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.quarto-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
}

.quarto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.quarto-card h2 {
  font-size: 1.6em;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
}

.quarto-card p {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 8px;
}

.quarto-card p strong {
  color: #1a73e8;
}

.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.paginacao button {
  padding: 0.7rem 1.4rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.paginacao button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.paginacao button:not(:disabled):hover {
  background-color: #45a049;
}

.paginacao span {
  font-size: 1.1em;
  color: #555;
}

/* Responsivo */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  h1 {
    font-size: 2em;
  }
}

@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
  .paginacao {
    flex-direction: column;
  }
}
</style>
