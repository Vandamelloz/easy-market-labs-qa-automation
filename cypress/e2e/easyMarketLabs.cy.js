describe('EasyMarket Labs - Missão QA Automation', () => {
  const baseUrl = 'http://127.0.0.1:5500/view'; 
  const randomUser = `qa.specialist${Math.floor(Math.random() * 10000)}`; 
  const userPass = 'SenhaForte123!';

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('[Positivo] Deve realizar o cadastro de um novo usuário com sucesso', () => {
    // Acessa a tela de Login
    cy.visit(`${baseUrl}/login.html`);
    cy.contains('Sign Up').click();

    cy.get('#username').type(randomUser);
    cy.get('#password').type(userPass);

    cy.get('#requestBtn').click(); 

    cy.get('#okToast').should('be.visible')
      .and('contain', 'Successfully registered user');
  });
//Teste de "Bug Simulado"

  it('[Positivo] Deve realizar o login com sucesso', () => {
    cy.visit(`${baseUrl}/login.html`);
    cy.get('#username').type(randomUser);
    cy.get('#password').type(userPass);
    
    cy.contains('button', 'Login').click(); 

    cy.get('#okToast').should('be.visible')
      .and('contain', 'Successfully login');
    cy.contains('Suas tarefas').should('be.visible');
  });
  it('[Bug Simulado] Deve tentar criar uma tarefa e falhar por falta de interface', () => {
    // 1. O robô faz o login
    cy.visit(`${baseUrl}/login.html`);
    cy.get('#username').type(randomUser);
    cy.get('#password').type(userPass);
    cy.contains('button', 'Login').click(); 
    // 2. Confirma que chegou na tela de tarefas
    cy.contains('Suas tarefas').should('be.visible');
    // 3. O robô procura o campo para digitar a tarefa e o botão de salvar
    cy.get('#nova_tarefa', { timeout: 4000 }).should('exist');
    cy.contains('button', 'Adicionar').should('be.visible');
  });
//Teste Negativo- Senha Incorreta 
it('[Negativo] Deve impedir o login com credenciais incorretas', () => {
    cy.visit(`${baseUrl}/login.html`);

    // Usamos um usuário que não existe ou senha errada
    cy.get('#username').type('hacker_qa');
    cy.get('#password').type('senha_inválida');
    
    cy.contains('button', 'Login').click(); 

    // A Evidência: O robô verifica se a URL NÃO mudou para a tela de tarefas
    cy.url().should('include', 'login.html');
    cy.get('#okToast').should('not.be.visible');
  });
//O Teste de Borda (Campos Vazios / Validação HTML)
it('[Borda] Deve bloquear cadastro se os campos obrigatórios estiverem vazios', () => {
    cy.visit(`${baseUrl}/signup.html`);
    cy.get('#requestBtn').click();
    cy.get('#username').invoke('prop', 'validationMessage').should('not.be.empty');
    cy.get('#okToast').should('not.be.visible');
  });

});