package ec.edu.iti.citasmedicas.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa un médico/doctor en el sistema.
 * Mapea la tabla 'doctores' de la base de datos.
 */
@Entity
@Table(name = "doctores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // ID auto-incrementable

    @Column(nullable = false, length = 50)
    private String nombre;                // Nombre del doctor

    @Column(nullable = false, length = 50)
    private String apellido;              // Apellido del doctor

    @Column(length = 1)
    private String sexo;                  // 'M' o 'F'

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;    // Fecha de nacimiento

    @Column(length = 255)
    private String direccion;             // Dirección

    @Column(length = 20)
    private String telefono;              // Teléfono

    @Column(length = 255)
    private String foto;                  // URL de la foto

    @ManyToOne
    @JoinColumn(name = "id_especialidad", nullable = false)
    private Especialidad especialidad;    // Relación con Especialidad (ManyToOne)
}