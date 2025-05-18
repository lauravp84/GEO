// Configuração para integração com Google Sheets API
const CONFIG = {
  apiKey: null, // Será configurado pelo backend
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheets: {
    'A': {
      id: '1FMfODcwGWbgJ0fShxShQXuwn9Mh2Dp6hIew-m-MbKX8',
      range: 'dados!A:G'
    },
    'B': {
      id: '1OImUydEbWHfatg6tn9TChuosU_yw-JyjKUCojys-ISY',
      range: 'dados!A:G'
    }
  }
};

// Classe para gerenciar a integração com Google Sheets
class GoogleSheetsManager {
  constructor() {
    this.isLoaded = false;
    this.data = null;
  }

  // Inicializar a API do Google Sheets
  async init(apiKey) {
    try {
      CONFIG.apiKey = apiKey;
      
      // Em um ambiente real, carregaríamos a API do Google aqui
      console.log('Google Sheets API inicializada');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar Google Sheets API:', error);
      return false;
    }
  }

  // Carregar dados da planilha
  async loadSheetData() {
    try {
      // Em um ambiente real, isso faria uma chamada à API
      // Por enquanto, usamos dados simulados
      console.log('Carregando dados da planilha...');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.data = this.getMockData();
      this.isLoaded = true;
      
      console.log('Dados carregados com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao carregar dados da planilha:', error);
      return false;
    }
  }

  // Buscar dados de um aluno específico
  getStudentData(email, dre) {
    if (!this.isLoaded) {
      throw new Error('Dados não carregados');
    }
    
    // Buscar aluno por email e DRE
    const student = this.data.find(s => 
      s.email.toLowerCase() === email.toLowerCase() && 
      s.dre === dre
    );
    
    return student;
  }

  // Dados simulados para o protótipo
  getMockData() {
    return [
      {
        email: 'vitxriaaquino@gmail.com',
        dre: '122047778',
        nome: 'AMANDA BLAJACKIS GAVIAO',
        presenca: 10,
        falta: 16,
        porcentagem: '38%',
        diasFalta: ['26/03', '02/04', '09/04', '16/04', '23/04', '30/04']
      },
      {
        email: 'andreluiz.detsi@gmail.com',
        dre: '120103073',
        nome: 'ANDRE LUIZ FERREIRA DETSI',
        presenca: 13,
        falta: 13,
        porcentagem: '50%',
        diasFalta: ['19/03', '26/03', '02/04', '09/04']
      },
      {
        email: 'carolrohrsufrj@gmail.com',
        dre: '121062474',
        nome: 'ANNA CAROLINA ROHRS GUIMARAES',
        presenca: 12,
        falta: 14,
        porcentagem: '46%',
        diasFalta: ['12/03', '19/03', '26/03', '02/04']
      },
      {
        email: 'franciscojunior345f@gmail.com',
        dre: '122126637',
        nome: 'FERNANDO FRANCISCO DE ALMEIDA JUNIOR',
        presenca: 12,
        falta: 14,
        porcentagem: '46%',
        diasFalta: ['05/03', '12/03', '19/03', '26/03']
      }
    ];
  }
}

// Exportar a classe para uso no aplicativo
window.GoogleSheetsManager = GoogleSheetsManager;
