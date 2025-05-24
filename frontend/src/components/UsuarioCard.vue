<template>
  <div class="user-card" @click="$emit('open-popup', user.id)">
    <h3>{{ user.nome }}</h3>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Status:</strong>
      <span :class="statusClass(user.status)">{{ user.status }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    statusClass(status) {
      return {
        ativo: 'status-ativo',
        inativo: 'status-inativo',
      }[status] || '';
    },
  },
};
</script>

<style scoped>
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}

.status-ativo {
  color: green;
}

.status-inativo {
  color: red;
}
</style>
