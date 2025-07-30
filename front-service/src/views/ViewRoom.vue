<template>
  <div class="quartos-disponiveis-container">
    <h2>Quartos Disponíveis</h2>
    <br>

    <div v-if="loading">Carregando quartos...</div>
    <div v-else-if="quartos.length === 0">Nenhum quarto disponível.</div>

    <div class="quartos-grid">
      <quartoCard
        v-for="quarto in quartos"
        :key="quarto.numero_quarto"
        :quarto="quarto"
        :is-user="true"
        @agendar="abrirAgendamento"
      />
    </div>

    <ReservaModal
      v-if="modalAgendamentoVisivel"
      :is-visible="modalAgendamentoVisivel"
      :modo-usuario="true"
      :reserva-to-edit="selectedReserva"
      @close="fecharAgendamento"
      @createReserva="handleReservar"
    />
  </div>
</template>

<script>
import quartoCard from '../components/quartoCard.vue';
import ReservaModal from '../components/modals/ModalReserva.vue';
import { roomsApi, reservationApi } from '../utils/axios';

export default {
  name: 'QuartosDisponiveis',
  components: {
    quartoCard,
    ReservaModal,
  },
  data() {
    return {
      quartos: [],
      loading: true,
      modalAgendamentoVisivel: false,
      selectedReserva: null,
      userId: parseInt(localStorage.getItem('userId')),
    };
  },
  async created() {
    await this.fetchQuartos();
  },
  methods: {
    async fetchQuartos() {
      try {
        const response = await roomsApi.get('/listar');
        this.quartos = (response.data || []).filter(q => q.disponivel);
      } catch (err) {
        console.error('Erro ao buscar quartos:', err);
        this.quartos = [];
      } finally {
        this.loading = false;
      }
    },
    abrirAgendamento(quarto) {
      this.selectedReserva = {
        usuario_id: this.userId,
        numero_quarto: quarto.numero_quarto,
        data_reserva: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        numero_pessoas: 1,
      };
      this.modalAgendamentoVisivel = true;
    },
    fecharAgendamento() {
      this.modalAgendamentoVisivel = false;
      this.selectedReserva = null;
    },
    async handleReservar(reserva) {
      try {
        await reservationApi.post('/cadastrar', {
          numero_quarto: reserva.numero_quarto,
          usuario_id: reserva.usuario_id,
          data_reserva: reserva.data_reserva,
          check_in: reserva.check_in,
          check_out: reserva.check_out,
          numero_pessoas: reserva.numero_pessoas,
        });
        alert('Reserva realizada com sucesso!');
        this.fecharAgendamento();
        this.fetchQuartos();
      } catch (err) {
        console.error('Erro ao reservar:', err);
        alert('Erro ao realizar reserva.');
      }
    },
  },
};
</script>

<style scoped>
.quartos-disponiveis-container {
  padding: 20px;
}
.quartos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
