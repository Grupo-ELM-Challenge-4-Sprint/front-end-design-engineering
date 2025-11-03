import type { ReactElement, FormEvent } from 'react';
import { PasswordField } from './PasswordField';

interface LoginFormProps {
  formData: {
    loginCpf: string;
    loginSenha: string;
  };
  errors: {[key: string]: string};
  statusMessage: { message: string; type: 'success' | 'error' | 'info' } | null;
  showPasswords: {[key: string]: boolean};
  onInputChange: (field: string, value: string) => void;
  onTogglePassword: (field: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFormChange: (form: 'login' | 'cadastro') => void;
}

export const LoginForm = ({
  formData,
  errors,
  statusMessage,
  showPasswords,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onFormChange
}: LoginFormProps): ReactElement => {
  return (
    <section>
      <div className="auth-card">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Acesse sua conta</h2>
        <p className="auth-subtitle">Entre com suas credenciais para acessar sua área de paciente.</p>

        <form onSubmit={onSubmit}>
          <div className="form-group-auth">
            <label htmlFor="loginCpf">CPF</label>
            <input className={`form-input ${errors.loginCpf ? 'border-red-500' : ''}`} type="text" id="loginCpf" placeholder="000.000.000-00" value={formData.loginCpf || ''} onChange={(e) => onInputChange('loginCpf', e.target.value)} required />
            {errors.loginCpf && <small className="error-message text-red-500">{errors.loginCpf}</small>}
          </div>
          <PasswordField
            id="loginSenha"
            label="Senha"
            value={formData.loginSenha}
            error={errors.loginSenha}
            showPassword={showPasswords.loginSenha}
            placeholder="Sua senha"
            required
            onChange={(value) => onInputChange('loginSenha', value)}
            onTogglePassword={() => onTogglePassword('loginSenha')}
          />
          <button type="submit" className="btn btn-primary w-full cursor-pointer">Entrar</button>
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
        <p className="auth-switch">
          Não tem uma conta?
          <button type="button" onClick={() => onFormChange('cadastro')} className="auth-link bg-transparent border-none p-0 cursor-pointer">
            Cadastre-se
          </button>
        </p>
      </div>
    </section>
  );
};
