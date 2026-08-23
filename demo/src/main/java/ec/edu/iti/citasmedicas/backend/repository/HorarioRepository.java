package ec.edu.iti.citasmedicas.backend.repository;

import ec.edu.iti.citasmedicas.backend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para gestionar operaciones CRUD de la entidad Horario.
 */
@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    // Buscar horarios disponibles por doctor y fecha
    List<Horario> findByDoctorIdAndFechaAndDisponibleTrue(Long doctorId, LocalDate fecha);

    // Buscar horarios por doctor
    List<Horario> findByDoctorId(Long doctorId);
}