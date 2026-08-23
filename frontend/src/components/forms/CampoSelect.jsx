import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Componente reutilizable para campos de selección con validación.
 * 
 * @param {string} label - Etiqueta del campo
 * @param {string} name - Nombre del campo
 * @param {string} value - Valor seleccionado
 * @param {function} onChange - Función para actualizar el estado
 * @param {array} options - Lista de opciones [{ value: '1', label: 'Cardiología' }]
 * @param {string} placeholder - Texto por defecto (ej: "Seleccionar...")
 * @param {string} error - Mensaje de error (si existe)
 * @param {boolean} required - Si el campo es obligatorio
 */
function CampoSelect({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Seleccionar...',
    error,
    required = false,
    className = '',
    ...props
}) {
    return (
        <Form.Group className={`mb-3 ${className}`}>
            <Form.Label>
                {label}
                {required && <span className="text-danger"> *</span>}
            </Form.Label>
            <Form.Select
                name={name}
                value={value}
                onChange={onChange}
                isInvalid={!!error}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </Form.Select>
            {error && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
}

export default CampoSelect;