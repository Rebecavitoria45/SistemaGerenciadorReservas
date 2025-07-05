<template>
  <div class="reservas-page-container">
    <div class="header-reserva">
      <h2>Gerenciamento de Reservas</h2>
      <button @click="openCreateModal" class="button-add-reserva">
        Adicionar Nova Reserva
      </button>
    </div>

    <p v-if="loading">Carregando reservas...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>
    <p v-if="userApiError" class="error-message">Erro na API de Usuários: {{ userApiError }}</p>

    <div v-if="reservasComNomes && reservasComNomes.length" class="reservas-grid">
      <ReservaCard
        v-for="reserva in reservasComNomes"
        :key="reserva.id_reserva"
        :reserva="reserva"
        :nomeUsuario="reserva.nome_usuario"  @open-popup="handleOpenEditModal"
      />
    </div>
    <p
      v-else-if="!loading && !error && (!reservasComNomes || reservasComNomes.length === 0)"
      class="no-reservations-message"
    >
      Nenhuma reserva encontrada.
    </p>

    <ReservaModal
      :is-visible="isModalOpen"
      :reserva-to-edit="selectedReserva"
      @close="closeModal"
      @createReserva="handleCreateReserva"
      @updateReserva="handleUpdateReserva"
      @deleteReserva="handleDeleteReserva"
    />
  </div>
</template>

<script>
import ReservaCard from '@/components/ReservaCard.vue';
import ReservaModal from '@/components/modals/ModalReserva.vue';
import axios from 'axios'; 
import { userApi, reservationApi } from '../utils/axios'; // Certifique-se de que os caminhos estão corretos

export default {
  name: 'ReservasPage',
  components: {
    ReservaCard,
    ReservaModal,
  },
  data() {
    return {
      reservas: [],
      usuarioNomes: {}, // { usuario_id: nome_do_usuario }
      loading: true,
      error: null, // Erros gerais da API de reservas
      userApiError: null, // Erros específicos da API de usuários
      isModalOpen: false,
      selectedReserva: null,
    };
  },
  computed: {
    // Esta computed property é essencial para que o ReservaCard receba o nome do usuário
    reservasComNomes() {
      // Retorna as reservas, cada uma com sua propriedade 'nome_usuario' preenchida
      return this.reservas.map((reserva) => {
        const usuarioId = reserva.usuario_id || reserva.id_usuario; 
        
        // Prioriza o nome já carregado, senão exibe "Carregando..." ou "Não disponível" em caso de erro
        const nome = this.usuarioNomes[usuarioId] 
                     || (this.userApiError ? 'Não disponível' : 'Carregando...');
        
        return {
          ...reserva,
          nome_usuario: nome, 
        };
      });
    },
  },
  async created() {
    // Chama a função para buscar reservas e, consequentemente, os nomes dos usuários
    await this.fetchReservas(); 
  },
  methods: {
    async fetchReservas() {
      try {
        this.loading = true;
        this.error = null;
        this.userApiError = null; // Reseta o erro da API de usuários a cada nova busca
        
        const timestamp = new Date().getTime(); // Para evitar cache do navegador, se necessário
        const response = await reservationApi.get(`/listar?_=${timestamp}`);
        
        // Garante que 'reservas' é um array, mesmo se a API retornar null ou undefined
        this.reservas = Array.isArray(response.data) ? response.data : [];
        console.log("[DEBUG ReservasPage] Reservas carregadas:", this.reservas.length);

        // Extrai os IDs de usuário únicos das reservas para evitar chamadas duplicadas
        const uniqueUsuarioIds = [...new Set(
          this.reservas
            .map(r => r.usuario_id || r.id_usuario) // Suporta 'usuario_id' ou 'id_usuario'
            .filter(id => id != null) // Filtra IDs nulos ou indefinidos
        )];

        // Usa Promise.all para buscar todos os nomes de usuário em paralelo
        // Isso melhora a performance, pois não espera uma requisição terminar para iniciar a próxima
        if (uniqueUsuarioIds.length > 0) {
            await Promise.all(uniqueUsuarioIds.map(id => this.fetchNomeUsuario(id)));
        } else {
            console.log("[DEBUG ReservasPage] Nenhuma reserva com ID de usuário para buscar nomes.");
        }

      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            this.error = `Erro do servidor (${err.response.status}): ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error("[DEBUG ReservasPage] Detalhes do erro do servidor na fetchReservas:", err.response.data);
          } else if (err.request) {
            this.error = 'Erro de rede: O servidor de reservas não está respondendo. Verifique se o backend está rodando na porta 3003.';
          } else {
            this.error = 'Erro ao configurar a requisição de reservas: ' + err.message;
          }
        } else {
          this.error = 'Ocorreu um erro inesperado ao buscar reservas.';
        }
        console.error("[DEBUG ReservasPage] Erro geral ao buscar reservas:", err);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchNomeUsuario(usuarioId) {
      // Verifica se a userApi está configurada antes de tentar usar
      if (!userApi || !userApi.defaults || !userApi.defaults.baseURL) {
        console.error("[DEBUG ReservasPage] userApi ou sua baseURL não estão definidas. Verifique a importação e configuração de '../utils/axios'.");
        this.usuarioNomes = { ...this.usuarioNomes, [usuarioId]: 'Erro: API não configurada' };
        this.userApiError = 'API de Usuários não configurada';
        return;
      }

      console.log(`%c[DEBUG ReservasPage] === INICIANDO BUSCA DE NOME PARA ID: ${usuarioId} ===`, 'background: #222; color: #bada55');

      if (!usuarioId) {
        console.warn(`%c[DEBUG ReservasPage] ID de usuário é nulo ou indefinido para busca. Pulando.`, 'color: yellow');
        this.usuarioNomes = { ...this.usuarioNomes, [usuarioId]: 'ID Inválido' };
        return;
      }
      // Evita buscar o nome se já estiver em cache ou se já houve um erro prévio para este ID
      if (this.usuarioNomes[usuarioId] && this.usuarioNomes[usuarioId] !== 'Carregando...') {
        console.log(`%c[DEBUG ReservasPage] Nome para ID ${usuarioId} já está em cache: ${this.usuarioNomes[usuarioId]}. Pulando busca.`, 'color: lightblue');
        return;
      }

      try {
        // AQUI ESTÁ CORRETO: userApi.get(`/buscar/${usuarioId}`)
        const response = await userApi.get(`/buscar/${usuarioId}`); 
        
        console.log(`%c[DEBUG ReservasPage] Resposta RECEBIDA da API de usuários para ID ${usuarioId}:`, 'color: green', response.status, response.data);
        
        const nome = response?.data?.usuario?.nome; // Ajuste o path se a estrutura da sua resposta for diferente
        
        if (nome) {
          // Usa um novo objeto para garantir a reatividade no Vue 2 (spread syntax)
          this.usuarioNomes = { ...this.usuarioNomes, [usuarioId]: nome };
          console.log(`%c[DEBUG ReservasPage] Nome para ID ${usuarioId} ATUALIZADO: ${nome}`, 'color: limegreen');
          this.userApiError = null; // Limpa o erro se o nome foi encontrado
        } else {
          console.warn(`%c[DEBUG ReservasPage] Nome de usuário não encontrado na estrutura esperada da resposta para ID ${usuarioId}. Resposta.data:`, 'color: orange', response.data);
          this.usuarioNomes = { ...this.usuarioNomes, [usuarioId]: 'Nome não encontrado' };
          this.userApiError = 'Nome de Usuário não encontrado na resposta da API';
        }
      } catch (error) {
        let errorMessage = 'Erro ao carregar nome';
        let status = '???';
        if (axios.isAxiosError(error)) {
          if (error.response) {
            status = error.response.status;
            errorMessage = `API Usuário (${status})`;
            console.error(`%c[DEBUG ReservasPage] ERRO AXIOS ao buscar nome do usuário ${usuarioId}: Status ${status}, Resposta de Erro:`, 'color: red', error.response.data);
          } else if (error.request) {
            errorMessage = 'API Usuário (rede)';
            console.error(`%c[DEBUG ReservasPage] ERRO de REDE ao buscar nome do usuário ${usuarioId}: Nenhuma resposta do servidor.`, 'color: red', error.message);
          }
        } else {
          errorMessage = 'API Usuário (desconhecido)';
          console.error(`%c[DEBUG ReservasPage] ERRO DESCONHECIDO ao buscar nome do usuário ${usuarioId}:`, 'color: red', error);
        }
        this.usuarioNomes = { ...this.usuarioNomes, [usuarioId]: errorMessage };
        this.userApiError = `Erro na API de Usuários: ${errorMessage}`; // Atualiza o erro da API de usuários
      } finally {
        console.log(`%c[DEBUG ReservasPage] === FIM DA BUSCA PARA ID: ${usuarioId} ===`, 'background: #222; color: #bada55');
      }
    },

    // Métodos para o modal (criar, editar, deletar)
    openCreateModal() {
      this.selectedReserva = null;
      this.isModalOpen = true;
    },
    handleOpenEditModal(reservaId) {
      // Usa reservasComNomes para garantir que o modal tenha o nome do usuário, se disponível
      this.selectedReserva = this.reservasComNomes.find((r) => r.id_reserva === reservaId);
      this.isModalOpen = !!this.selectedReserva;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedReserva = null;
      this.fetchReservas(); // Recarrega as reservas após fechar o modal para refletir as mudanças
    },
    async handleCreateReserva(newReservaData) {
      try {
        await reservationApi.post('/cadastrar', newReservaData);
        alert('Reserva criada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao criar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('[DEBUG ReservasPage] Erro ao criar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('[DEBUG ReservasPage] Erro ao criar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
    async handleUpdateReserva(updatedReservaData) {
      try {
        console.log(`[DEBUG ReservasPage] Tentando atualizar reserva #${updatedReservaData.id_reserva} com dados:`, updatedReservaData);
        await reservationApi.put(`/atualizar/${updatedReservaData.id_reserva}`, updatedReservaData);
        alert('Reserva atualizada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao atualizar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('[DEBUG ReservasPage] Erro ao atualizar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('[DEBUG ReservasPage] Erro ao atualizar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
    async handleDeleteReserva(reservaId) {
      if (!confirm('Tem certeza que deseja deletar esta reserva?')) {
        return;
      }
      try {
        await reservationApi.delete(`/deletar/${reservaId}`);
        alert('Reserva deletada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao deletar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('[DEBUG ReservasPage] Erro ao deletar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('[DEBUG ReservasPage] Erro ao deletar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
  },
};
</script>


<style scoped>
.reservas-page-container {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
}

.header-reserva {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.button-add-reserva {
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

.button-add-reserva:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: start;
}

.loading, .error-message, .no-reservations-message {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
}

.error-message {
  color: #d9534f; 
  font-weight: bold;
}

.no-reservations-message {
  color: #6c757d;
}
</style>