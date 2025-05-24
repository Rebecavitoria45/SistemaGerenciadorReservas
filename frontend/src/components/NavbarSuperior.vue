<template>
  <div class="dashboard-header">
    <div class="left-section">
      <h2 class="dashboard-title">Dashboard</h2>
      <span class="dashboard-date">18 de maio de 2025</span>
    </div>
    <div class="middle-section">
    </div>
    <div class="right-section">
      <div class="time">
        <i class="bi bi-clock"></i>
        <span>{{ currentTime }}</span>
      </div>
      <button class="icon-button" @click="toggleNotifications">
        <i class="bi bi-bell"></i>
      </button>
      <button class="icon-button" @click="toggleMessages">
        <i class="bi bi-envelope"></i>
      </button>
      <div class="user-info">
        <div class="user-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="user-details">
          <span class="user-name">Clodoaldo</span>
          <span class="user-role">Admin</span>
        </div>
      </div>
    </div>

    <InfoCard
      :is-visible="showNotifications"
      title="Notificações"
      :items="notifications"
      emptyMessage="Sem notificações no momento."
    >
      <template #default="{ item }">
        {{ item.message }}
      </template>
    </InfoCard>

    <InfoCard
      :is-visible="showMessages"
      title="Mensagens"
      :items="messages"
      emptyMessage="Sem mensagens no momento."
    >
      <template #default="{ item }">
        <strong>{{ item.sender }}:</strong> {{ item.content }}
      </template>
    </InfoCard>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import InfoCard from './InfoCard.vue';

export default {
  name: 'SimpleDashboardHeader',
  components: {
    InfoCard,
  },
  setup() {
    const currentTime = ref('');
    let intervalId;
    const showNotifications = ref(false);
    const showMessages = ref(false);
    const notifications = ref([]);
    const messages = ref([]);

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      currentTime.value = `${hours}:${minutes}:${seconds}`;
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showMessages.value = false;
    };

    const toggleMessages = () => {
      showMessages.value = !showMessages.value;
      showNotifications.value = false;
    };

    const handleClickOutside = (event) => {
      const notificationCard = document.querySelector('.info-card:first-of-type'); 
      const messageCard = document.querySelector('.info-card:last-of-type'); 
      const bellIcon = document.querySelector('.bi-bell').parentNode;
      const envelopeIcon = document.querySelector('.bi-envelope').parentNode;

      if (showNotifications.value && notificationCard && !notificationCard.contains(event.target) && event.target !== bellIcon) {
        showNotifications.value = false;
      }

      if (showMessages.value && messageCard && !messageCard.contains(event.target) && event.target !== envelopeIcon) {
        showMessages.value = false;
      }
    };

    onMounted(() => {
      updateTime();
      intervalId = setInterval(updateTime, 1000);
      document.addEventListener('click', handleClickOutside);

      setTimeout(() => {
        notifications.value = [
          { message: 'Novo usuário registrado!' },
          { message: 'Seu relatório semanal está pronto.' },
        ];
      }, 500);

      setTimeout(() => {
        messages.value = [
          { sender: 'Usuário 1', content: 'Olá, como você está?' },
          { sender: 'Admin', content: 'Reunião agendada para amanhã.' },
        ];
      }, 750);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
      document.removeEventListener('click', handleClickOutside);
    });

    return { currentTime, showNotifications, showMessages, toggleNotifications, toggleMessages, notifications, messages };
  },
};

</script>

  <style scoped>
.dashboard-header {
  background-color: #f8f9fa;
  padding: 0.8rem 2rem; 
  display: flex;
  align-items: center;
  justify-content: space-between; 
  border-bottom: 1px solid #eee;
}

.left-section {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 1.5rem;
  margin-bottom: 0.1rem;
  color: #333;
  font-weight: bold;
}

.dashboard-date {
  font-size: 0.85rem; 
  color: #777;
}

.middle-section {
  flex-grow: 1;
}

.right-section {
  display: flex;
  align-items: center;
}

.time {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: #555;
  font-size: 0.85rem; 
}

.time i {
  margin-right: 0.3rem;
  font-size: 1rem;
}

.icon-button {
  background: none;
  border: none;
  padding: 0.4rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 1rem; 
  color: #555;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 28px; 
  height: 28px;
  border-radius: 50%;
  background-color: #ddd; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
  color: #fff;
  font-size: 0.9rem;
}

.user-avatar i {
  font-size: 1.2rem; 
  color: #777;
}

.user-details {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem; 
  color: #333;
  text-align: right;
}

.user-name {
  font-weight: bold;
}
</style>

