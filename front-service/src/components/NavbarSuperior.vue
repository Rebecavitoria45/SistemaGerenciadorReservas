<template>
  <div v-if="isAdminOrUser" class="dashboard-header">
    <div class="left-section">
      <h2 class="dashboard-greeting">{{ greetingMessage }}, {{ userName }}</h2>
      <span class="dashboard-date">{{ formattedDate }}</span>
    </div>
    <div class="middle-section"></div>
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
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import InfoCard from './InfoCard.vue';

export default {
  name: 'NavbarSuperior',
  components: { InfoCard },
  props: {
    expanded: { type: Boolean, required: true },
  },
  setup() {
    const userRole = ref(localStorage.getItem('role') || 'guest');
    const userName = ref(localStorage.getItem('userName') || 'Usuário');

    const isAdminOrUser = computed(() => userRole.value === 'admin' || userRole.value === 'user');

    const currentTime = ref('');
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

    const getGreetingMessage = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Bom dia';
      else if (hour >= 12 && hour < 18) return 'Boa tarde';
      else return 'Boa noite';
    };

    const getFormattedDate = () => {
      const now = new Date();
      return now.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
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
      const bellIcon = document.querySelector('.bi-bell')?.parentNode;
      const envelopeIcon = document.querySelector('.bi-envelope')?.parentNode;

      if (
        showNotifications.value &&
        notificationCard &&
        !notificationCard.contains(event.target) &&
        event.target !== bellIcon
      ) {
        showNotifications.value = false;
      }

      if (
        showMessages.value &&
        messageCard &&
        !messageCard.contains(event.target) &&
        event.target !== envelopeIcon
      ) {
        showMessages.value = false;
      }
    };

    onMounted(() => {
      updateTime();
      setInterval(updateTime, 1000);
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
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      currentTime,
      userName,
      userRole,
      greetingMessage: computed(getGreetingMessage),
      formattedDate: computed(getFormattedDate),
      showNotifications,
      showMessages,
      toggleNotifications,
      toggleMessages,
      notifications,
      messages,
      isAdminOrUser,
    };
  },
};
</script>


<style scoped>
.dashboard-header {
  background-color: transparent; 
  padding: 1rem 1.5rem; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1000; 
}

.dashboard-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1.5rem; 
  right: 1.5rem; 
  height: 1px; 
  background-color: #e0e0e0; 
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05); 
}

.left-section {
  display: flex;
  flex-direction: column;
}

.dashboard-greeting {
  font-family: 'Poppins', sans-serif; 
  font-size: 1.7rem;
  margin-bottom: 0.2rem; 
  color: #333;
  font-weight: 600; 
}

.dashboard-date {
  font-family: 'Inter', sans-serif; 
  font-size: 0.95rem; 
  color: #777;
}

.middle-section {
  flex-grow: 1;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1.2rem; 
}

.time {
  display: flex;
  align-items: center;
  color: #555;
  font-size: 0.9rem; 
  font-family: 'Inter', sans-serif; 
}

.time i {
  margin-right: 0.4rem; 
  font-size: 1.1rem; 
}

.icon-button {
  background: none;
  border: none;
  padding: 0.6rem; 
  border-radius: 50%; 
  cursor: pointer;
  font-size: 1.1rem; 
  color: #555;
  transition: background-color 0.2s, color 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05); 
  color: #000;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 1rem; 
}

.user-avatar {
  width: 35px; 
  height: 35px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.7rem; 
  color: #fff;
  font-size: 1.1rem; 
}

.user-avatar i {
  font-size: 1.6rem;
  color: #777;
}

.user-details {
  display: flex;
  flex-direction: column;
  color: #333;
  text-align: right;
  font-family: 'Inter', sans-serif; 
}

.user-name {
  font-size: 0.95rem; 
  font-weight: 600; 
}

.user-role {
  font-size: 0.8rem; 
  color: #888;
}
</style>