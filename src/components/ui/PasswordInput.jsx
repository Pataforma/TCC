import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * Componente de input de senha com opção de visualização
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do campo
 * @param {string} props.value - Valor do campo
 * @param {function} props.onChange - Função chamada ao alterar o valor
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {string} props.placeholder - Placeholder do campo
 * @param {string} props.className - Classes adicionais para o container
 * @param {string} props.inputClassName - Classes adicionais para o input
 * @returns {JSX.Element} Componente de input de senha
 */
function PasswordInput({
  id,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  className = "",
  inputClassName = "",
  inputStyle = {},
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className={`password-input-container ${className}`}
      style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}
    >
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`password-input ${inputClassName}`}
        style={{ flex: 1, width: "auto", ...inputStyle }}
        {...props}
      />
      <button
        type="button"
        className="password-toggle-button"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        style={{
          background: "transparent",
          border: 0,
          cursor: "pointer",
          color: "var(--main-color)",
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0
        }}
      >
        {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
      </button>
    </div>
  );
}

export default PasswordInput;


