package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.HorarioDTO;
import ec.edu.iti.citasmedicas.backend.model.Horario;
import org.springframework.stereotype.Component;

@Component
public class HorarioMapper {

    public HorarioDTO toDTO(Horario horario) {
        if (horario == null) return null;
        HorarioDTO dto = new HorarioDTO();
        dto.setId(horario.getId());
        dto.setDoctorId(horario.getDoctor().getId());
        dto.setDoctorNombre(horario.getDoctor().getNombre() + " " + horario.getDoctor().getApellido());
        dto.setFecha(horario.getFecha());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setDisponible(horario.getDisponible());
        return dto;
    }

    public Horario toEntity(HorarioDTO dto) {
        if (dto == null) return null;
        Horario horario = new Horario();
        horario.setId(dto.getId());
        horario.setFecha(dto.getFecha());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());
        horario.setDisponible(dto.getDisponible());
        // El doctor se asigna en el controlador, no aquí
        return horario;
    }
}