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
import { isRequired, isValidDate, toUpperCase } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ASUNTOS_OPCIONES = [
    { value: 'Consulta general', label: 'Consulta general' },
    { value: 'Control', label: 'Control' },
    { value: 'Urgencia', label: 'Urgencia' },
    { value: 'Revisión', label: 'Revisión' },
    { value: 'Examen médico', label: 'Examen médico' },
    { value: 'Otro', label: 'Otro' }
];

const ORIGEN_OPCIONES = [
    { value: 'Telegram', label: '📱 Telegram' },
    { value: 'Teléfono', label: '📞 Teléfono' },
    { value: 'Presencial', label: '🏢 Presencial' },
    { value: 'Web', label: '🌐 Web' }
];

const ESTADO_OPCIONES = [
    { value: 'Agendada', label: 'Agendada' },
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'Atendida', label: 'Atendida' },
    { value: 'Cancelada', label: 'Cancelada' }
];

function Citas() {
    // ============================================
    // ESTADOS
    // ============================================
    const [citas, setCitas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({
        pacienteId: '',
        doctorId: '',
        fecha: '',
        hora: '',
        asunto: '',
        motivo: '',
        origen: '',
        estado: 'Agendada'
    });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showOtroAsunto, setShowOtroAsunto] = useState(false);
    const rol = localStorage.getItem('rol');

    // ============================================
    // EFECTO: CARGAR DATOS AL INICIAR
    // ============================================
    useEffect(() => {
        fetchCitas();
        fetchPacientes();
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
    const fetchCitas = async () => {
        try {
            const response = await api.get('/citas');
            setCitas(response.data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            showToast('Error al cargar citas', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchPacientes = async () => {
        try {
            const response = await api.get('/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
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
    const openModal = (cita = null) => {
        if (cita) {
            setForm({
                pacienteId: cita.pacienteId || '',
                doctorId: cita.doctorId || '',
                fecha: cita.fecha || '',
                hora: cita.hora || '',
                asunto: cita.asunto || '',
                motivo: cita.motivo || '',
                origen: cita.origen || '',
                estado: cita.estado || 'Agendada'
            });
            setShowOtroAsunto(cita.asunto && !ASUNTOS_OPCIONES.some(opt => opt.value === cita.asunto));
            setEditingId(cita.id);
        } else {
            setForm({
                pacienteId: '',
                doctorId: '',
                fecha: '',
                hora: '',
                asunto: '',
                motivo: '',
                origen: '',
                estado: 'Agendada'
            });
            setShowOtroAsunto(false);
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

        if (!isRequired(form.pacienteId)) {
            newErrors.pacienteId = 'Debe seleccionar un paciente (*)';
        }

        if (!isRequired(form.doctorId)) {
            newErrors.doctorId = 'Debe seleccionar un médico (*)';
        }

        if (!isRequired(form.fecha)) {
            newErrors.fecha = 'La fecha es obligatoria (*)';
        } else if (!isValidDate(form.fecha)) {
            newErrors.fecha = 'Ingrese una fecha válida';
        }

        if (!isRequired(form.hora)) {
            newErrors.hora = 'La hora es obligatoria (*)';
        }

        if (!isRequired(form.asunto)) {
            newErrors.asunto = 'El asunto es obligatorio (*)';
        }

        if (!isRequired(form.origen)) {
            newErrors.origen = 'El origen es obligatorio (*)';
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
                pacienteId: parseInt(form.pacienteId),
                doctorId: parseInt(form.doctorId),
                fecha: form.fecha,
                hora: form.hora,
                asunto: form.asunto === 'Otro' ? form.otroAsunto : form.asunto,
                motivo: form.motivo,
                origen: form.origen,
                estado: form.estado
            };

            if (editingId) {
                await api.put(`/citas/${editingId}`, data);
                showToast('Cita actualizada con éxito');
            } else {
                await api.post('/citas', data);
                showToast('Cita creada con éxito');
            }
            setShowModal(false);
            fetchCitas();
        } catch (error) {
            console.error('Error al guardar cita:', error);
            showToast('Error al guardar cita', 'danger');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // FUNCIÓN: CAMBIAR ESTADO DE CITA
    // ============================================
    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            await api.put(`/citas/${id}/estado?estado=${nuevoEstado}`);
            fetchCitas();
            showToast(`Cita ${nuevoEstado.toLowerCase()} con éxito`);
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            showToast('Error al cambiar estado', 'danger');
        }
    };

    // ============================================
    // FUNCIÓN: CONFIRMAR CANCELACIÓN
    // ============================================
    const confirmCancel = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    // ============================================
    // FUNCIÓN: CANCELAR CITA
    // ============================================
    const handleCancel = async () => {
        setDeleting(true);
        try {
            await api.delete(`/citas/${deleteId}`);
            setShowConfirm(false);
            showToast('Cita cancelada con éxito');
            fetchCitas();
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            showToast('Error al cancelar cita', 'danger');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    const getSuggestionLabel = (cita) => {
        const paciente = pacientes.find(p => p.id === cita.pacienteId);
        const doctor = doctores.find(d => d.id === cita.doctorId);
        return `${paciente?.nombres || ''} ${paciente?.apellidos || ''} - ${doctor?.nombre || ''} ${doctor?.apellido || ''} (${cita.fecha})`;
    };

    const handleSelectSuggestion = (suggestion) => {
        const paciente = pacientes.find(p => p.id === suggestion.pacienteId);
        const doctor = doctores.find(d => d.id === suggestion.doctorId);
        setSearchTerm(`${paciente?.nombres || ''} ${paciente?.apellidos || ''} - ${doctor?.nombre || ''} ${doctor?.apellido || ''}`);
    };

    // ============================================
    // OBTENER COLOR DEL BADGE SEGÚN ESTADO
    // ============================================
    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'Agendada': return 'primary';
            case 'Confirmada': return 'success';
            case 'Atendida': return 'info';
            case 'Cancelada': return 'danger';
            default: return 'secondary';
        }
    };

    // ============================================
    // FILTRAR DATOS
    // ============================================
    const filteredData = citas.filter(item =>
        `${item.pacienteNombre || ''} ${item.doctorNombre || ''} ${item.fecha}`
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
                <p>Cargando citas...</p>
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
                    <h1>📋 Citas</h1>
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
                placeholder="Buscar cita por paciente o médico..."
                suggestions={citas}
                onSelectSuggestion={handleSelectSuggestion}
                getSuggestionLabel={getSuggestionLabel}
            />

            {/* ============================================
          TABLA DE CITAS
      ============================================ */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Asunto</th>
                        <th>Origen</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center">No hay citas registradas</td>
                        </tr>
                    ) : (
                        currentItems.map((cita) => (
                            <tr key={cita.id}>
                                <td>{cita.id}</td>
                                <td>{cita.pacienteNombre}</td>
                                <td>{cita.doctorNombre}</td>
                                <td>{cita.fecha}</td>
                                <td>{cita.hora}</td>
                                <td>{cita.asunto}</td>
                                <td>{cita.origen || '-'}</td>
                                <td>
                                    <Badge bg={getEstadoBadge(cita.estado)}>
                                        {cita.estado}
                                    </Badge>
                                </td>
                                <td>
                                    {(rol === 'ADMIN' || rol === 'EDITOR') && (
                                        <>
                                            <TooltipIcon
                                                icon="bi bi-pencil"
                                                text="Editar cita"
                                                variant="warning"
                                                onClick={() => openModal(cita)}
                                                className="me-2"
                                            />
                                            {cita.estado !== 'Cancelada' && (
                                                <TooltipIcon
                                                    icon="bi bi-check-circle"
                                                    text="Confirmar cita"
                                                    variant="success"
                                                    onClick={() => handleCambiarEstado(cita.id, 'Confirmada')}
                                                    className="me-2"
                                                />
                                            )}
                                            {cita.estado !== 'Cancelada' && (
                                                <TooltipIcon
                                                    icon="bi bi-check2-circle"
                                                    text="Marcar como atendida"
                                                    variant="info"
                                                    onClick={() => handleCambiarEstado(cita.id, 'Atendida')}
                                                    className="me-2"
                                                />
                                            )}
                                        </>
                                    )}
                                    {cita.estado !== 'Cancelada' && (
                                        <TooltipIcon
                                            icon="bi bi-x-circle"
                                            text="Cancelar cita"
                                            variant="danger"
                                            onClick={() => confirmCancel(cita.id)}
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
                title={editingId ? 'Editar cita' : 'Nueva cita'}
                loading={saving}
                submitText={editingId ? 'Actualizar' : 'Agendar'}
                size="xl"
            >
                <Row>
                    <Col md={6}>
                        <CampoSelect
                            label="Paciente"
                            name="pacienteId"
                            value={form.pacienteId}
                            onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                            options={pacientes.map(p => ({
                                value: p.id,
                                label: `${p.nombres} ${p.apellidos}`
                            }))}
                            placeholder="Seleccionar paciente"
                            error={errors.pacienteId}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <CampoSelect
                            label="Médico"
                            name="doctorId"
                            value={form.doctorId}
                            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                            options={doctores.map(d => ({
                                value: d.id,
                                label: `${d.nombre} ${d.apellido}`
                            }))}
                            placeholder="Seleccionar médico"
                            error={errors.doctorId}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
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
                    <Col md={4}>
                        <CampoTexto
                            label="Hora"
                            name="hora"
                            type="time"
                            value={form.hora}
                            onChange={(e) => setForm({ ...form, hora: e.target.value })}
                            error={errors.hora}
                            required
                        />
                    </Col>
                    <Col md={4}>
                        <CampoSelect
                            label="Origen"
                            name="origen"
                            value={form.origen}
                            onChange={(e) => setForm({ ...form, origen: e.target.value })}
                            options={ORIGEN_OPCIONES}
                            placeholder="Seleccionar origen"
                            error={errors.origen}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <CampoSelect
                            label="Asunto"
                            name="asunto"
                            value={form.asunto}
                            onChange={(e) => {
                                const value = e.target.value;
                                setForm({ ...form, asunto: value });
                                setShowOtroAsunto(value === 'Otro');
                            }}
                            options={ASUNTOS_OPCIONES}
                            placeholder="Seleccionar asunto"
                            error={errors.asunto}
                            required
                        />
                        {showOtroAsunto && (
                            <CampoTexto
                                label="Especificar asunto"
                                name="otroAsunto"
                                value={form.otroAsunto || ''}
                                onChange={(e) => setForm({ ...form, otroAsunto: e.target.value })}
                                placeholder="Ingrese el asunto"
                                required
                            />
                        )}
                    </Col>
                    <Col md={6}>
                        <CampoSelect
                            label="Estado"
                            name="estado"
                            value={form.estado}
                            onChange={(e) => setForm({ ...form, estado: e.target.value })}
                            options={ESTADO_OPCIONES}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <CampoTexto
                            label="Motivo"
                            name="motivo"
                            value={form.motivo}
                            onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                            placeholder="Motivo de la consulta"
                        />
                    </Col>
                </Row>
            </ModalForm>

            {/* ============================================
          MODAL CONFIRMAR CANCELACIÓN
      ============================================ */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleCancel}
                message="¿Estás seguro de cancelar esta cita?"
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

export default Citas;