import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Componente reutilizable para campos de texto con validación.
 * 
 * @param {string} label - Etiqueta del campo (ej: "Nombre")
 * @param {string} name - Nombre del campo (ej: "nombre")
 * @param {string} value - Valor actual del campo
 * @param {function} onChange - Función para actualizar el estado
 * @param {string} placeholder - Texto de ayuda dentro del campo
 * @param {string} error - Mensaje de error (si existe)
 * @param {boolean} required - Si el campo es obligatorio
 * @param {string} type - Tipo de input (text, date, email, etc.)
 * @param {string} className - Clases CSS adicionales
 */
function CampoTexto({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    type = 'text',
    className = '',
    ...props
}) {
    return (
        <Form.Group className={`mb-3 ${className}`}>
            <Form.Label>
                {label}
                {required && <span className="text-danger"> *</span>}
            </Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                isInvalid={!!error}
                {...props}
            />
            {error && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
}

export default CampoTexto;