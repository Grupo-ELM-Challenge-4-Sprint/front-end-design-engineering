import type { ReactElement } from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  showPassword: boolean;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onTogglePassword: () => void;
}

export const PasswordField = ({
  id,
  label,
  value,
  error,
  showPassword,
  placeholder,
  required = false,
  onChange,
  onTogglePassword
}: PasswordFieldProps): ReactElement => {
  return (
    <div className="form-group-auth">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          className={`form-input pr-10 ${error ? 'border-red-500' : ''}`}
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        <button 
          type="button" 
          className="password-toggle"
          onClick={onTogglePassword}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      {error && <small className="error-message text-red-500">{error}</small>}
    </div>
  );
};
