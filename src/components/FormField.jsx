import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaCalendar,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  validation,
  required = false,
  disabled = false,
  className = "",
  prepend,
  append,
  options = [],
  rows = 3,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const getInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    if (type === "confirmPassword") {
      return showConfirmPassword ? "text" : "password";
    }
    return type;
  };

  const getIcon = () => {
    switch (type) {
      case "email":
        return <FaEnvelope />;
      case "tel":
      case "phone":
        return <FaPhone />;
      case "date":
        return <FaCalendar />;
      default:
        return null;
    }
  };

  const getPrependContent = () => {
    if (prepend) return prepend;
    const icon = getIcon();
    return icon ? <InputGroup.Text>{icon}</InputGroup.Text> : null;
  };

  const getAppendContent = () => {
    if (append) return append;

    if (type === "password") {
      return (
        <InputGroup.Text
          style={{ cursor: "pointer" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </InputGroup.Text>
      );
    }

    if (type === "confirmPassword") {
      return (
        <InputGroup.Text
          style={{ cursor: "pointer" }}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </InputGroup.Text>
      );
    }

    return null;
  };

  const renderField = () => {
    const inputProps = {
      ...register(name, validation),
      type: getInputType(),
      placeholder,
      disabled,
      className: `form-control ${
        errors[name] ? "is-invalid" : ""
      } ${className}`,
      ...props,
    };

    // Para campos de texto multilinha
    if (type === "textarea") {
      return <Form.Control as="textarea" rows={rows} {...inputProps} />;
    }

    // Para campos select
    if (type === "select") {
      return (
        <Form.Select {...inputProps}>
          <option value="">Selecione uma opção</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    // Para campos de checkbox
    if (type === "checkbox") {
      return (
        <Form.Check
          type="checkbox"
          {...inputProps}
          className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
        />
      );
    }

    // Para campos de radio
    if (type === "radio") {
      return (
        <div>
          {options.map((option) => (
            <Form.Check
              key={option.value}
              type="radio"
              name={name}
              value={option.value}
              label={option.label}
              {...register(name, validation)}
              className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
            />
          ))}
        </div>
      );
    }

    // Para campos com InputGroup (com ícones ou botões)
    if (getPrependContent() || getAppendContent()) {
      return (
        <InputGroup>
          {getPrependContent()}
          <Form.Control {...inputProps} />
          {getAppendContent()}
        </InputGroup>
      );
    }

    // Campo padrão
    return <Form.Control {...inputProps} />;
  };

  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={name}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}

      {renderField()}

      {errors[name] && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {errors[name].message}
        </Form.Control.Feedback>
      )}

      {props.helpText && (
        <Form.Text className="text-muted">{props.helpText}</Form.Text>
      )}
    </Form.Group>
  );
};

// Componente para formulário completo
export const FormContainer = ({
  children,
  onSubmit,
  className = "",
  ...props
}) => {
  return (
    <Form onSubmit={onSubmit} className={className} {...props}>
      {children}
    </Form>
  );
};

// Componente para botão de submit
export const SubmitButton = ({
  children,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type="submit"
      className={`btn btn-primary ${loading ? "disabled" : ""} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Carregando...</span>
        </span>
      )}
      {children}
    </button>
  );
};

// Esquemas de validação comuns
export const validationSchemas = {
  email: {
    required: "Email é obrigatório",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email inválido",
    },
  },

  password: {
    required: "Senha é obrigatória",
    minLength: {
      value: 6,
      message: "Senha deve ter pelo menos 6 caracteres",
    },
  },

  phone: {
    pattern: {
      value: /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/,
      message: "Telefone inválido",
    },
  },

  required: (fieldName) => ({
    required: `${fieldName} é obrigatório`,
  }),

  minLength: (min, fieldName) => ({
    minLength: {
      value: min,
      message: `${fieldName} deve ter pelo menos ${min} caracteres`,
    },
  }),

  maxLength: (max, fieldName) => ({
    maxLength: {
      value: max,
      message: `${fieldName} deve ter no máximo ${max} caracteres`,
    },
  }),
};

export default FormField;
