package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.PacienteDTO;
import ec.edu.iti.citasmedicas.backend.model.Paciente;
import org.springframework.stereotype.Component;

@Component
public class PacienteMapper {

    public PacienteDTO toDTO(Paciente paciente) {
        if (paciente == null) return null;
        PacienteDTO dto = new PacienteDTO();
        dto.setId(paciente.getId());
        dto.setNombres(paciente.getNombres());
        dto.setApellidos(paciente.getApellidos());
        dto.setFechaNacimiento(paciente.getFechaNacimiento());
        dto.setSexo(paciente.getSexo());
        dto.setDireccion(paciente.getDireccion());
        dto.setTelefono(paciente.getTelefono());
        dto.setEmail(paciente.getEmail());
        dto.setTelegramId(paciente.getTelegramId());
        dto.setFoto(paciente.getFoto());
        dto.setMedicamento(paciente.getMedicamento());
        dto.setAlergias(paciente.getAlergias());
        dto.setEstado(paciente.getEstado());
        return dto;
    }

    public Paciente toEntity(PacienteDTO dto) {
        if (dto == null) return null;
        Paciente paciente = new Paciente();
        paciente.setId(dto.getId());
        paciente.setNombres(dto.getNombres());
        paciente.setApellidos(dto.getApellidos());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setSexo(dto.getSexo());
        paciente.setDireccion(dto.getDireccion());
        paciente.setTelefono(dto.getTelefono());
        paciente.setEmail(dto.getEmail());
        paciente.setTelegramId(dto.getTelegramId());
        paciente.setFoto(dto.getFoto());
        paciente.setMedicamento(dto.getMedicamento());
        paciente.setAlergias(dto.getAlergias());
        paciente.setEstado(dto.getEstado());
        return paciente;
    }
}
