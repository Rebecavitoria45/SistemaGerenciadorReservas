<template>
  <div>
    <h1>Dashboard</h1>
    <p>{{ dataAtual }}</p>

    <!-- Cards -->
    <div class="cards-container">
      <Cards :titulo="'Reservas'" :valor="estatisticas.reservas" :descricao="'Este mês'" :cor="'#E0BBE4'" />
      <Cards :titulo="'Quartos'" :valor="estatisticas.quartos" :descricao="'Total disponíveis'" :cor="'#95CAE4'" />
      <Cards :titulo="'Usuários'" :valor="estatisticas.usuarios" :descricao="'Registrados'" :cor="'#A7E9B3'" />
    </div>

    <!-- Reservas Recentes -->
    <div class="recentes">
      <h2>Reservas Recentes</h2>
      <div v-if="reservas.length === 0" class="sem-reservas">
        <p>Nenhuma reserva recente encontrada</p>
      </div>
      <table v-else class="tabela-reservas">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Quarto</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.cliente }}</td>
            <td>{{ reserva.quarto }}</td>
            <td>{{ formatarData(reserva.checkin) }}</td>
            <td>{{ formatarData(reserva.checkout) }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="irParaReservas" class="botao-ver-mais">Ver mais</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cards from '../components/Cards.vue';

export default {
  components: {
    Cards,
  },
  data() {
    return {
      estatisticas: {
        reservas: 0,
        quartos: 0,
        usuarios: 0,
      },
      reservas: [],
    };
  },
  computed: {
    dataAtual() {
      return new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  methods: {
    async carregarEstatisticas() {
      try {
        const { data } = await axios.get('/api/dashboard/estatisticas');
        this.estatisticas = data;
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    },
    async carregarReservasRecentes() {
      try {
        const { data } = await axios.get('/api/reservas/recentes?limite=10');
        this.reservas = data;
      } catch (error) {
        console.error('Erro ao carregar reservas recentes:', error);
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR');
    },
    irParaReservas() {
      this.$router.push('/reservas');
    },
  },
  mounted() {
    this.carregarEstatisticas();
    this.carregarReservasRecentes();
  },
};
</script>

<style scoped>
.cards-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.recentes {
  margin-top: 40px;
}

.sem-reservas {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
}

.tabela-reservas {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.tabela-reservas th,
.tabela-reservas td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.botao-ver-mais {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.botao-ver-mais:hover {
  background-color: #5848e5;
}
</style>
