package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.CitaDTO;
import ec.edu.iti.citasmedicas.backend.mapper.CitaMapper;
import ec.edu.iti.citasmedicas.backend.model.Cita;
import ec.edu.iti.citasmedicas.backend.model.Paciente;
import ec.edu.iti.citasmedicas.backend.model.Doctor;
import ec.edu.iti.citasmedicas.backend.model.Horario;
import ec.edu.iti.citasmedicas.backend.repository.CitaRepository;
import ec.edu.iti.citasmedicas.backend.repository.PacienteRepository;
import ec.edu.iti.citasmedicas.backend.repository.DoctorRepository;
import ec.edu.iti.citasmedicas.backend.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de negocio para las citas.
 */
@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CitaMapper citaMapper;

    /**
     * Listar todas las citas.
     */
    public List<CitaDTO> listarTodas() {
        List<Cita> citas = citaRepository.findAll();
        return citas.stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener una cita por su ID.
     */
    public CitaDTO obtenerPorId(Long id) {
        Cita cita = citaRepository.findById(id).orElse(null);
        if (cita == null) {
            return null;
        }
        return citaMapper.toDTO(cita);
    }

    /**
     * Obtener citas por paciente.
     */
    public List<CitaDTO> listarPorPaciente(Long pacienteId) {
        List<Cita> citas = citaRepository.findByPacienteId(pacienteId);
        return citas.stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener citas por doctor.
     */
    public List<CitaDTO> listarPorDoctor(Long doctorId) {
        List<Cita> citas = citaRepository.findByDoctorId(doctorId);
        return citas.stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener citas por fecha.
     */
    public List<CitaDTO> listarPorFecha(LocalDate fecha) {
        List<Cita> citas = citaRepository.findByFecha(fecha);
        return citas.stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener citas por estado.
     */
    public List<CitaDTO> listarPorEstado(String estado) {
        List<Cita> citas = citaRepository.findByEstado(estado);
        return citas.stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crear una nueva cita.
     * @Transactional asegura que si algo falla, todo se deshace (rollback).
     */
    @Transactional
    public CitaDTO crear(CitaDTO dto) {
        // 1. Verificar que el paciente existe
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId()).orElse(null);
        if (paciente == null) {
            return null;
        }

        // 2. Verificar que el doctor existe
        Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElse(null);
        if (doctor == null) {
            return null;
        }

        // 3. Verificar que el horario existe y está disponible
        Horario horario = null;
        if (dto.getHorarioId() != null) {
            horario = horarioRepository.findById(dto.getHorarioId()).orElse(null);
            if (horario == null) {
                return null;
            }
            if (!horario.getDisponible()) {
                return null; // El horario no está disponible
            }
        }

        // 4. Convertir DTO a entidad
        Cita cita = citaMapper.toEntity(dto);
        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setHorario(horario);

        // 5. Guardar la cita
        Cita guardada = citaRepository.save(cita);

        // 6. Marcar el horario como ocupado (si se seleccionó)
        if (horario != null) {
            horario.setDisponible(false);
            horarioRepository.save(horario);
        }

        // 7. Devolver DTO
        return citaMapper.toDTO(guardada);
    }

    /**
     * Actualizar el estado de una cita.
     */
    public CitaDTO actualizarEstado(Long id, String nuevoEstado) {
        Cita cita = citaRepository.findById(id).orElse(null);
        if (cita == null) {
            return null;
        }
        cita.setEstado(nuevoEstado);
        Cita actualizada = citaRepository.save(cita);
        return citaMapper.toDTO(actualizada);
    }

    /**
     * Cancelar una cita (libera el horario).
     */
    @Transactional
    public boolean cancelarCita(Long id) {
        Cita cita = citaRepository.findById(id).orElse(null);
        if (cita == null) {
            return false;
        }

        // 1. Liberar el horario si existe
        if (cita.getHorario() != null && cita.getHorario().getId() != null) {
            Horario horario = horarioRepository.findById(cita.getHorario().getId()).orElse(null);
            if (horario != null) {
                horario.setDisponible(true);
                horarioRepository.save(horario);
            }
        }

        // 2. Cambiar estado de la cita a "Cancelada"
        cita.setEstado("Cancelada");
        citaRepository.save(cita);

        return true;
    }

    /**
     * Eliminar una cita por su ID (sin liberar horario, solo elimina).
     */
    public boolean eliminar(Long id) {
        if (!citaRepository.existsById(id)) {
            return false;
        }
        citaRepository.deleteById(id);
        return true;
    }
    /**
     * Verifica si ya existe una cita para un doctor en una fecha y hora específicas.
     * Esto evita que se agenden citas duplicadas (mismo doctor, mismo día, misma hora).
     */
    public boolean existeCitaEnHorario(Long doctorId, LocalDate fecha, LocalTime hora) {
        List<Cita> citas = citaRepository.findByDoctorIdAndFechaAndHora(doctorId, fecha, hora);
        return !citas.isEmpty();
    }
}