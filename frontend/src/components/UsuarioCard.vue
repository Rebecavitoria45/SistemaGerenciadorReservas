<template>
  <div class="usuario-card" @click="emitOpenPopup">
    <div class="card-image-container">
      <img src="https://via.placeholder.com/200x150/F8F8F8/000000?text=Usuário" alt="Foto do Usuário" class="card-image">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ usuario.nome }}</h3>
      <p class="card-detail">Email: <strong>{{ usuario.email }}</strong></p>
      </div>
    <div class="card-actions">
      <button class="details-button">Ver Detalhes</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usuario: {
      type: Object,
      required: true,
      // Validador simples para ajudar a depurar (remova em produção se não quiser)
      validator: (value) => {
        if (!value.usuario_id || typeof value.nome !== 'string' || typeof value.email !== 'string') {
          console.error("Erro de validação em UsuarioCard: Prop 'usuario' não tem formato esperado.", value);
          return false;
        }
        return true;
      }
    },
  },
  methods: {
    emitOpenPopup() {
      // Usamos 'usuario_id' que é o nome da chave primária do seu backend
      this.$emit('open-popup', this.usuario.usuario_id);
    },
  },
};
</script>

<style scoped>
/* Seus estilos CSS originais (não alterados) */
.usuario-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-width: 250px;
  max-width: 350px;
  margin: auto;
}

.usuario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image-container {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 15px;
  flex-grow: 1;
}

.card-title {
  font-size: 1.4em;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-detail {
  font-size: 0.95em;
  color: #555;
  margin-bottom: 5px;
  line-height: 1.4;
}

.card-detail strong {
  color: #1a73e8;
}

.card-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: center;
}

.details-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
}

.details-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .usuario-card {
    max-width: none;
  }
}
</style>