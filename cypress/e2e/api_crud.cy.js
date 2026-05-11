describe('EasyMarket Labs - Testes de API (Backend CRUD)', () => {
  const apiUrl = 'http://localhost:8080';
  const apiUser = `backend.qa${Math.floor(Math.random() * 10000)}`;
  const apiPass = 'SenhaSegura123!';
  
  let authToken = ''; 
  let taskId = ''; 

  it('1. [Setup] Criar usuário e 2. Login para pegar Token', () => {
    
    cy.request('POST', `${apiUrl}/user`, { username: apiUser, password: apiPass });
    

    cy.request('POST', `${apiUrl}/login`, { username: apiUser, password: apiPass }).then((res) => {
      authToken = res.headers['authorization'];
    });
  });

  it('3. [CRUD - POST] Criar tarefa e capturar ID do Header', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/task`,
      headers: { Authorization: authToken },
      body: { description: 'Missão QA Especialista', user: { id: 1 } } // Ajuste o ID do user se necessário
    }).then((response) => {
      expect(response.status).to.eq(201);
     
      const location = response.headers['location'];
      taskId = location.split('/').pop(); 
      cy.log('ID da tarefa criada: ' + taskId);
    });
  });

  it('4. [CRUD - PUT] Editar tarefa usando o ID na URL', () => {
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/task/${taskId}`, 
      headers: { Authorization: authToken },
      body: { description: 'Tarefa Editada pela Automação' }
    }).then((res) => {
      expect(res.status).to.eq(204); 
    });
  });

  it('5. [CRUD - DELETE] Deletar tarefa usando o ID na URL', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/task/${taskId}`, 
      headers: { Authorization: authToken }
    }).then((res) => {
      expect(res.status).to.eq(204); 
    });
  });
});