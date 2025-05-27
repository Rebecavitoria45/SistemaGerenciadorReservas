<template>
  <div class="sobre-container">
    <h1>Sobre o Sistema</h1>

    <section class="descricao">
      <p>
        Bem-vindo ao <strong>Sistema de Gestão de Reservas</strong> — uma solução completa, moderna e intuitiva para administrar a ocupação de quartos em estabelecimentos como pousadas, hotéis, repúblicas ou condomínios. Criado com foco na praticidade e eficiência, este sistema foi desenvolvido para facilitar o dia a dia de administradores, recepcionistas e usuários que desejam realizar reservas com segurança e transparência.
      </p>
      <p>
        O sistema permite o <strong>gerenciamento completo de reservas</strong>, controle de <strong>usuários</strong>, visualização dos <strong>quartos disponíveis</strong> com informações detalhadas, e funcionalidades essenciais como login, cadastro, recuperação de senha e muito mais.
      </p>
    </section>

    <section class="valores">
      <h2>O que nos motiva</h2>
      <ul>
        <li><strong>Organização:</strong> todas as informações centralizadas e acessíveis com poucos cliques.</li>
        <li><strong>Praticidade:</strong> interface limpa, responsiva e fácil de usar.</li>
        <li><strong>Segurança:</strong> autenticação de usuários e controle de acesso às funcionalidades.</li>
        <li><strong>Escalabilidade:</strong> pensado para evoluir com novas funcionalidades conforme a necessidade do negócio.</li>
      </ul>
    </section>


    <section class="visao">
      <h2>Nosso propósito</h2>
      <p>
        Este projeto nasceu com o propósito de resolver problemas reais de gestão e reservas em ambientes compartilhados. Acreditamos que a tecnologia pode transformar a forma como espaços são administrados, tornando a comunicação mais clara, as tarefas mais simples e a experiência de todos os usuários mais positiva.
      </p>
    </section>
  </div>
</template>

<style scoped>
.sobre-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  text-align: center;
  font-size: 2.8em;
  color: #2c3e50;
}

section {
  background-color: #f9f9f9;
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

h2 {
  font-size: 1.6em;
  color: #1a73e8;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1em;
  line-height: 1.7;
  color: #444;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  padding: 0.5rem 0;
  font-size: 1.1em;
}

ul li strong {
  color: #4CAF50;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2em;
  }

  section {
    padding: 1.4rem;
  }
}
</style>
