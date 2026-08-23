package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.HorarioDTO;
import ec.edu.iti.citasmedicas.backend.mapper.HorarioMapper;
import ec.edu.iti.citasmedicas.backend.model.Horario;
import ec.edu.iti.citasmedicas.backend.model.Doctor;
import ec.edu.iti.citasmedicas.backend.repository.HorarioRepository;
import ec.edu.iti.citasmedicas.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de negocio para los horarios.
 */
@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HorarioMapper horarioMapper;

    /**
     * Listar todos los horarios.
     */
    public List<HorarioDTO> listarTodos() {
        List<Horario> horarios = horarioRepository.findAll();
        return horarios.stream()
                .map(horarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener un horario por su ID.
     */
    public HorarioDTO obtenerPorId(Long id) {
        Horario horario = horarioRepository.findById(id).orElse(null);
        if (horario == null) {
            return null;
        }
        return horarioMapper.toDTO(horario);
    }

    /**
     * Obtener horarios disponibles de un doctor en una fecha específica.
     */
    public List<HorarioDTO> obtenerHorariosDisponibles(Long doctorId, LocalDate fecha) {
        List<Horario> horarios = horarioRepository.findByDoctorIdAndFechaAndDisponibleTrue(doctorId, fecha);
        return horarios.stream()
                .map(horarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crear un nuevo horario.
     */
    public HorarioDTO crear(HorarioDTO dto) {
        // 1. Verificar que el doctor existe
        Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElse(null);
        if (doctor == null) {
            return null; // El doctor no existe
        }

        // 2. Convertir DTO a entidad
        Horario horario = horarioMapper.toEntity(dto);
        horario.setDoctor(doctor);

        // 3. Guardar en la base de datos
        Horario guardado = horarioRepository.save(horario);

        // 4. Devolver DTO
        return horarioMapper.toDTO(guardado);
    }

    /**
     * Actualizar un horario existente.
     */
    public HorarioDTO actualizar(Long id, HorarioDTO dto) {
        Horario horarioExistente = horarioRepository.findById(id).orElse(null);
        if (horarioExistente == null) {
            return null;
        }

        horarioExistente.setFecha(dto.getFecha());
        horarioExistente.setHoraInicio(dto.getHoraInicio());
        horarioExistente.setHoraFin(dto.getHoraFin());
        horarioExistente.setDisponible(dto.getDisponible());

        Horario actualizado = horarioRepository.save(horarioExistente);
        return horarioMapper.toDTO(actualizado);
    }

    /**
     * Cambiar disponibilidad de un horario.
     */
    public HorarioDTO cambiarDisponibilidad(Long id, Boolean disponible) {
        Horario horario = horarioRepository.findById(id).orElse(null);
        if (horario == null) {
            return null;
        }
        horario.setDisponible(disponible);
        Horario actualizado = horarioRepository.save(horario);
        return horarioMapper.toDTO(actualizado);
    }

    /**
     * Eliminar un horario por su ID.
     */
    public boolean eliminar(Long id) {
        if (!horarioRepository.existsById(id)) {
            return false;
        }
        horarioRepository.deleteById(id);
        return true;
    }
}