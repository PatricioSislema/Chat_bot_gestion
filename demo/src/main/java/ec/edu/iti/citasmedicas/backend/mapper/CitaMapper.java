package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.CitaDTO;
import ec.edu.iti.citasmedicas.backend.model.Cita;
import org.springframework.stereotype.Component;

@Component
public class CitaMapper {

    public CitaDTO toDTO(Cita cita) {
        if (cita == null) return null;
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setAsunto(cita.getAsunto());
        dto.setMotivo(cita.getMotivo());
        dto.setFecha(cita.getFecha());
        dto.setHora(cita.getHora());
        dto.setSintomas(cita.getSintomas());
        dto.setEnfermedades(cita.getEnfermedades());
        dto.setMedicamentos(cita.getMedicamentos());
        dto.setNotasAdicionales(cita.getNotasAdicionales());
        dto.setEstado(cita.getEstado());

        // Relaciones: paciente, doctor y horario
        if (cita.getPaciente() != null) {
            dto.setPacienteId(cita.getPaciente().getId());
            dto.setPacienteNombre(cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos());
        }

        if (cita.getDoctor() != null) {
            dto.setDoctorId(cita.getDoctor().getId());
            dto.setDoctorNombre(cita.getDoctor().getNombre() + " " + cita.getDoctor().getApellido());
        }

        if (cita.getHorario() != null) {
            dto.setHorarioId(cita.getHorario().getId());
        }

        return dto;
    }

    public Cita toEntity(CitaDTO dto) {
        if (dto == null) return null;
        Cita cita = new Cita();
        cita.setId(dto.getId());
        cita.setAsunto(dto.getAsunto());
        cita.setMotivo(dto.getMotivo());
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setSintomas(dto.getSintomas());
        cita.setEnfermedades(dto.getEnfermedades());
        cita.setMedicamentos(dto.getMedicamentos());
        cita.setNotasAdicionales(dto.getNotasAdicionales());
        cita.setEstado(dto.getEstado());
        // Las relaciones (paciente, doctor, horario) se asignan en el controlador
        return cita;
    }
}
