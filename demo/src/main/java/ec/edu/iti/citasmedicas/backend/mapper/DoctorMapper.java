package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.DoctorDTO;
import ec.edu.iti.citasmedicas.backend.model.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {

    @Autowired
    private EspecialidadMapper especialidadMapper;

    public DoctorDTO toDTO(Doctor doctor) {
        if (doctor == null) return null;
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setNombre(doctor.getNombre());
        dto.setApellido(doctor.getApellido());
        dto.setSexo(doctor.getSexo());
        dto.setDireccion(doctor.getDireccion());
        dto.setTelefono(doctor.getTelefono());
        dto.setFoto(doctor.getFoto());
        dto.setEspecialidad(especialidadMapper.toDTO(doctor.getEspecialidad()));
        return dto;
    }

    public Doctor toEntity(DoctorDTO dto) {
        if (dto == null) return null;
        Doctor doctor = new Doctor();
        doctor.setId(dto.getId());
        doctor.setNombre(dto.getNombre());
        doctor.setApellido(dto.getApellido());
        doctor.setSexo(dto.getSexo());
       // doctor.setFechaNacimiento(dto.getFechaNacimiento());
        doctor.setDireccion(dto.getDireccion());
        doctor.setTelefono(dto.getTelefono());
        doctor.setFoto(dto.getFoto());
        // La especialidad se asigna en el controlador, no aquí
        return doctor;
    }
}
