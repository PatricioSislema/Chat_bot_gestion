package ec.edu.iti.citasmedicas.backend.service;

import ec.edu.iti.citasmedicas.backend.dto.EspecialidadDTO;
import ec.edu.iti.citasmedicas.backend.mapper.EspecialidadMapper;
import ec.edu.iti.citasmedicas.backend.model.Especialidad;
import ec.edu.iti.citasmedicas.backend.repository.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * El Service maneja la ligica de negocio paar las especialidades
 */
@Service
public class EspecialidadService {

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private EspecialidadMapper especialidadMapper;

    /**
     * Listar todas las especialidades
     */
    public List<EspecialidadDTO> listarTodas() {
        List<Especialidad> especialidades = especialidadRepository.findAll();
        return especialidades.stream()
                .map(especialidadMapper::toDTO)
                .collect(Collectors.toList());

    }

    /**
     * Obtener una especialidad por su id
     */
    public EspecialidadDTO obtenerPorId(Long id){
        Especialidad especialidad = especialidadRepository.findById(id).orElse(null);
        if(especialidad == null){
            return null;
        }
        return especialidadMapper.toDTO(especialidad);

    }
    /**
     * Crear una especialidad nueva
     */
    public EspecialidadDTO crear (EspecialidadDTO dto){
        Especialidad especialidad = especialidadMapper.toEntity(dto);
        Especialidad guardada = especialidadRepository.save(especialidad);
        return especialidadMapper.toDTO(guardada);
    }
    /**
     * Actualizar una especilaidad existente
     */
    public EspecialidadDTO actualizar(Long id, EspecialidadDTO dto){
        Especialidad especialidadExistente = especialidadRepository.findById(id).orElse(null);
        if(especialidadExistente == null){
            return null;
        }
        especialidadExistente.setNombre(dto.getNombre());
        Especialidad actualizada = especialidadRepository.save(especialidadExistente);
        return especialidadMapper.toDTO(actualizada);
    }

    /**
     * Eliminar una especialidad por su id
     */
    public boolean eliminar(Long id) {
        if (!especialidadRepository.existsById(id)) {
            return false;
        }
        especialidadRepository.deleteById(id);
        return true;
    }




}
