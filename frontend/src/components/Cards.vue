<template>
  <div class="card" :class="cor">
    <div class="card-icon-wrapper">
      <slot name="icone"></slot>
    </div>
    <div class="card-info">
      <span class="card-value">{{ formatarContagem(valor) }}</span>
      <span class="card-label">{{ titulo }}</span>
      <span class="card-sublabel">{{ descricao }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardContador',
  props: {
    titulo: String,
    descricao: String,
    cor: String,
    valor: {
      type: [Number, String],
      default: 'Carregando...',
    },
  },
  data() {
    return {};
  },
  methods: {
    formatarContagem(value) {
      if (typeof value === 'number') {
        return value.toLocaleString('pt-BR');
      }
      return value;
    },
  },
};
</script>
<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(33.33% - 18px); 
  box-sizing: border-box;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* Cores de fundo mantidas */
.bg-lilac {
  background-color: #F3E8FF;
}
.bg-light-blue {
  background-color: #E0F2FE;
}
.bg-light-green {
  background-color: #D1FAE5;
}

.card-icon-wrapper {
  margin-bottom: 16px;
}

.card-icon {
  width: 36px;
  height: 36px;
  font-size: 24px;
}

/* Cores dos ícones mantidas */
.bg-lilac .card-icon {
  color: #7E22CE;
}
.bg-light-blue .card-icon {
  color: #0284C7;
}
.bg-light-green .card-icon {
  color: #059669;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-value {
  font-family: 'Poppins', sans-serif; /* APLICANDO POPEINS AQUI */
  font-size: 2.25rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.card-label {
  font-family: 'Inter', sans-serif; /* APLICANDO INTER AQUI */
  color: #4B5563;
  font-size: 0.9rem;
  margin-top: 4px;
  font-weight: 500;
}

.card-sublabel {
  font-family: 'Inter', sans-serif; /* APLICANDO INTER AQUI */
  color: #6B7280;
  font-size: 0.75rem;
  margin-top: 4px;
}

@media (max-width: 992px) {
  .card {
    width: calc(33.33% - 12px);
  }
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
</style>