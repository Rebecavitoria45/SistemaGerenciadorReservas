<template>
  <div class="usuario-card" @click="emitOpenPopup">
    <div class="card-header">
      <h3>Usuário #{{ usuario.usuario_id }}</h3>
      </div>
    <div class="card-body">
      <p><i class="bi bi-person"></i> <strong>Nome:</strong> {{ usuario.nome }}</p>
      <p><i class="bi bi-envelope"></i> <strong>Email:</strong> {{ usuario.email }}</p>
      </div>
    <div class="card-footer">
      <button @click.stop="emitOpenPopup">Ver Detalhes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuarioCard',
  props: {
    usuario: {
      type: Object,
      required: true,
      validator: (value) => {
        const requiredProps = ['usuario_id', 'nome', 'email'];
        return requiredProps.every(prop => value.hasOwnProperty(prop));
      }
    },
  },
  methods: {
    emitOpenPopup() {
      this.$emit('open-popup', this.usuario.usuario_id);
    },
  },
};
</script>

<style scoped>
.usuario-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 280px;
  max-width: 320px;
  margin: 10px;
}

.usuario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  margin: 0;
  font-size: 1.3em;
}

.card-header .status {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.2);
}

.card-header .status.ativo {
  background-color: #28a745;
}

.card-header .status.inativo {
  background-color: #dc3545;
}

.card-body {
  padding: 20px;
  flex-grow: 1;
}

.card-body p {
  margin: 8px 0;
  font-size: 0.95em;
  color: #333;
  display: flex;
  align-items: center;
}

.card-body p i { 
  margin-right: 10px;
  color: #6c757d;
  width: 18px;
  text-align: center;
}

.card-body p strong {
  color: #2c3e50;
  font-weight: 600;
}

.card-footer {
  padding: 15px;
  background-color: #f8f8f8;
  border-top: 1px solid #eee;
  text-align: right;
}

.card-footer button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.card-footer button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .usuario-card {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>