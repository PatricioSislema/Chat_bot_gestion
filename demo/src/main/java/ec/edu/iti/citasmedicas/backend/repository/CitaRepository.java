package ec.edu.iti.citasmedicas.backend.repository;

import ec.edu.iti.citasmedicas.backend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repositorio para gestionar operaciones CRUD de la entidad Cita.
 */
@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    // Buscar citas por paciente
    List<Cita> findByPacienteId(Long pacienteId);

    // Buscar citas por doctor
    List<Cita> findByDoctorId(Long doctorId);

    // Buscar citas por fecha
    List<Cita> findByFecha(LocalDate fecha);

    // Buscar citas por estado
    List<Cita> findByEstado(String estado);

    // Buscar citas por paciente y estado
    List<Cita> findByPacienteIdAndEstado(Long pacienteId, String estado);

    List<Cita> findByDoctorIdAndFechaAndHora(Long doctorId, LocalDate fecha, LocalTime hora);

    boolean existsByDoctorId(Long doctorId);
}