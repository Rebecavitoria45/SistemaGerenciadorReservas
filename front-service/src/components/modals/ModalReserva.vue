<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>
            {{ isEditing ? `Editar Reserva #${currentReserva.id_reserva}` : 'Criar Nova Reserva' }}
          </h3>
          <button class="modal-close-button" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit()" class="modal-form">

            <div class="form-group" v-if="!modoUsuario">
              <label for="usuario_id">Usuário</label>
              <select
                id="usuario_id"
                v-model="currentReserva.usuario_id"
                class="form-select"
                required
              >
                <option :value="null" disabled>Selecione um usuário</option>
                <option v-if="loadingUsers" :value="null" disabled>Carregando usuários...</option>
                <option v-for="user in users" :key="user.usuario_id" :value="user.usuario_id">
                  {{ user.nome }} (ID: {{ user.usuario_id }})
                </option>
              </select>
            </div>

            <div class="form-group" v-if="!modoUsuario">
              <label>Nome do Usuário</label>
              <input
                type="text"
                :value="userNameComputed || 'Selecione acima'"
                disabled
                class="form-control disabled-input" />
            </div>

            <div class="form-group">
              <label for="numero_quarto">Número do Quarto</label>
              <select
                id="numero_quarto"
                v-model="currentReserva.numero_quarto"
                class="form-select"
                :disabled="modoUsuario"
                required
              >
                <option :value="null" disabled>Selecione um quarto</option>
                <option v-if="loadingQuartos" :value="null" disabled>Carregando quartos...</option>
                <option
                  v-for="quarto in availableQuartos"
                  :key="quarto.numero_quarto"
                  :value="quarto.numero_quarto"
                >
                  Quarto {{ quarto.numero_quarto }} (Tipo: {{ quarto.tipo || 'N/A' }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Tipo do Quarto</label>
              <input
                type="text"
                :value="quartoTipoComputed || 'Selecione acima'"
                disabled
                class="form-control disabled-input" />
            </div>

            <div class="form-group" v-for="(label, field) in filteredFieldLabels" :key="field">
              <label :for="field">{{ label }}</label>
              <input
                v-if="field.includes('data') || field.includes('check')"
                type="date"
                :id="field"
                v-model="currentReserva[field]"
                class="form-control"
                required
              />
              <input
                v-else
                type="number"
                :id="field"
                v-model.number="currentReserva[field]"
                :min="field === 'numero_pessoas' ? 1 : null"
                class="form-control"
                required
              />
            </div>

            <!-- Botões -->
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'Salvar Alterações' : 'Criar Reserva' }}
              </button>
              <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>

              <button
                v-if="isEditing && !modoUsuario"
                type="button"
                @click="handleDelete"
                class="btn btn-danger"
              >
                Deletar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { userApi, roomsApi } from '../../utils/axios';

export default {
  name: 'ReservaModal',
  props: {
    isVisible: Boolean,
    reservaToEdit: Object,
    modoUsuario: Boolean, 
  },
  emits: ['close', 'createReserva', 'updateReserva', 'deleteReserva'],
  data() {
    return {
      currentReserva: {
        usuario_id: null,
        numero_quarto: null,
        data_reserva: '',
        check_in: '',
        check_out: '',
        numero_pessoas: 1,
      },
      isEditing: false,
      users: [],
      loadingUsers: false,
      quartos: [],
      loadingQuartos: false,
      fieldLabels: {
        data_reserva: 'Data da Reserva',
        check_in: 'Check-in',
        check_out: 'Check-out',
        numero_pessoas: 'Número de Pessoas',
      },
    };
  },
  computed: {
    filteredFieldLabels() {
      return this.fieldLabels;
    },
    availableQuartos() {
      if (this.isEditing) {
        const atual = this.quartos.find(q => q.numero_quarto === this.reservaToEdit?.numero_quarto);
        const disponiveis = this.quartos.filter(q => q.disponivel || q.numero_quarto === atual?.numero_quarto);
        return disponiveis.sort((a, b) => a.numero_quarto - b.numero_quarto);
      } else {
        return this.quartos.filter(q => q.disponivel);
      }
    },
    userNameComputed() {
      if (this.currentReserva.usuario_id !== null) {
        const selected = this.users.find(u => Number(u.usuario_id) === Number(this.currentReserva.usuario_id));
        return selected ? selected.nome : 'Usuário não encontrado';
      }
      return '';
    },
    quartoTipoComputed() {
      const q = this.quartos.find(q => Number(q.numero_quarto) === Number(this.currentReserva.numero_quarto));
      return q ? q.tipo : '';
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.initializeModalData();
      }
    },
  },
  methods: {
    async initializeModalData() {
      this.resetForm();
      this.currentReserva.data_reserva = this.formatDateForInput(new Date());
      await Promise.all([this.fetchQuartos(), this.modoUsuario ? null : this.fetchUsers()]);

      if (this.reservaToEdit) {
        this.isEditing = true;
        this.currentReserva = {
  ...this.reservaToEdit,
  usuario_id: this.modoUsuario
    ? parseInt(localStorage.getItem('userId'))
    : Number(this.reservaToEdit.usuario_id),
  numero_quarto: Number(this.reservaToEdit.numero_quarto),
  data_reserva: this.formatDateForInput(this.reservaToEdit.data_reserva),
  check_in: this.formatDateForInput(this.reservaToEdit.check_in),
  check_out: this.formatDateForInput(this.reservaToEdit.check_out),
  numero_pessoas: Number(this.reservaToEdit.numero_pessoas),
};

      }
    },
    async fetchUsers() {
      this.loadingUsers = true;
      try {
        const res = await userApi.get('/listar');
        this.users = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        console.error('Erro ao buscar usuários:', e);
        this.users = [];
      } finally {
        this.loadingUsers = false;
      }
    },
    async fetchQuartos() {
      this.loadingQuartos = true;
      try {
        const res = await roomsApi.get('/listar');
        this.quartos = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        console.error('Erro ao buscar quartos:', e);
        this.quartos = [];
      } finally {
        this.loadingQuartos = false;
      }
    },
    formatDateForInput(dateStr) {
      if (!dateStr) return '';
      if (typeof dateStr === 'string' && dateStr.includes('T')) return dateStr.split('T')[0];
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    },
    resetForm() {
  this.currentReserva = {
    usuario_id: this.modoUsuario
      ? parseInt(localStorage.getItem('userId'))
      : null,
    numero_quarto: this.reservaToEdit?.numero_quarto ?? null,
    data_reserva: this.formatDateForInput(new Date()),
    check_in: '',
    check_out: '',
    numero_pessoas: 1,
  };
  this.isEditing = false;
},
    handleSubmit() {
      const r = { ...this.currentReserva };
      if (!r.usuario_id || !r.numero_quarto || !r.data_reserva || !r.check_in || !r.check_out) {
        return alert('Preencha todos os campos obrigatórios.');
      }

      const checkIn = new Date(r.check_in + 'T00:00:00');
      const checkOut = new Date(r.check_out + 'T00:00:00');
      const hoje = new Date(this.formatDateForInput(new Date()) + 'T00:00:00');

      if (checkIn > checkOut) return alert('Check-out não pode ser antes do check-in.');
      if (!this.isEditing && checkIn < hoje) return alert('Check-in não pode ser no passado.');

      if (this.isEditing) {
        this.$emit('updateReserva', r);
      } else {
        this.$emit('createReserva', r);
      }
    },
    handleDelete() {
      if (confirm(`Deseja excluir a reserva #${this.currentReserva.id_reserva}?`)) {
        this.$emit('deleteReserva', this.currentReserva.id_reserva);
      }
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
  width: 600px;
  position: relative;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close-button:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #555;
}

.form-control, .form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  box-sizing: border-box;
  font-size: 1rem;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.disabled-input {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}
.btn-primary:hover {
  background-color: #0a58ca;
  border-color: #0a53be;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}
.btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}
.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(-20px);
}
</style>