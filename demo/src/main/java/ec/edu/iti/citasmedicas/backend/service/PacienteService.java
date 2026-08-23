package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.PacienteDTO;
import ec.edu.iti.citasmedicas.backend.mapper.PacienteMapper;
import ec.edu.iti.citasmedicas.backend.model.Paciente;
import ec.edu.iti.citasmedicas.backend.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de negocio para los pacientes.
 */
@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PacienteMapper pacienteMapper;

    /**
     * Listar todos los pacientes.
     */
    public List<PacienteDTO> listarTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        return pacientes.stream()
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener un paciente por su ID.
     */
    public PacienteDTO obtenerPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id).orElse(null);
        if (paciente == null) {
            return null;
        }
        return pacienteMapper.toDTO(paciente);
    }

    /**
     * Buscar paciente por Telegram ID.
     */
    public PacienteDTO buscarPorTelegramId(String telegramId) {
        Paciente paciente = pacienteRepository.findByTelegramId(telegramId).orElse(null);
        if (paciente == null) {
            return null;
        }
        return pacienteMapper.toDTO(paciente);
    }

    /**
     * Crear un nuevo paciente.
     */
    public PacienteDTO crear(PacienteDTO dto) {
        Paciente paciente = pacienteMapper.toEntity(dto);
        Paciente guardado = pacienteRepository.save(paciente);
        return pacienteMapper.toDTO(guardado);
    }

    /**
     * Actualizar un paciente existente.
     */
    public PacienteDTO actualizar(Long id, PacienteDTO dto) {
        Paciente pacienteExistente = pacienteRepository.findById(id).orElse(null);
        if (pacienteExistente == null) {
            return null;
        }

        pacienteExistente.setNombres(dto.getNombres());
        pacienteExistente.setApellidos(dto.getApellidos());
        pacienteExistente.setFechaNacimiento(dto.getFechaNacimiento());
        pacienteExistente.setSexo(dto.getSexo());
        pacienteExistente.setDireccion(dto.getDireccion());
        pacienteExistente.setTelefono(dto.getTelefono());
        pacienteExistente.setEmail(dto.getEmail());
        pacienteExistente.setTelegramId(dto.getTelegramId());
        pacienteExistente.setFoto(dto.getFoto());
        pacienteExistente.setMedicamento(dto.getMedicamento());
        pacienteExistente.setAlergias(dto.getAlergias());
        pacienteExistente.setEstado(dto.getEstado());

        Paciente actualizado = pacienteRepository.save(pacienteExistente);
        return pacienteMapper.toDTO(actualizado);
    }

    /**
     * Eliminar un paciente por su ID.
     */
    public boolean eliminar(Long id) {
        if (!pacienteRepository.existsById(id)) {
            return false;
        }
        pacienteRepository.deleteById(id);
        return true;
    }

    /**
     * Cambiar el estado de un paciente (Activo/Inactivo).
     */
    public PacienteDTO cambiarEstado(Long id, String nuevoEstado) {
        Paciente paciente = pacienteRepository.findById(id).orElse(null);
        if (paciente == null) {
            return null;
        }
        paciente.setEstado(nuevoEstado);
        Paciente actualizado = pacienteRepository.save(paciente);
        return pacienteMapper.toDTO(actualizado);
    }
}
