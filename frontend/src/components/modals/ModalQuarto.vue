<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Editar Quarto Nº: ' + currentQuarto.numero_quarto : 'Adicionar Novo Quarto' }}</h3>
          <button class="modal-close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit()" class="modal-form">
            <div class="form-group">
              <label for="numero_quarto">Número do Quarto</label>
              <input
                type="number"
                id="numero_quarto"
                v-model.number="currentQuarto.numero_quarto"
                :disabled="isEditing"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="tipo">Tipo de Quarto</label>
              <input
                type="text"
                id="tipo"
                v-model="currentQuarto.tipo"
                required
              />
            </div>

            <div class="form-group">
              <label for="preco">Preço</label>
              <input type="number" id="preco" v-model.number="currentQuarto.preco" step="0.01" required />
            </div>
            <div class="form-group">
              <label for="capacidade">Capacidade</label>
              <input type="number" id="capacidade" v-model.number="currentQuarto.capacidade" required />
            </div>
            

            <div class="modal-actions">
              <button type="submit" class="button-submit">
                {{ isEditing ? 'Salvar Alterações' : 'Criar Quarto' }}
              </button>
              <button type="button" @click="closeModal" class="button-cancel">Cancelar</button>
              <button
                v-if="isEditing" type="button"
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

export default {
  name: 'ModalQuarto', 
  props: {
    isVisible: Boolean,
    quartoToEdit: Object, 
  },
  emits: ['close', 'createQuarto', 'updateQuarto', 'deleteQuarto'],
  data() {
    return {
      currentQuarto: {
        numero_quarto: null,
        tipo: '', 
        preco: 0.00,
        disponivel: true,
        capacidade: 1,
      },
      isEditing: false, 
    };
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        if (this.quartoToEdit) { 
          this.isEditing = true;
          this.currentQuarto = { ...this.quartoToEdit }; 
        } else { 
          this.isEditing = false;
          this.currentQuarto = { 
            numero_quarto: null,
            tipo: '',
            preco: 0.00,
            disponivel: true,
            capacidade: 1,
          };
        }
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    handleSubmit() {
      if (this.isEditing) {
        this.$emit('updateQuarto', this.currentQuarto); 
      } else {
        this.$emit('createQuarto', this.currentQuarto);
      }
      this.closeModal(); 
    },

    handleDelete() {
      if (confirm(`Tem certeza que deseja deletar o quarto #${this.currentQuarto.numero_quarto}?`)) {
        this.$emit('deleteQuarto', this.currentQuarto.numero_quarto); 
        this.closeModal();
      }
    },

    handleKeydown(event) {
      if (event.key === 'Escape') this.closeModal();
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
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

/* Transições */
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