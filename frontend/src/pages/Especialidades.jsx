// ============================================
// IMPORTACIONES
// ============================================
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Row, Col } from 'react-bootstrap';
import api from '../api/axiosConfig';
import ModalForm from '../components/ModalForm';
import ConfirmModal from '../components/ConfirmModal';
import ToastMessage from '../components/ToastMessage';
import SearchBar from '../components/SearchBar';
import TooltipIcon from '../components/TooltipIcon';
import PaginationBar from '../components/PaginationBar';
import CampoTexto from '../components/forms/CampoTexto';
import { isRequired, isOnlyLetters, toUpperCase } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function Especialidades() {
    // ============================================
    // ESTADOS
    // ============================================
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({ nombre: '' });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const rol = localStorage.getItem('rol');

    // ============================================
    // EFECTO: CARGAR ESPECIALIDADES
    // ============================================
    useEffect(() => {
        fetchEspecialidades();
    }, []);

    // ============================================
    // EFECTO: RESETEAR PÁGINA AL BUSCAR
    // ============================================
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================
    // FUNCIÓN: OBTENER ESPECIALIDADES
    // ============================================
    const fetchEspecialidades = async () => {
        try {
            const response = await api.get('/especialidades');
            setEspecialidades(response.data);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            showToast('Error al cargar especialidades', 'danger');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FUNCIÓN: MOSTRAR TOAST
    // ============================================
    const showToast = (message, variant = 'success') => {
        setToast({ show: true, message, variant });
        setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 3000);
    };

    // ============================================
    // FUNCIÓN: ABRIR MODAL
    // ============================================
    const openModal = (especialidad = null) => {
        if (especialidad) {
            setForm({ nombre: especialidad.nombre || '' });
            setEditingId(especialidad.id);
        } else {
            setForm({ nombre: '' });
            setEditingId(null);
        }
        setErrors({});
        setShowModal(true);
    };

    // ============================================
    // FUNCIÓN: VALIDAR FORMULARIO
    // ============================================
    const validateForm = () => {
        const newErrors = {};
        if (!isRequired(form.nombre)) {
            newErrors.nombre = 'El nombre es obligatorio (*)';
        } else if (!isOnlyLetters(form.nombre)) {
            newErrors.nombre = 'El nombre solo debe contener letras';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // FUNCIÓN: GUARDAR
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            const data = { nombre: toUpperCase(form.nombre) };
            if (editingId) {
                await api.put(`/especialidades/${editingId}`, data);
                showToast('Especialidad actualizada con éxito');
            } else {
                await api.post('/especialidades', data);
                showToast('Especialidad creada con éxito');
            }
            setShowModal(false);
            fetchEspecialidades();
        } catch (error) {
            console.error('Error al guardar especialidad:', error);
            showToast('Error al guardar especialidad', 'danger');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // FUNCIÓN: CONFIRMAR ELIMINACIÓN
    // ============================================
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    // ============================================
    // FUNCIÓN: ELIMINAR
    // ============================================
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/especialidades/${deleteId}`);
            setShowConfirm(false);
            showToast('Especialidad eliminada con éxito');
            fetchEspecialidades();
        } catch (error) {
            console.error('Error al eliminar especialidad:', error);
            showToast('Error al eliminar especialidad', 'danger');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    const getSuggestionLabel = (esp) => esp.nombre;
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion.nombre);
    };

    // ============================================
    // FILTRAR DATOS
    // ============================================
    const filteredData = especialidades.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ============================================
    // PAGINACIÓN
    // ============================================
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // ============================================
    // RENDERIZADO: SPINNER
    // ============================================
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Cargando especialidades...</p>
            </Container>
        );
    }

    // ============================================
    // RENDERIZADO: CONTENIDO PRINCIPAL
    // ============================================
    return (
        <Container>
            {/* ============================================
          TÍTULO Y BOTÓN AGREGAR
      ============================================ */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>🏷️ Especialidades</h1>
                </Col>
                {(rol === 'ADMIN' || rol === 'EDITOR') && (
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => openModal()}>
                            <i className="bi bi-plus-circle me-2"></i> Agregar
                        </Button>
                    </Col>
                )}
            </Row>

            {/* ============================================
          BARRA DE BÚSQUEDA
      ============================================ */}
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar especialidad..."
                suggestions={especialidades}
                onSelectSuggestion={handleSelectSuggestion}
                getSuggestionLabel={getSuggestionLabel}
            />

            {/* ============================================
          TABLA DE ESPECIALIDADES
      ============================================ */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">No hay especialidades registradas</td>
                        </tr>
                    ) : (
                        currentItems.map((esp) => (
                            <tr key={esp.id}>
                                <td>{esp.id}</td>
                                <td>{esp.nombre}</td>
                                <td>
                                    {(rol === 'ADMIN' || rol === 'EDITOR') && (
                                        <TooltipIcon
                                            icon="bi bi-pencil"
                                            text="Editar especialidad"
                                            variant="warning"
                                            onClick={() => openModal(esp)}
                                            className="me-2"
                                        />
                                    )}
                                    {rol === 'ADMIN' && (
                                        <TooltipIcon
                                            icon="bi bi-trash"
                                            text="Eliminar especialidad"
                                            variant="danger"
                                            onClick={() => confirmDelete(esp.id)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* ============================================
          BARRA DE PAGINACIÓN
      ============================================ */}
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
            />

            {/* ============================================
          MODAL CREAR/EDITAR
      ============================================ */}
            <ModalForm
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleSubmit}
                title={editingId ? 'Editar especialidad' : 'Nueva especialidad'}
                loading={saving}
                submitText={editingId ? 'Actualizar' : 'Crear'}
            >
                <CampoTexto
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Cardiología"
                    error={errors.nombre}
                    required
                />
            </ModalForm>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
      ============================================ */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                message="¿Estás seguro de eliminar esta especialidad?"
                loading={deleting}
            />

            {/* ============================================
          TOAST (MENSAJES EMERGENTES)
      ============================================ */}
            <ToastMessage
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </Container>
    );
}

export default Especialidades;