<template>
  <div>
    <div class="cards-container">
      <CardContador
        titulo="Total de Reservas"
        descricao="Até o momento"
        cor="bg-lilac"
        endpoint="http://localhost:3003/api/reservas/total" propriedadeContagem="total"
      >
        <template v-slot:icone>
          <i class="fas fa-calendar-alt card-icon"></i>
        </template>
      </CardContador>

      <CardContador
        titulo="Total de Quartos"
        descricao="Cadastrados"
        cor="bg-light-blue"
        endpoint="http://localhost:3002/api/quartos/total" propriedadeContagem="total"
      >
        <template v-slot:icone>
          <i class="fas fa-bed card-icon"></i>
        </template>
      </CardContador>

      <CardContador
        titulo="Total de Usuários"
        descricao="Cadastrados"
        cor="bg-light-green"
        endpoint="http://localhost:3004/api/usuarios/total" propriedadeContagem="total"
      >
        <template v-slot:icone>
          <i class="fas fa-users card-icon"></i>
        </template>
      </CardContador>
    </div>

    <div class="recentes">
      <h2>Reservas Recentes</h2>
      <div v-if="reservas.length === 0" class="sem-reservas">
        <p>Nenhuma reserva recente encontrada.</p>
      </div>
      <table v-else class="tabela-reservas">
        <thead>
          <tr>
            <th>ID Reserva</th> <th>Usuário ID</th> <th>Número Quarto</th> <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id_reserva"> <td data-label="ID Reserva">{{ reserva.id_reserva }}</td> <td data-label="Usuário ID">{{ reserva.usuario_id }}</td> <td data-label="Número Quarto">{{ reserva.numero_quarto }}</td> <td data-label="Check-in">{{ formatarData(reserva.check_in) }}</td> <td data-label="Check-out">{{ formatarData(reserva.check_out) }}</td> </tr>
        </tbody>
      </table>
      <button @click="irParaReservas" class="botao-ver-mais">Ver mais</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CardContador from '../components/Cards.vue'; // Mantenha o caminho e o nome do arquivo que você está usando

export default {
  name: 'HomeView',
  components: {
    CardContador,
  },
  data() {
    return {
      reservas: [],
    };
  },
  methods: {
    async carregarReservasRecentes() {
      try {
        // AJUSTE AQUI: Use a URL COMPLETA para o endpoint de reservas recentes
        const { data } = await axios.get('http://localhost:3004/api/reservas/recentes?limite=5');
        this.reservas = data;
      } catch (error) {
        console.error('Erro ao carregar reservas recentes:', error);
        this.reservas = [];
      }
    },
    formatarData(data) {
      if (!data) return '';
      // Assegura que o Date() pode parsear corretamente a data
      return new Date(data).toLocaleDateString('pt-BR');
    },
    irParaReservas() {
      this.$router.push('/reservas');
    },
  },
  mounted() {
    this.carregarReservasRecentes();
  },
};
</script>

<style scoped>
/* SEUS ESTILOS ORIGINAIS (sem mudanças, conforme você forneceu) */
.cards-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: space-around;
}

.recentes {
  margin-top: 40px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.recentes h2 {
  color: #1F2937;
  margin-bottom: 20px;
}

.sem-reservas {
  border: 1px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #6B7280;
}

.tabela-reservas {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 15px;
  background-color: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.tabela-reservas th,
.tabela-reservas td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.tabela-reservas th {
  background-color: #f3f4f6;
  color: #4B5563;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.tabela-reservas tbody tr:last-child td {
  border-bottom: none;
}

.tabela-reservas tbody tr:hover {
  background-color: #f0f4f8;
}

.botao-ver-mais {
  display: block;
  width: fit-content;
  margin: 25px auto 0;
  padding: 12px 25px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.botao-ver-mais:hover {
  background-color: #5848e5;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .recentes {
    padding: 15px;
  }
  .tabela-reservas, .tabela-reservas tbody, .tabela-reservas tr, .tabela-reservas td {
    display: block;
    width: 100%;
  }
  .tabela-reservas thead {
    display: none;
  }
  .tabela-reservas td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border-bottom: 1px solid #eee;
  }
  .tabela-reservas td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 45%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
    color: #4B5563;
  }
  .tabela-reservas tbody tr {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    display: block;
  }
}
</style>