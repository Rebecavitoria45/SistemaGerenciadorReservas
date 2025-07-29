<template>
  <div>
    <h2>Minhas Reservas (Listagem)</h2>

    <div v-if="loading">Carregando reservas...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="reservas.length > 0" class="reservas-container">
      <ReservaCard
        v-for="reserva in reservas"
        :key="reserva.id_reserva"
        :reserva="reserva"
        @open-popup="abrirDetalhesReserva"
      />
    </div>

    <div v-else-if="!loading && !error">Nenhuma reserva encontrada.</div>
  </div>
</template>

<script>
import ReservaCard from '../components/ReservaCard.vue';
import { ref, onMounted } from 'vue';
import { reservationApi } from '../utils/axios';
import { useRouter } from 'vue-router';

export default {
  components: { ReservaCard },

  setup() {
    const reservas = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();

    function pegarUsuarioIdDoToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload.id;
      } catch {
        return null;
      }
    }

    async function carregarReservas() {
      loading.value = true;
      error.value = null;

      const usuarioId = pegarUsuarioIdDoToken();

      if (!usuarioId) {
        error.value = 'Usuário não autenticado.';
        loading.value = false;
        router.push('/login'); // redireciona para login se quiser
        return;
      }

      try {
        const response = await reservationApi.get(`/reservasusuario/${usuarioId}`);
        reservas.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.msg || 'Erro ao carregar reservas';
      } finally {
        loading.value = false;
      }
    }

    function abrirDetalhesReserva(idReserva) {
      console.log('Abrir detalhes da reserva:', idReserva);
    }

    onMounted(() => {
      carregarReservas();
    });

    return {
      reservas,
      loading,
      error,
      abrirDetalhesReserva,
    };
  },
};
</script>



<style scoped>
.listagem-container {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 20px;
  position: relative;
  padding-bottom: 70px;
}

.listagem-container h2 {
  color: #374151;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
}

thead th {
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #f9fafb;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-style: italic;
}

.ver-mais-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 40px);
}

.btn-ver-mais-global {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-ver-mais-global:hover {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
