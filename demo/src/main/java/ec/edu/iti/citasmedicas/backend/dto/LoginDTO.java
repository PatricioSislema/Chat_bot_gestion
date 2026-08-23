package ec.edu.iti.citasmedicas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el login (lo que envía el frontend y devuelve el backend).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String username;
    private String password;
    private String token;  // Solo se usa en la respuesta
    private String rol;    // Solo se usa en la respuesta
}