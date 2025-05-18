// Configurações e variáveis globais
const API_KEY = 'AIzaSyCgoF4TTaF7Z5gVq3b5F9rCrDoZ_cf_Wck'; // Será preenchido pelo backend por segurança
let studentData = null;
let currentTurma = null;
let accessLog = [];

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Verificar se já existe uma sessão ativa
    checkSession();
    
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
});

// Verificar sessão existente
function checkSession() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        loadStudentData(user.email, user.dre);
    }
}

// Manipular login
async function handleLogin(e) {
    e.preventDefault();
    
    const turma = document.getElementById('turma').value;
    const email = document.getElementById('email').value.trim().toLowerCase();
    const dre = document.getElementById('dre').value.trim();
    
    if (!turma || !email || !dre) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        // Simular carregamento
        showMessage('Verificando credenciais...', 'info');
        
        // Salvar turma atual
        currentTurma = turma;
        
        // Carregar dados do aluno
        await loadStudentData(email, dre, turma);
        
    } catch (error) {
        console.error('Erro no login:', error);
        showMessage('Erro ao fazer login. Verifique suas credenciais.', 'error');
    }
}

/// Carregar dados do aluno da planilha via Google Apps Script
async function loadStudentData(email, dre, turma) {
    try {
        // Mostrar mensagem de carregamento
        showMessage('Carregando dados da Turma ' + turma + '...', 'info');
        
        // Selecionar o URL do script correto com base na turma
        const scriptUrl = turma === 'A' 
            ? 'https://script.google.com/macros/s/AKfycbzYNkwBnHs2y5NwjtKRn1QSvmuccojh66J3keYEAPxk6Y3EQ944lDmIJNaPS0GPiyWT/exec'
            : 'https://script.google.com/macros/s/AKfycbwJ1C-_oy3gafi-Epn9R-tn6XUVwf4NXqsAQ61XDytX3gL7foTocc2Dgl2avOn1vQ-etA/exec';
        
        // Construir a URL com parâmetros
        const url = `${scriptUrl}?email=${encodeURIComponent(email )}&dre=${encodeURIComponent(dre)}`;
        
        // Fazer a requisição
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data || data.error) {
            showMessage('Usuário não encontrado. Verifique suas credenciais e turma selecionada.', 'error');
            return;
        }
        
        // Armazenar dados do aluno
        studentData = data;
        
        // Salvar sessão
        localStorage.setItem('userData', JSON.stringify({
            email: email,
            dre: dre,
            turma: turma,
            timestamp: new Date().toISOString()
        }));
        
        // Registrar log de acesso
        logAccess(email, dre, turma, 'login');
        
        // Mostrar dashboard
        displayDashboard();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showMessage('Erro ao carregar dados. Tente novamente mais tarde.', 'error');
    }
}


// Função para simular busca de dados na planilha (em produção seria substituída pela API real)
async function fetchRealStudentData(email, dre, turma) {
  try {
    // Carregar a API do Google
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: CONFIG.discoveryDocs
    });
    
    // Selecionar a planilha correta
    const spreadsheetId = CONFIG.spreadsheets[turma].id;
    const range = CONFIG.spreadsheets[turma].range;
    
    // Fazer a requisição
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range
    });
    
    // Processar os dados
    const rows = response.result.values;
    if (!rows || rows.length === 0) {
      return null;
    }
    
    // Encontrar o aluno pelo email e DRE
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0].toLowerCase() === email.toLowerCase() && row[1] === dre) {
        return {
          email: row[0],
          dre: row[1],
          nome: row[2],
          presenca: row[3],
          falta: row[4],
          porcentagem: row[5],
          diasFalta: getDiasFalta(rows[0], row)
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao acessar a API:', error);
    return null;
  }
}

// Função auxiliar para extrair os dias com faltas
function getDiasFalta(headerRow, dataRow) {
  const diasFalta = [];
  
  // Começar a partir da coluna 6 (após email, dre, nome, presenca, falta, porcentagem)
  for (let i = 6; i < headerRow.length; i++) {
    // Se o valor for "F" ou similar, adicionar o dia à lista
    if (dataRow[i] === "F" || dataRow[i] === "f") {
      diasFalta.push(headerRow[i]);
    }
  }
  
  return diasFalta;
}

    
    // Selecionar dados da turma correta
    const mockData = turma === 'A' ? mockDataTurmaA : mockDataTurmaB;
    
    // Buscar aluno por email e DRE
    return mockData.find(student => 
        student.email.toLowerCase() === email.toLowerCase() && 
        student.dre === dre
    );
}

// Exibir dashboard com dados do aluno
function displayDashboard() {
    // Atualizar elementos do DOM
    document.getElementById('student-name').textContent = studentData.nome;
    document.getElementById('student-dre').textContent = studentData.dre;
    document.getElementById('student-turma').textContent = 'Turma ' + currentTurma;
    document.getElementById('presence-count').textContent = studentData.presenca;
    document.getElementById('absence-count').textContent = studentData.falta;
    document.getElementById('percentage').textContent = studentData.porcentagem;
    
    // Exibir dias com faltas
    const absenceDaysContainer = document.getElementById('absence-days');
    if (studentData.diasFalta && studentData.diasFalta.length > 0) {
        absenceDaysContainer.innerHTML = studentData.diasFalta.map(day => 
            `<span class="absence-day">${day}</span>`
        ).join('');
    } else {
        absenceDaysContainer.innerHTML = '<p>Nenhuma falta registrada.</p>';
    }
    
    // Configurar botão do ChatVolt
    const chatBtn = document.getElementById('chat-btn');
    const chatVoltContainer = document.getElementById('chatvolt-container');
    
    chatBtn.addEventListener('click', function() {
        if (chatVoltContainer.style.display === 'none') {
            chatVoltContainer.style.display = 'block';
            chatBtn.textContent = 'Fechar Assistente GEO';
        } else {
            chatVoltContainer.style.display = 'none';
            chatBtn.textContent = 'Abrir Assistente GEO';
        }
    });
    
    // Mostrar dashboard e esconder login
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';
}

// Manipular logout
function handleLogout() {
    // Registrar log de saída
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        logAccess(userData.email, userData.dre, 'logout');
    }
    
    // Limpar dados
    localStorage.removeItem('userData');
    studentData = null;
    
    // Mostrar login e esconder dashboard
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('dashboard-container').style.display = 'none';
    
    // Limpar campos do formulário
    document.getElementById('email').value = '';
    document.getElementById('dre').value = '';
}

// Registrar log de acesso
function logAccess(email, dre, action) {
    const logEntry = {
        email: email,
        dre: dre,
        action: action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: '0.0.0.0' // Em produção, isso seria capturado pelo backend
    };
    
    accessLog.push(logEntry);
    console.log('Log de acesso:', logEntry);
    
    // Em produção, isso seria enviado para um servidor
    // sendLogToServer(logEntry);
}

// Exibir mensagens para o usuário
function showMessage(message, type = 'info') {
    // Implementação simples para o protótipo
    alert(message);
}

// Em produção, esta função seria implementada para integração real com a API do Google Sheets
async function fetchRealStudentData(email, dre) {
    // Código para integração real com a API do Google Sheets
    // Utilizaria gapi.client.sheets.spreadsheets.values.get
}

// Em produção, esta função enviaria logs para o servidor
function sendLogToServer(logEntry) {
    // Código para enviar logs para o servidor
}
