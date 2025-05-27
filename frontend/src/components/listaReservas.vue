<template>
  <div class="listagem-container">
    <h2>Reservas Recentes</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>Data Reserva</th>
            <th>Cliente</th>
            <th>Quarto</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="no-data">Carregando reservas...</td>
          </tr>
          <tr v-else-if="reservas.length === 0">
            <td colspan="7" class="no-data">Nenhuma reserva recente encontrada.</td>
          </tr>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.id }}</td>
            <td>{{ formatarData(reserva.dataReserva) }}</td>
            <td>{{ reserva.nomeCliente }}</td>
            <td>{{ reserva.numeroQuarto }}</td>
            <td>{{ formatarData(reserva.checkin) }}</td>
            <td>{{ formatarData(reserva.checkout) }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(reserva.status)]">
                {{ reserva.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; 

export default {
  name: 'ListagemReservas',
  data() {
    return {
      reservas: [], 
      loading: true,
    };
  },
  methods: {
    async fetchReservasRecentes(limit = 10) { 
      this.loading = true;
      try {
        
        const response = await axios.get(`/api/reservas/recentes?limite=${limit}`);
        this.reservas = response.data;
      } catch (error) {
        console.error('Erro ao carregar reservas recentes:', error);
        this.reservas = []; 
      } finally {
        this.loading = false; 
      }
    },
    formatarData(dataISO) {
      if (!dataISO) return 'N/A'; 
      const data = new Date(dataISO);
     
      if (isNaN(data.getTime())) {
          return 'Data Inválida';
      }
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
    getStatusClass(status) {
      if (status === 'Confirmada') return 'status-active';
      if (status === 'Cancelada') return 'status-inactive';
      if (status === 'Pendente') return 'status-pending';
      return ''; 
    },
  },
  mounted() {
    this.fetchReservasRecentes(10); 
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
  margin-top: 20px; /* Adicionado para dar um respiro com o cards-container */
}

.listagem-container h2 {
  color: #374151;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto; /* Para responsividade em telas menores */
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
  color: #4b5563; /* cinza médio */
}

thead th {
  background-color: #f3f4f6;
  color: #374151; /* cinza escuro */
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #f9fafb; /* Efeito hover sutil */
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
}

.status-active {
  background-color: #d1fae5; /* verde claro */
  color: #065f46; /* verde escuro */
}

.status-inactive {
  background-color: #fee2e2; /* vermelho claro */
  color: #991b1b; /* vermelho escuro */
}

.status-pending {
  background-color: #ffedd5; /* laranja claro */
  color: #9a3412; /* laranja escuro */
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6b7280; /* cinza */
  font-style: italic;
}
</style>