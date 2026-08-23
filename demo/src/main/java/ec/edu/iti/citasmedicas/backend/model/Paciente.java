package ec.edu.iti.citasmedicas.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa un paciente en el sistema.
 * Mapea la tabla 'pacientes' de la base de datos.
 */
@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // ID auto-incrementable

    @Column(nullable = false, length = 50)
    private String nombres;               // Nombres del paciente

    @Column(nullable = false, length = 50)
    private String apellidos;             // Apellidos del paciente

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;    // Fecha de nacimiento

    @Column(length = 1)
    private String sexo;                  // 'M' o 'F'

    @Column(length = 255)
    private String direccion;             // Dirección

    @Column(length = 20)
    private String telefono;              // Teléfono

    @Column(length = 100, unique = true)
    private String email;                 // Email (único)

    @Column(name = "telegram_id", length = 50, unique = true)
    private String telegramId;            // ID de Telegram (único)

    @Column(length = 255)
    private String foto;                  // URL de la foto (opcional)

    @Column(columnDefinition = "TEXT")
    private String medicamento;           // Medicamentos actuales

    @Column(columnDefinition = "TEXT")
    private String alergias;              // Alergias conocidas

    @Column(length = 20)
    private String estado;                // 'Activo' o 'Inactivo'
}