import type { ReactElement, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PasswordField } from './PasswordField';

interface CadastroFormProps {
  formData: {
    cadastroNomeCompleto: string;
    cadastroCpf: string;
    dataNascimento: string;
    cadastroEmail: string;
    cadastroTelefone: string;
    cadastroSenha: string;
    confirmarSenha: string;
  };
  errors: {[key: string]: string};
  statusMessage: { message: string; type: 'success' | 'error' | 'info' } | null;
  showPasswords: {[key: string]: boolean};
  cadastroSucesso: boolean;
  onInputChange: (field: string, value: string) => void;
  onTogglePassword: (field: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFormChange: (form: 'login' | 'cadastro') => void;
}

export const CadastroForm = ({
  formData,
  errors,
  statusMessage,
  showPasswords,
  cadastroSucesso,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onFormChange
}: CadastroFormProps): ReactElement => {
  // Renderizar a tela de sucesso quando cadastroSucesso === true
  if (cadastroSucesso) {
    return (
      <section>
        <div className="auth-card text-center">
          <img src="https://static.vecteezy.com/system/resources/thumbnails/069/462/938/small/white-check-mark-on-green-label-icon-png.png" alt="Sucesso" className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Cadastro realizado!</h2>
          <p className="auth-subtitle">Sua conta foi criada. Agora você já pode acessar a plataforma.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={() => onFormChange('login')} className="btn btn-primary w-full">
              Fazer login
            </button>
            <Link to="/" className="btn btn-secondary w-full">Voltar à página inicial</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="auth-card">
        <button type="button" onClick={() => onFormChange('login')} className="back-link bg-transparent border-none p-0 cursor-pointer">
          ← Voltar para login
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Criar uma conta</h2>
        <p className="auth-subtitle">Preencha o formulário abaixo para se cadastrar.</p>

        <form onSubmit={onSubmit}>
          <h3 className="form-step-title">Informações Pessoais</h3>
          <div className="form-group-auth">
            <label htmlFor="cadastroNomeCompleto">Nome completo*</label>
            <input id="cadastroNomeCompleto" className={`form-input ${errors.cadastroNomeCompleto ? 'border-red-500' : ''}`} type="text" value={formData.cadastroNomeCompleto}
              onChange={(e) => onInputChange('cadastroNomeCompleto', e.target.value)} required />
            {errors.cadastroNomeCompleto && <small className="error-message text-red-500">{errors.cadastroNomeCompleto}</small>}
          </div>
          <div className="form-group-auth">
            <label htmlFor="cadastroCpf">CPF*</label>
            <input id="cadastroCpf" className={`form-input ${errors.cadastroCpf ? 'border-red-500' : ''}`} type="text" value={formData.cadastroCpf}
              onChange={(e) => onInputChange('cadastroCpf', e.target.value)} required />
            {errors.cadastroCpf && <small className="error-message text-red-500">{errors.cadastroCpf}</small>}
          </div>
          <div className="form-group-auth">
            <label htmlFor="dataNascimento">Data de nascimento*</label>
            <input id="dataNascimento" className={`form-input ${errors.dataNascimento ? 'border-red-500' : ''}`} type="text" placeholder="dd/mm/aaaa" value={formData.dataNascimento}
              onChange={(e) => onInputChange('dataNascimento', e.target.value)} required />
            {errors.dataNascimento && <small className="error-message text-red-500">{errors.dataNascimento}</small>}
          </div>
          <div className="form-group-auth">
            <label htmlFor="tipoUsuario">Tipo de usuário*</label>
            <select id="tipoUsuario" className={`form-input ${errors.tipoUsuario ? 'border-red-500' : ''}`} value={formData.tipoUsuario}
              onChange={(e) => onInputChange('tipoUsuario', e.target.value)} required>
              <option value="">Selecione</option>
              <option value="PACIENTE">PACIENTE</option>
              <option value="CUIDADOR">CUIDADOR</option>
            </select>
            {errors.tipoUsuario && <small className="error-message text-red-500">{errors.tipoUsuario}</small>}
          </div>
          <h3 className="form-step-title mt-6">Informações de Contato</h3>
          <div className="form-group-auth">
            <label htmlFor="cadastroEmail">Email*</label>
            <input id="cadastroEmail" className={`form-input ${errors.cadastroEmail ? 'border-red-500' : ''}`} type="email" value={formData.cadastroEmail}
              onChange={(e) => onInputChange('cadastroEmail', e.target.value)} required />
            {errors.cadastroEmail && <small className="error-message text-red-500">{errors.cadastroEmail}</small>}
          </div>
          <div className="form-group-auth">
            <label htmlFor="cadastroTelefone">Telefone</label>
            <input className="form-input" type="tel" id="cadastroTelefone" placeholder="(11) 99999-9999" value={formData.cadastroTelefone} onChange={(e) => onInputChange('cadastroTelefone', e.target.value)} />
          </div>

          <h3 className="form-step-title mt-6">Definir Senha</h3>
          <PasswordField
            id="cadastroSenha"
            label="Senha*"
            value={formData.cadastroSenha}
            error={errors.cadastroSenha}
            showPassword={showPasswords.cadastroSenha}
            required
            onChange={(value) => onInputChange('cadastroSenha', value)}
            onTogglePassword={() => onTogglePassword('cadastroSenha')}
          />
          <PasswordField
            id="confirmarSenha"
            label="Confirmar senha*"
            value={formData.confirmarSenha}
            error={errors.confirmarSenha}
            showPassword={showPasswords.confirmarSenha}
            required
            onChange={(value) => onInputChange('confirmarSenha', value)}
            onTogglePassword={() => onTogglePassword('confirmarSenha')}
          />

          <p className="text-xs p-3 mt-4 rounded-md border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800">
            <strong>Dica de segurança:</strong> Use uma senha forte com letras, números e símbolos.
          </p>
          <div className="mt-6">
            <button type="submit" className="btn btn-primary w-full cursor-pointer">Criar conta</button>
          </div>
          {statusMessage && statusMessage.message && (
            <div className={`p-3 rounded-md mt-4 ${
              statusMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : statusMessage.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
              {statusMessage.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
