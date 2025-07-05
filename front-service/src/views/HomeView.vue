<template>
  <div class="dashboard-wrapper"> <div class="cards-container">
      <CardContador
        titulo="Total de Reservas"
        descricao="Até o momento"
        cor="bg-lilac"
        :valor="totalReservas"
      >
        <template v-slot:icone>
          <i class="bi bi-calendar-check card-icon"></i>
        </template>
      </CardContador>

      <CardContador
        titulo="Total de Quartos"
        descricao="Cadastrados"
        cor="bg-light-blue"
        :valor="totalQuartos"
      >
        <template v-slot:icone>
          <i class="bi bi-door-open card-icon"></i>
        </template>
      </CardContador>

      <CardContador
        titulo="Total de Usuários"
        descricao="Cadastrados"
        cor="bg-light-green"
        :valor="totalUsuarios"
      >
        <template v-slot:icone>
          <i class="bi bi-people card-icon"></i>
        </template>
      </CardContador>
    </div>

    <ListagemReservas ref="listagemReservasComponent" class="listagem-reservas" />

  </div>
</template>

<script>
import CardContador from '../components/Cards.vue';
import ListagemReservas from '../components/listaReservas.vue';
import { userApi, roomsApi, reservationApi } from '../utils/axios';

export default {
  name: 'HomeView',
  components: {
    CardContador,
    ListagemReservas,
  },
  data() {
    return {
      totalReservas: 'Carregando...',
      totalQuartos: 'Carregando...',
      totalUsuarios: 'Carregando...',
    };
  },
  methods: {
    getContagem(data) {
      if (Array.isArray(data)) {
        return data.length;
      } else if (typeof data === 'object' && data !== null && 'total' in data) {
        return data.total;
      } else if (typeof data === 'object' && data !== null && 'count' in data) {
        return data.count;
      }
      return 0;
    },

    async fetchAllCounts() {
      try {
        const reservasResponse = await reservationApi.get('/listar');
        this.totalReservas = this.getContagem(reservasResponse.data);

        const quartosResponse = await roomsApi.get('/listar');
        this.totalQuartos = this.getContagem(quartosResponse.data);

        const usuariosResponse = await userApi.get('/listar');
        this.totalUsuarios = this.getContagem(usuariosResponse.data);

      } catch (error) {
        console.error('Erro ao carregar dados dos cards:', error.response || error.message);
        this.totalReservas = 'Erro';
        this.totalQuartos = 'Erro';
        this.totalUsuarios = 'Erro';
      }
    },
    handleReservaSalva() {
      if (this.$refs.listagemReservasComponent) {
        this.$refs.listagemReservasComponent.fetchReservasRecentes();
      }
      this.fetchAllCounts();
    },
  },
  mounted() {
    this.fetchAllCounts();
  },
};
</script>

<style scoped>
.dashboard-wrapper {
  padding: 20px; 
  box-sizing: border-box; 
  width: 100%;
}

.cards-container {
  display: flex;
  gap: 18px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.listagem-reservas {
  margin-top: 30px;
}

@media (max-width: 992px) {
  .dashboard-wrapper {
    padding: 15px; 
  }
  .cards-container {
    gap: 12px;
    justify-content: space-around;
  }
}

@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 10px;
  }
  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
}
</style>