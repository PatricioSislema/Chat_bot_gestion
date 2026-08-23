import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Row, Col, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';
import ModalForm from '../components/ModalForm';
import ConfirmModal from '../components/ConfirmModal';
import ToastMessage from '../components/ToastMessage';
import SearchBar from '../components/SearchBar';
import TooltipIcon from '../components/TooltipIcon';
import PaginationBar from '../components/PaginationBar';
import CampoTexto from '../components/forms/CampoTexto';
import CampoSelect from '../components/forms/CampoSelect';
import { isRequired, isValidDate } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Horarios() {
    // ============================================
    // ESTADOS
    // ============================================
    const [horarios, setHorarios] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({
        doctorId: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        disponible: true
    });
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
    // EFECTO: CARGAR DATOS AL INICIAR
    // ============================================
    useEffect(() => {
        fetchHorarios();
        fetchDoctores();
    }, []);

    // ============================================
    // EFECTO: RESETEAR PÁGINA AL BUSCAR
    // ============================================
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================
    // FUNCIONES: OBTENER DATOS DEL BACKEND
    // ============================================
    const fetchHorarios = async () => {
        try {
            const response = await api.get('/horarios');
            setHorarios(response.data);
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            showToast('Error al cargar horarios', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctores = async () => {
        try {
            const response = await api.get('/doctores');
            setDoctores(response.data);
        } catch (error) {
            console.error('Error al cargar médicos:', error);
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
    // FUNCIÓN: ABRIR MODAL (CREAR/EDITAR)
    // ============================================
    const openModal = (horario = null) => {
        if (horario) {
            setForm({
                doctorId: horario.doctorId || '',
                fecha: horario.fecha || '',
                horaInicio: horario.horaInicio || '',
                horaFin: horario.horaFin || '',
                disponible: horario.disponible !== undefined ? horario.disponible : true
            });
            setEditingId(horario.id);
        } else {
            setForm({
                doctorId: '',
                fecha: '',
                horaInicio: '',
                horaFin: '',
                disponible: true
            });
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

        if (!isRequired(form.doctorId)) {
            newErrors.doctorId = 'Debe seleccionar un médico (*)';
        }

        if (!isRequired(form.fecha)) {
            newErrors.fecha = 'La fecha es obligatoria (*)';
        } else if (!isValidDate(form.fecha)) {
            newErrors.fecha = 'Ingrese una fecha válida';
        }

        if (!isRequired(form.horaInicio)) {
            newErrors.horaInicio = 'La hora de inicio es obligatoria (*)';
        }

        if (!isRequired(form.horaFin)) {
            newErrors.horaFin = 'La hora de fin es obligatoria (*)';
        }

        if (form.horaInicio && form.horaFin && form.horaInicio >= form.horaFin) {
            newErrors.horaFin = 'La hora de fin debe ser mayor que la hora de inicio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // FUNCIÓN: GUARDAR (CREAR O ACTUALIZAR)
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            const data = {
                doctorId: parseInt(form.doctorId),
                fecha: form.fecha,
                horaInicio: form.horaInicio,
                horaFin: form.horaFin,
                disponible: form.disponible
            };

            if (editingId) {
                await api.put(`/horarios/${editingId}`, data);
                showToast('Horario actualizado con éxito');
            } else {
                await api.post('/horarios', data);
                showToast('Horario creado con éxito');
            }
            setShowModal(false);
            fetchHorarios();
        } catch (error) {
            console.error('Error al guardar horario:', error);
            showToast('Error al guardar horario', 'danger');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // FUNCIÓN: CAMBIAR DISPONIBILIDAD
    // ============================================
    const handleToggleDisponibilidad = async (id, disponibleActual) => {
        try {
            const nuevoEstado = !disponibleActual;
            await api.put(`/horarios/${id}`, { disponible: nuevoEstado });
            fetchHorarios();
            showToast(`Horario ${nuevoEstado ? 'disponible' : 'ocupado'} con éxito`);
        } catch (error) {
            console.error('Error al cambiar disponibilidad:', error);
            showToast('Error al cambiar disponibilidad', 'danger');
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
            await api.delete(`/horarios/${deleteId}`);
            setShowConfirm(false);
            showToast('Horario eliminado con éxito');
            fetchHorarios();
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            showToast('Error al eliminar horario', 'danger');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    const getSuggestionLabel = (horario) => {
        const doctor = doctores.find(d => d.id === horario.doctorId);
        return `${doctor?.nombre || 'Médico'} ${doctor?.apellido || ''} - ${horario.fecha} (${horario.horaInicio})`;
    };

    const handleSelectSuggestion = (suggestion) => {
        const doctor = doctores.find(d => d.id === suggestion.doctorId);
        setSearchTerm(`${doctor?.nombre || ''} ${doctor?.apellido || ''} - ${suggestion.fecha}`);
    };

    // ============================================
    // FILTRAR DATOS (OCULTAR FECHAS PASADAS)
    // ============================================
    const today = new Date().toISOString().split('T')[0];

    const filteredData = horarios
        .filter(item => item.fecha >= today)
        .filter(item =>
            `${item.doctorNombre || ''} ${item.fecha}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
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
                <p>Cargando horarios...</p>
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
                    <h1>📅 Horarios</h1>
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
          BARRA DE BÚSQUEDA CON AUTOCOMPLETADO
      ============================================ */}
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar horario por médico o fecha..."
                suggestions={horarios.filter(item => item.fecha >= today)}
                onSelectSuggestion={handleSelectSuggestion}
                getSuggestionLabel={getSuggestionLabel}
            />

            {/* ============================================
          TABLA DE HORARIOS
      ============================================ */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        <th>Hora inicio</th>
                        <th>Hora fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No hay horarios disponibles</td>
                        </tr>
                    ) : (
                        currentItems.map((horario) => (
                            <tr key={horario.id}>
                                <td>{horario.id}</td>
                                <td>{horario.doctorNombre || 'N/A'}</td>
                                <td>{horario.fecha}</td>
                                <td>{horario.horaInicio}</td>
                                <td>{horario.horaFin}</td>
                                <td>
                                    <Badge bg={horario.disponible ? 'success' : 'danger'}>
                                        {horario.disponible ? 'Disponible' : 'Ocupado'}
                                    </Badge>
                                </td>
                                <td>
                                    {(rol === 'ADMIN' || rol === 'EDITOR') && (
                                        <>
                                            <TooltipIcon
                                                icon="bi bi-pencil"
                                                text="Editar horario"
                                                variant="warning"
                                                onClick={() => openModal(horario)}
                                                className="me-2"
                                            />
                                            <TooltipIcon
                                                icon={horario.disponible ? 'bi bi-lock' : 'bi bi-unlock'}
                                                text={horario.disponible ? 'Ocupar horario' : 'Liberar horario'}
                                                variant={horario.disponible ? 'secondary' : 'success'}
                                                onClick={() => handleToggleDisponibilidad(horario.id, horario.disponible)}
                                                className="me-2"
                                            />
                                        </>
                                    )}
                                    {rol === 'ADMIN' && (
                                        <TooltipIcon
                                            icon="bi bi-trash"
                                            text="Eliminar horario"
                                            variant="danger"
                                            onClick={() => confirmDelete(horario.id)}
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
                title={editingId ? 'Editar horario' : 'Nuevo horario'}
                loading={saving}
                submitText={editingId ? 'Actualizar' : 'Crear'}
                size="lg"
            >
                <Row>
                    <Col md={6}>
                        <CampoSelect
                            label="Médico"
                            name="doctorId"
                            value={form.doctorId}
                            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                            options={doctores.map(doc => ({
                                value: doc.id,
                                label: `${doc.nombre} ${doc.apellido}`
                            }))}
                            placeholder="Seleccionar médico"
                            error={errors.doctorId}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <CampoTexto
                            label="Fecha"
                            name="fecha"
                            type="date"
                            value={form.fecha}
                            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                            error={errors.fecha}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <CampoTexto
                            label="Hora inicio"
                            name="horaInicio"
                            type="time"
                            value={form.horaInicio}
                            onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                            error={errors.horaInicio}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <CampoTexto
                            label="Hora fin"
                            name="horaFin"
                            type="time"
                            value={form.horaFin}
                            onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                            error={errors.horaFin}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <CampoSelect
                            label="Disponible"
                            name="disponible"
                            value={form.disponible}
                            onChange={(e) => setForm({ ...form, disponible: e.target.value === 'true' })}
                            options={[
                                { value: true, label: 'Disponible' },
                                { value: false, label: 'Ocupado' }
                            ]}
                        />
                    </Col>
                </Row>
            </ModalForm>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
      ============================================ */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                message="¿Estás seguro de eliminar este horario?"
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

export default Horarios;