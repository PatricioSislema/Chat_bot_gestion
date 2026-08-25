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
import { isRequired, isOnlyLetters, isValidPhone, isValidEmail, toUpperCase, isValidDate } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Pacientes() {
  // ============================================
  // ESTADOS
  // ============================================
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    direccion: '',
    telefono: '',
    email: '',
    medicamento: '',
    alergias: '',
    estado: 'Activo'
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
  // EFECTO: CARGAR PACIENTES AL INICIAR
  // ============================================
  useEffect(() => {
    fetchPacientes();
  }, []);

  // ============================================
  // EFECTO: RESETEAR PÁGINA AL BUSCAR
  // ============================================
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============================================
  // FUNCIÓN: OBTENER PACIENTES DEL BACKEND
  // ============================================
  const fetchPacientes = async () => {
    try {
      const response = await api.get('/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      showToast('Error al cargar pacientes', 'danger');
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
  // FUNCIÓN: ABRIR MODAL (CREAR/EDITAR)
  // ============================================
  const openModal = (paciente = null) => {
    if (paciente) {
      setForm({
        nombres: paciente.nombres || '',
        apellidos: paciente.apellidos || '',
        fechaNacimiento: paciente.fechaNacimiento || '',
        sexo: paciente.sexo || '',
        direccion: paciente.direccion || '',
        telefono: paciente.telefono || '',
        email: paciente.email || '',
        medicamento: paciente.medicamento || '',
        alergias: paciente.alergias || '',
        estado: paciente.estado || 'Activo'
      });
      setEditingId(paciente.id);
    } else {
      setForm({
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        sexo: '',
        direccion: '',
        telefono: '',
        email: '',
        medicamento: '',
        alergias: '',
        estado: 'Activo'
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

    if (!isRequired(form.nombres)) {
      newErrors.nombres = 'Los nombres son obligatorios (*)';
    } else if (!isOnlyLetters(form.nombres)) {
      newErrors.nombres = 'Los nombres solo deben contener letras';
    }

    if (!isRequired(form.apellidos)) {
      newErrors.apellidos = 'Los apellidos son obligatorios (*)';
    } else if (!isOnlyLetters(form.apellidos)) {
      newErrors.apellidos = 'Los apellidos solo deben contener letras';
    }

    if (!isRequired(form.fechaNacimiento)) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria (*)';
    } else if (!isValidDate(form.fechaNacimiento)) {
      newErrors.fechaNacimiento = 'Ingrese una fecha válida';
    }

    if (!isRequired(form.sexo)) {
      newErrors.sexo = 'Debe seleccionar un sexo (*)';
    }

    if (!isRequired(form.telefono)) {
      newErrors.telefono = 'El teléfono es obligatorio (*)';
    } else if (!isValidPhone(form.telefono)) {
      newErrors.telefono = 'Ingrese un número de teléfono válido (10 dígitos)';
    }

    if (form.email && !isValidEmail(form.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido (ej: usuario@dominio.com)';
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
        nombres: toUpperCase(form.nombres),
        apellidos: toUpperCase(form.apellidos),
        fechaNacimiento: form.fechaNacimiento,
        sexo: form.sexo,
        direccion: toUpperCase(form.direccion),
        telefono: form.telefono,
        email: form.email,
        medicamento: form.medicamento,
        alergias: form.alergias,
        estado: form.estado
      };

      if (editingId) {
        await api.put(`/pacientes/${editingId}`, data);
        showToast('Paciente actualizado con éxito');
      } else {
        await api.post('/pacientes', data);
        showToast('Paciente creado con éxito');
      }
      setShowModal(false);
      fetchPacientes();
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      showToast('Error al guardar paciente', 'danger');
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
      await api.delete(`/pacientes/${deleteId}`);
      setShowConfirm(false);
      showToast('Paciente eliminado con éxito');
      fetchPacientes();
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      showToast('Error al eliminar paciente', 'danger');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // ============================================
  // FUNCIONES PARA AUTOCOMPLETADO
  // ============================================
  const getSuggestionLabel = (paciente) =>
    `${paciente.nombres} ${paciente.apellidos} (${paciente.telefono || 'Sin teléfono'})`;

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(`${suggestion.nombres} ${suggestion.apellidos}`);
  };

  // ============================================
  // FILTRAR DATOS
  // ============================================
  const filteredData = pacientes.filter(item =>
    `${item.nombres} ${item.apellidos} ${item.telefono || ''} ${item.email || ''}`
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
        <p>Cargando pacientes...</p>
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
          <h1>🧑‍⚕️ Pacientes</h1>
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
        placeholder="Buscar paciente por nombre, apellido o teléfono..."
        suggestions={pacientes}
        onSelectSuggestion={handleSelectSuggestion}
        getSuggestionLabel={getSuggestionLabel}
      />

      {/* ============================================
          TABLA DE PACIENTES
      ============================================ */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Sexo</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No hay pacientes registrados</td>
            </tr>
          ) : (
            currentItems.map((paciente) => (
              <tr key={paciente.id}>
                <td>{paciente.id}</td>
                <td>{paciente.nombres} {paciente.apellidos}</td>
                <td>{paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</td>
                <td>{paciente.telefono || '-'}</td>
                <td>{paciente.email || '-'}</td>
                <td>{paciente.estado || 'Activo'}</td>
                <td>
                  {(rol === 'ADMIN' || rol === 'EDITOR') && (
                    <TooltipIcon
                      icon="bi bi-pencil"
                      text="Editar paciente"
                      variant="warning"
                      onClick={() => openModal(paciente)}
                      className="me-2"
                    />
                  )}
                  {rol === 'ADMIN' && (
                    <TooltipIcon
                      icon="bi bi-trash"
                      text="Eliminar paciente"
                      variant="danger"
                      onClick={() => confirmDelete(paciente.id)}
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
        title={editingId ? 'Editar paciente' : 'Nuevo paciente'}
        loading={saving}
        submitText={editingId ? 'Actualizar' : 'Crear'}
        size="xl"
      >
        <Row>
          <Col md={6}>
            <CampoTexto
              label="Nombres"
              name="nombres"
              value={form.nombres}
              onChange={(e) => setForm({ ...form, nombres: e.target.value })}
              placeholder="Ingrese los nombres"
              error={errors.nombres}
              required
	      disabled={false}
            />
          </Col>
          <Col md={6}>
            <CampoTexto
              label="Apellidos"
              name="apellidos"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              placeholder="Ingrese los apellidos"
              error={errors.apellidos}
              required
	      disabled={false}
            />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <CampoTexto
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
              error={errors.fechaNacimiento}
              required
            />
          </Col>
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
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="0987654321"
              error={errors.telefono}
              required
            />
          </Col>
          <Col md={3}>
            <CampoTexto
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ejemplo@correo.com"
              error={errors.email}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <CampoTexto
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Ingrese la dirección"
            />
          </Col>
          <Col md={4}>
            <CampoTexto
              label="Medicamento"
              name="medicamento"
              value={form.medicamento}
              onChange={(e) => setForm({ ...form, medicamento: e.target.value })}
              placeholder="Medicamentos actuales"
            />
          </Col>
          <Col md={4}>
            <CampoTexto
              label="Alergias"
              name="alergias"
              value={form.alergias}
              onChange={(e) => setForm({ ...form, alergias: e.target.value })}
              placeholder="Alergias conocidas"
            />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <CampoSelect
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              options={[
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
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
        message="¿Estás seguro de eliminar este paciente?"
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

export default Pacientes;