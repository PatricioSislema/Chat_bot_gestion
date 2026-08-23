import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

/**
 * Componente reutilizable para modales de creación/edición.
 * 
 * @param {boolean} show - Controla si el modal está abierto.
 * @param {function} onHide - Función para cerrar el modal.
 * @param {function} onSubmit - Función para guardar los datos.
 * @param {string} title - Título del modal.
 * @param {ReactNode} children - Contenido del formulario (campos).
 * @param {boolean} loading - Indica si se está guardando.
 * @param {string} submitText - Texto del botón de guardar (Crear/Actualizar).
 * @param {string} size - Tamaño del modal (sm, lg, xl).
 */
function ModalForm({
    show,
    onHide,
    onSubmit,
    title,
    children,
    loading = false,
    submitText = 'Guardar',
    size = 'lg'
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Modal show={show} onHide={onHide} size={size} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {children}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Guardando...
                            </>
                        ) : (
                            submitText
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalForm;