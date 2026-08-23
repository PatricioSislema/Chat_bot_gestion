package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.EspecialidadDTO;
import ec.edu.iti.citasmedicas.backend.model.Especialidad;
import org.springframework.stereotype.Component;

@Component
public class EspecialidadMapper {

    public EspecialidadDTO toDTO(Especialidad especialidad) {
        if(especialidad == null) return null;
        return new EspecialidadDTO(
                especialidad.getId(),
                especialidad.getNombre()
        );
    }

    public Especialidad toEntity(EspecialidadDTO dto){
        if(dto == null) return null;
        Especialidad especialidad = new Especialidad();
        especialidad.setId(dto.getId());
        especialidad.setNombre(dto.getNombre());
        return especialidad;

    }
}
