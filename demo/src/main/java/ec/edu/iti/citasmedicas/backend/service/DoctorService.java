package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.DoctorDTO;
import ec.edu.iti.citasmedicas.backend.mapper.DoctorMapper;
import ec.edu.iti.citasmedicas.backend.model.Doctor;
import ec.edu.iti.citasmedicas.backend.model.Especialidad;
import ec.edu.iti.citasmedicas.backend.repository.DoctorRepository;
import ec.edu.iti.citasmedicas.backend.repository.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        // 1. Verificar que la especialidad existe
        Especialidad especialidad = especialidadRepository.findById(dto.getEspecialidad().getId())
                .orElse(null);
        if (especialidad == null) {
            return null; // La especialidad no existe
        }

        // 2. Convertir DTO a entidad
        Doctor doctor = doctorMapper.toEntity(dto);
        doctor.setEspecialidad(especialidad);

        // 3. Guardar en la base de datos
        Doctor guardado = doctorRepository.save(doctor);

        // 4. Devolver DTO
        return doctorMapper.toDTO(guardado);
    }

    /**
     * Actualizar un médico existente.
     */
    public DoctorDTO actualizar(Long id, DoctorDTO dto) {
        // 1. Buscar el médico existente
        Doctor doctorExistente = doctorRepository.findById(id).orElse(null);
        if (doctorExistente == null) {
            return null; // No existe el médico
        }

        // 2. Actualizar campos básicos
        doctorExistente.setNombre(dto.getNombre());
        doctorExistente.setApellido(dto.getApellido());
        doctorExistente.setSexo(dto.getSexo());
        doctorExistente.setFechaNacimiento(dto.getFechaNacimiento());
        doctorExistente.setDireccion(dto.getDireccion());
        doctorExistente.setTelefono(dto.getTelefono());
        doctorExistente.setFoto(dto.getFoto());

        // 3. Actualizar especialidad si se envió
        if (dto.getEspecialidad() != null && dto.getEspecialidad().getId() != null) {
            Especialidad especialidad = especialidadRepository.findById(dto.getEspecialidad().getId())
                    .orElse(null);
            if (especialidad != null) {
                doctorExistente.setEspecialidad(especialidad);
            }
        }

        // 4. Guardar cambios
        Doctor actualizado = doctorRepository.save(doctorExistente);

        // 5. Devolver DTO
        return doctorMapper.toDTO(actualizado);
    }

    /**
     * Eliminar un médico por su ID.
     */
    public boolean eliminar(Long id) {
        if (!doctorRepository.existsById(id)) {
            return false;
        }
        doctorRepository.deleteById(id);
        return true;
    }
}
