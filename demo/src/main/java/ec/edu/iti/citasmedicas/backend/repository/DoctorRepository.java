package ec.edu.iti.citasmedicas.backend.repository;


import ec.edu.iti.citasmedicas.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para gestionar operaciones CRUD dela entidad Doctor
 */

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {


}
