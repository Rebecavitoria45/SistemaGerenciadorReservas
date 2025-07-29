<template>
  <div class="home-container">
    <div class="welcome-section">
      <br>
     <h5>Veja abaixo suas reservas e aproveite os melhores quartos disponíveis.</h5>
</div>


    <section class="carousel-section">
      <ImageCarousel />
    </section>
  <br>
  <br>


    <section class="reservas-section">
      <h2>Minhas Reservas</h2>
      <ListagemReservas />
    </section>
<br>
<br>

    <section class="quartos-section">
      <h2>Quartos Disponíveis</h2>

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
    </section>

    <AgendamentoModal
    v-if="isUser"
  :is-visible="modalAgendamentoVisivel"
  :quarto="selectedQuarto"
  :usuario="{ id: userId }"
  @close="fecharModalAgendamento"
  @confirmarReserva="enviarReserva"
/>
  </div>
</template>


<script>

import ListagemReservas from '@/components/listaReservas.vue';
import quartoCard from '@/components/quartoCard.vue';
import ImageCarousel from '../components/Carousel.vue';
import AgendamentoModal from '@/components/modals/ModalAgendamento.vue';
import { roomsApi, reservationApi } from '@/utils/axios';

export default {
  name: 'HomeView',
  components: {
    ListagemReservas,
    quartoCard,
    ImageCarousel,
    AgendamentoModal,
  },
  data() {
    return {
      quartos: [],
      loading: true,
      modalAgendamentoVisivel: false,
      selectedQuarto: null,
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
      this.selectedQuarto = quarto;
      this.modalAgendamentoVisivel = true;
    },
    fecharAgendamento() {
      this.modalAgendamentoVisivel = false;
      this.selectedQuarto = null;
    },
    async handleReservar({ numero_quarto, data_inicio, data_fim }) {
      try {
        await reservationApi.post('/cadastrar', {
          numero_quarto,
          usuario_id: this.userId,
          data_checkin: data_inicio,
          data_checkout: data_fim,
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
.dashboard-wrapper {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
  box-sizing: border-box;
}

.welcome-section {
  margin-bottom: 30px;
  color: #2c3e50;
}

.welcome-section h1 {
  font-size: 2.2em;
  margin-bottom: 8px;
}

.welcome-section p {
  font-size: 1.1em;
  color: #555;
}

.minhas-reservas {
  margin-bottom: 40px;
}

.minhas-reservas h2,
.quartos-destaque h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.8rem;
}

.quartos-destaque {
  margin-bottom: 40px;
}

/* Aqui vem a grid para os cards */
.quartos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: start;
}

/* Estilo para o botão reservar, se tiver */
.button-reservar {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button-reservar:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Mensagens no centro */
.loading, .error-message, .no-quartos-message {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
}

.error-message {
  color: #d9534f; 
  font-weight: bold;
}

.no-quartos-message {
  color: #6c757d;
}

</style>
