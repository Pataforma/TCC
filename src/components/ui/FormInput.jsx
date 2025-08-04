import React from 'react';
import { Form } from 'react-bootstrap';

const FormInput = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  required = false, 
  placeholder = "",
  error,
  helpText,
  maxLength,
  step,
  ...props
}) => {
  const inputProps = {
    type,
    value,
    onChange,
    required,
    placeholder,
    maxLength,
    step,
    ...props
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {type === "textarea" ? (
        <Form.Control
          as="textarea"
          rows={3}
          isInvalid={!!error}
          {...inputProps}
        />
      ) : (
        <Form.Control
          isInvalid={!!error}
          {...inputProps}
        />
      )}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
      {helpText && (
        <Form.Text className="text-muted">
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default FormInput; 