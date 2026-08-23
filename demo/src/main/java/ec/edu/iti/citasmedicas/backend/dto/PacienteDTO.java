package ec.edu.iti.citasmedicas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String direccion;
    private String telefono;
    private String email;
    private String telegramId;
    private String foto;
    private String medicamento;
    private String alergias;
    private String estado;
}
