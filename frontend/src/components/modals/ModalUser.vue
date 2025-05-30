<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Editar Usuário #{{ currentUser.usuario_id }}</h3>
          <button class="modal-close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit()" class="modal-form">
            <div class="form-group" v-for="(label, field) in fieldLabels" :key="field">
              <label :for="field">{{ label }}</label>
              <input
                v-if="field === 'usuario_id'"
                type="number"
                :id="field"
                v-model.number="currentUser[field]"
                disabled
              />
              <input
                v-else-if="field === 'nome'"
                type="text"
                :id="field"
                v-model="currentUser[field]"
                required
              />
              <input
                v-else-if="field === 'email'"
                type="email"
                :id="field"
                v-model="currentUser[field]"
                required
              />
            </div>

            <div class="modal-actions">
              <button type="submit" class="button-submit">
                Salvar Alterações
              </button>
              <button type="button" @click="closeModal" class="button-cancel">Cancelar</button>
              <button
                type="button"
                @click="handleDelete"
                class="button-delete"
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
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3004',
});

export default {
  name: 'UserModal',
  props: {
    isVisible: Boolean,
    userToEdit: Object,
  },
  data() {
    return {
      currentUser: {
        usuario_id: null, 
        nome: '',
        email: '',
      },
      fieldLabels: {
        usuario_id: 'ID do Usuário',
        nome: 'Nome',
        email: 'Email',
      },
    };
  },
  watch: {
  isVisible(newVal) {
    if (newVal && this.userToEdit) {
      console.log('Modal visível, userToEdit recebido:', this.userToEdit); // Adicione esta linha
      this.currentUser = { ...this.userToEdit };
      console.log('currentUser após cópia:', this.currentUser); // Adicione esta linha
    } else if (!newVal) {
      this.resetForm();
    }
  },
  userToEdit: {
    handler(newVal) {
      if (this.isVisible && newVal) {
        console.log('Watcher userToEdit disparado, newVal:', newVal); 
        this.currentUser = { ...newVal };
        console.log('currentUser após watcher userToEdit:', this.currentUser); 
      }
    },
    deep: true,
    immediate: true,
  },
},
  methods: {
    resetForm() {
      this.currentUser = {
        usuario_id: null,
        nome: '',
        email: '',
      };
    },
    async handleSubmit() {
      try {
        await api.put(`/atualizar/${this.currentUser.usuario_id}`, this.currentUser);
        alert('Usuário atualizado com sucesso!');
        this.closeModal();
      } catch (error) {
        console.error('Erro ao salvar o usuário:', error.response ? error.response.data : error.message);
        alert('Erro ao salvar o usuário. Verifique o console do navegador para mais detalhes.');
      }
    },
    async handleDelete() {
      if (confirm(`Tem certeza que deseja excluir o usuário #${this.currentUser.usuario_id} - ${this.currentUser.nome}?`)) {
        try {
          await api.delete(`/deletar/${this.currentUser.usuario_id}`);
          alert('Usuário excluído com sucesso!');
          this.closeModal();
        } catch (error) {
          console.error('Erro ao excluir o usuário:', error.response ? error.response.data : error.message);
          alert('Erro ao excluir o usuário. Verifique o console do navegador para mais detalhes.');
        }
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

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
}

.form-group input:focus, .form-group select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button-submit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.button-submit:hover {
  background-color: #0056b3;
}

.button-cancel {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.button-cancel:hover {
  background-color: #5a6268;
}

.button-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.button-delete:hover {
  background-color: #c82333;
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