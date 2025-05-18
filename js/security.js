// Classe para gerenciar a segurança e privacidade dos dados
class SecurityManager {
  constructor() {
    this.logs = [];
    this.activeUsers = {};
  }

  // Validar credenciais do usuário
  validateCredentials(email, dre) {
    if (!email || !dre) {
      return false;
    }
    
    // Validação básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dreRegex = /^\d{8,9}$/;
    
    return emailRegex.test(email) && dreRegex.test(dre);
  }

  // Registrar tentativa de login
  logLoginAttempt(email, dre, success) {
    const logEntry = {
      type: 'login_attempt',
      email: this.maskEmail(email),
      dre: this.maskDRE(dre),
      success: success,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipAddress: '0.0.0.0', // Em produção, seria capturado pelo backend
    };
    
    this.logs.push(logEntry);
    console.log('Log de segurança:', logEntry);
    
    // Em produção, enviaria para o servidor
    return logEntry;
  }

  // Registrar acesso a dados
  logDataAccess(email, dre, dataType) {
    const logEntry = {
      type: 'data_access',
      email: this.maskEmail(email),
      dre: this.maskDRE(dre),
      dataType: dataType,
      timestamp: new Date().toISOString(),
    };
    
    this.logs.push(logEntry);
    console.log('Log de acesso a dados:', logEntry);
    
    // Em produção, enviaria para o servidor
    return logEntry;
  }

  // Mascarar email para logs (privacidade)
  maskEmail(email) {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    
    const name = parts[0];
    const domain = parts[1];
    
    // Mostrar apenas os primeiros 2 caracteres e os últimos 2
    const maskedName = name.length <= 4 
      ? name.charAt(0) + '*'.repeat(name.length - 1)
      : name.substring(0, 2) + '*'.repeat(name.length - 4) + name.substring(name.length - 2);
    
    return `${maskedName}@${domain}`;
  }

  // Mascarar DRE para logs (privacidade)
  maskDRE(dre) {
    if (!dre) return '';
    
    // Mostrar apenas os primeiros 2 e últimos 2 dígitos
    return dre.length <= 4
      ? dre.charAt(0) + '*'.repeat(dre.length - 1)
      : dre.substring(0, 2) + '*'.repeat(dre.length - 4) + dre.substring(dre.length - 2);
  }

  // Verificar se o usuário tem permissão para acessar os dados
  checkPermission(requestEmail, requestDRE, targetEmail, targetDRE) {
    // Política de privacidade: um aluno só pode ver seus próprios dados
    return requestEmail.toLowerCase() === targetEmail.toLowerCase() && 
           requestDRE === targetDRE;
  }

  // Registrar sessão ativa
  registerActiveSession(email, dre) {
    const sessionId = this.generateSessionId();
    
    this.activeUsers[sessionId] = {
      email: email,
      dre: dre,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    return sessionId;
  }

  // Atualizar atividade da sessão
  updateSessionActivity(sessionId) {
    if (this.activeUsers[sessionId]) {
      this.activeUsers[sessionId].lastActivity = new Date().toISOString();
    }
  }

  // Encerrar sessão
  terminateSession(sessionId) {
    if (this.activeUsers[sessionId]) {
      const session = this.activeUsers[sessionId];
      
      // Registrar logout
      this.logLoginAttempt(session.email, session.dre, 'logout');
      
      // Remover sessão
      delete this.activeUsers[sessionId];
      return true;
    }
    return false;
  }

  // Gerar ID de sessão único
  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Exportar logs (para administradores)
  exportLogs() {
    return JSON.stringify(this.logs);
  }
}

// Exportar a classe para uso no aplicativo
window.SecurityManager = SecurityManager;
