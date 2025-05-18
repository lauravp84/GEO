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

// Carregar dados do aluno da planilha
async function loadStudentData(email, dre, turma) {
    try {
        // Em um ambiente real, isso seria feito pelo backend
        // Aqui estamos simulando para o protótipo
        
        // Simular requisição à API do Google Sheets
        showMessage('Carregando dados da Turma ' + turma + '...', 'info');
        
        // Em produção, isso seria substituído por uma chamada real à API
        const data = await fetchMockStudentData(email, dre, turma);
        
        if (!data) {
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
async function fetchMockStudentData(email, dre, turma) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dados de exemplo baseados na planilha compartilhada
    const mockDataTurmaA = [
        {
            email: 'vitxriaaquino@gmail.com',
            dre: '122047778',
            nome: 'AMANDA BLAJACKIS GAVIAO',
            presenca: 10,
            falta: 16,
            porcentagem: '38%',
            diasFalta: ['26/03', '02/04', '09/04', '16/04']
        },
        {
            email: 'andreluiz.detsi@gmail.com',
            dre: '120103073',
            nome: 'ANDRE LUIZ FERREIRA DETSI',
            presenca: 13,
            falta: 13,
            porcentagem: '50%',
            diasFalta: ['19/03', '26/03', '02/04']
        }
        // Mais dados seriam adicionados aqui
    ];
    
    const mockDataTurmaB = [
        {
            email: 'alicevhanna@gmail.com',
            dre: '123452641',
            nome: 'ALICE VIEIRA HANNA',
            presenca: 13,
            falta: 13,
            porcentagem: '50%',
            diasFalta: ['26/03', '02/04', '09/04']
        },
        {
            email: 'alines.silva2004.07@gmail.com',
            dre: '122134282',
            nome: 'ALINE DA SILVA E SILVA',
            presenca: 13,
            falta: 13,
            porcentagem: '50%',
            diasFalta: ['19/03', '26/03', '02/04']
        }
        // Mais dados seriam adicionados aqui
    ];
    
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
