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
import CampoSelect from '../components/forms/CampoSelect';
import { isRequired, isOnlyLetters, isValidPhone, toUpperCase, isValidDate } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Medicos() {
    // ============================================
    // ESTADOS
    // ============================================
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        sexo: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        foto: '',
        especialidad: { id: '' }
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
        fetchMedicos();
        fetchEspecialidades();
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
    const fetchMedicos = async () => {
        try {
            const response = await api.get('/doctores');
            setMedicos(response.data);
        } catch (error) {
            console.error('Error al cargar médicos:', error);
            showToast('Error al cargar médicos', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchEspecialidades = async () => {
        try {
            const response = await api.get('/especialidades');
            setEspecialidades(response.data);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
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
    const openModal = (medico = null) => {
        if (medico) {
            setForm({
                nombre: medico.nombre || '',
                apellido: medico.apellido || '',
                sexo: medico.sexo || '',
                fechaNacimiento: medico.fechaNacimiento || '',
                direccion: medico.direccion || '',
                telefono: medico.telefono || '',
                foto: medico.foto || '',
                especialidad: { id: medico.especialidad?.id || '' }
            });
            setEditingId(medico.id);
        } else {
            setForm({
                nombre: '',
                apellido: '',
                sexo: '',
                fechaNacimiento: '',
                direccion: '',
                telefono: '',
                foto: '',
                especialidad: { id: '' }
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

        if (!isRequired(form.nombre)) {
            newErrors.nombre = 'El nombre es obligatorio (*)';
        } else if (!isOnlyLetters(form.nombre)) {
            newErrors.nombre = 'El nombre solo debe contener letras';
        }

        if (!isRequired(form.apellido)) {
            newErrors.apellido = 'El apellido es obligatorio (*)';
        } else if (!isOnlyLetters(form.apellido)) {
            newErrors.apellido = 'El apellido solo debe contener letras';
        }

        if (!isRequired(form.sexo)) {
            newErrors.sexo = 'Debe seleccionar un sexo (*)';
        }

        if (!form.especialidad.id) {
            newErrors.especialidad = 'Debe seleccionar una especialidad (*)';
        }

        if (form.telefono && !isValidPhone(form.telefono)) {
            newErrors.telefono = 'Ingrese un número de teléfono válido (10 dígitos)';
        }

        if (form.fechaNacimiento && !isValidDate(form.fechaNacimiento)) {
            newErrors.fechaNacimiento = 'Ingrese una fecha válida';
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
                nombre: toUpperCase(form.nombre),
                apellido: toUpperCase(form.apellido),
                sexo: form.sexo,
                fechaNacimiento: form.fechaNacimiento || null,
                direccion: toUpperCase(form.direccion),
                telefono: form.telefono,
                foto: form.foto,
                especialidad: { id: form.especialidad.id }
            };

            if (editingId) {
                await api.put(`/doctores/${editingId}`, data);
                showToast('Médico actualizado con éxito');
            } else {
                await api.post('/doctores', data);
                showToast('Médico creado con éxito');
            }
            setShowModal(false);
            fetchMedicos();
        } catch (error) {
            console.error('Error al guardar médico:', error);
            showToast('Error al guardar médico', 'danger');
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
            await api.delete(`/doctores/${deleteId}`);
            setShowConfirm(false);
            showToast('✅ Médico eliminado con éxito');
            fetchMedicos();
        } catch (error) {
            console.error('Error al eliminar médico:', error);

            // 🔥 MENSAJE AMIGABLE PARA EL USUARIO
            if (error.response && error.response.status === 500) {
                showToast('⚠️ No se puede eliminar el médico porque tiene citas asociadas.', 'warning');
            } else {
                showToast('❌ Error al eliminar médico. Por favor, intenta de nuevo.', 'danger');
            }
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    const getSuggestionLabel = (medico) =>
        `${medico.nombre} ${medico.apellido} (${medico.especialidad?.nombre || 'Sin especialidad'})`;

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(`${suggestion.nombre} ${suggestion.apellido}`);
    };

    // ============================================
    // FILTRAR DATOS
    // ============================================
    const filteredData = medicos.filter(item =>
        `${item.nombre} ${item.apellido} ${item.especialidad?.nombre || ''}`
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
                <p>Cargando médicos...</p>
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
                    <h1>👨‍⚕️ Médicos</h1>
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
                placeholder="Buscar médico por nombre o especialidad..."
                suggestions={medicos}
                onSelectSuggestion={handleSelectSuggestion}
                getSuggestionLabel={getSuggestionLabel}
            />

            {/* ============================================
          TABLA DE MÉDICOS
      ============================================ */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Sexo</th>
                        <th>Teléfono</th>
                        <th>Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No hay médicos registrados</td>
                        </tr>
                    ) : (
                        currentItems.map((medico) => (
                            <tr key={medico.id}>
                                <td>{medico.id}</td>
                                <td>{medico.nombre} {medico.apellido}</td>
                                <td>{medico.sexo === 'M' ? 'Masculino' : 'Femenino'}</td>
                                <td>{medico.telefono || '-'}</td>
                                <td>{medico.especialidad?.nombre || 'Sin especialidad'}</td>
                                <td>
                                    {(rol === 'ADMIN' || rol === 'EDITOR') && (
                                        <TooltipIcon
                                            icon="bi bi-pencil"
                                            text="Editar médico"
                                            variant="warning"
                                            onClick={() => openModal(medico)}
                                            className="me-2"
                                        />
                                    )}
                                    {rol === 'ADMIN' && (
                                        <TooltipIcon
                                            icon="bi bi-trash"
                                            text="Eliminar médico"
                                            variant="danger"
                                            onClick={() => confirmDelete(medico.id)}
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
                title={editingId ? 'Editar médico' : 'Nuevo médico'}
                loading={saving}
                submitText={editingId ? 'Actualizar' : 'Crear'}
                size="xl"
            >
                <Row>
                    <Col md={6}>
                        <CampoTexto
                            label="Nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            placeholder="Ingrese el nombre"
                            error={errors.nombre}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <CampoTexto
                            label="Apellido"
                            name="apellido"
                            value={form.apellido}
                            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                            placeholder="Ingrese el apellido"
                            error={errors.apellido}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={3}>
                        <CampoSelect
                            label="Sexo"
                            name="sexo"
                            value={form.sexo}
                            onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                            options={[
                                { value: 'M', label: 'Masculino' },
                                { value: 'F', label: 'Femenino' }
                            ]}
                            placeholder="Seleccionar sexo"
                            error={errors.sexo}
                            required
                        />
                    </Col>
                    <Col md={3}>
                        <CampoTexto
                            label="Fecha de nacimiento"
                            name="fechaNacimiento"
                            type="date"
                            value={form.fechaNacimiento}
                            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                            error={errors.fechaNacimiento}
                        />
                    </Col>
                    <Col md={3}>
                        <CampoTexto
                            label="Teléfono"
                            name="telefono"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            placeholder="0987654321"
                            error={errors.telefono}
                        />
                    </Col>
                    <Col md={3}>
                        <CampoSelect
                            label="Especialidad"
                            name="especialidad"
                            value={form.especialidad.id}
                            onChange={(e) => setForm({ ...form, especialidad: { id: e.target.value } })}
                            options={especialidades.map(esp => ({ value: esp.id, label: esp.nombre }))}
                            placeholder="Seleccionar especialidad"
                            error={errors.especialidad}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <CampoTexto
                            label="Dirección"
                            name="direccion"
                            value={form.direccion}
                            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                            placeholder="Ingrese la dirección"
                        />
                    </Col>
                    <Col md={6}>
                        <CampoTexto
                            label="Foto (URL)"
                            name="foto"
                            value={form.foto}
                            onChange={(e) => setForm({ ...form, foto: e.target.value })}
                            placeholder="https://ejemplo.com/foto.jpg"
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
                message="¿Estás seguro de eliminar este médico?"
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

export default Medicos;