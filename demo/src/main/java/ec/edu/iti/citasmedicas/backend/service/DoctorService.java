package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.DoctorDTO;
import ec.edu.iti.citasmedicas.backend.mapper.DoctorMapper;
import ec.edu.iti.citasmedicas.backend.model.Doctor;
import ec.edu.iti.citasmedicas.backend.model.Especialidad;
import ec.edu.iti.citasmedicas.backend.repository.DoctorRepository;
import ec.edu.iti.citasmedicas.backend.repository.EspecialidadRepository;
import ec.edu.iti.citasmedicas.backend.repository.CitaRepository; // 🔥 NUEVO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 🔥 NUEVO

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de negocio para los médicos.
 */
@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private DoctorMapper doctorMapper;

    @Autowired
    private CitaRepository citaRepository; // 🔥 NUEVO

    /**
     * Listar todos los médicos.
     */
    public List<DoctorDTO> listarTodos() {
        List<Doctor> doctores = doctorRepository.findAll();
        return doctores.stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener un médico por su ID.
     */
    public DoctorDTO obtenerPorId(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            return null;
        }
        return doctorMapper.toDTO(doctor);
    }

    /**
     * Crear un nuevo médico.
     */
    public DoctorDTO crear(DoctorDTO dto) {
        Especialidad especialidad = especialidadRepository.findById(dto.getEspecialidad().getId())
                .orElse(null);
        if (especialidad == null) {
            return null;
        }

        Doctor doctor = doctorMapper.toEntity(dto);
        doctor.setEspecialidad(especialidad);

        Doctor guardado = doctorRepository.save(doctor);
        return doctorMapper.toDTO(guardado);
    }

    /**
     * Actualizar un médico existente.
     */
    public DoctorDTO actualizar(Long id, DoctorDTO dto) {
        Doctor doctorExistente = doctorRepository.findById(id).orElse(null);
        if (doctorExistente == null) {
            return null;
        }

        doctorExistente.setNombre(dto.getNombre());
        doctorExistente.setApellido(dto.getApellido());
        doctorExistente.setSexo(dto.getSexo());
        doctorExistente.setFechaNacimiento(dto.getFechaNacimiento());
        doctorExistente.setDireccion(dto.getDireccion());
        doctorExistente.setTelefono(dto.getTelefono());
        doctorExistente.setFoto(dto.getFoto());

        if (dto.getEspecialidad() != null && dto.getEspecialidad().getId() != null) {
            Especialidad especialidad = especialidadRepository.findById(dto.getEspecialidad().getId())
                    .orElse(null);
            if (especialidad != null) {
                doctorExistente.setEspecialidad(especialidad);
            }
        }

        Doctor actualizado = doctorRepository.save(doctorExistente);
        return doctorMapper.toDTO(actualizado);
    }

    /**
     * Eliminar un médico por su ID.
     * 🔥 Verifica si tiene citas asociadas antes de eliminar.
     */
    @Transactional
    public boolean eliminar(Long id) {
        if (!doctorRepository.existsById(id)) {
            return false;
        }

        // 🔥 VERIFICAR SI TIENE CITAS ASOCIADAS
        if (citaRepository.existsByDoctorId(id)) {
            throw new RuntimeException("El médico tiene citas asociadas y no puede ser eliminado.");
        }

        doctorRepository.deleteById(id);
        return true;
    }
}