package ec.edu.iti.citasmedicas.backend.telegram;

import ec.edu.iti.citasmedicas.backend.dto.CitaDTO;
import ec.edu.iti.citasmedicas.backend.dto.DoctorDTO;
import ec.edu.iti.citasmedicas.backend.dto.EspecialidadDTO;
import ec.edu.iti.citasmedicas.backend.dto.HorarioDTO;
import ec.edu.iti.citasmedicas.backend.dto.PacienteDTO;
import ec.edu.iti.citasmedicas.backend.service.CitaService;
import ec.edu.iti.citasmedicas.backend.service.DoctorService;
import ec.edu.iti.citasmedicas.backend.service.EspecialidadService;
import ec.edu.iti.citasmedicas.backend.service.HorarioService;
import ec.edu.iti.citasmedicas.backend.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CitaBot extends TelegramLongPollingBot {

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${clinica.direccion:Av. Principal 123, Quito - Ecuador}")
    private String direccionClinica;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private CitaService citaService;

    @Autowired
    private EspecialidadService especialidadService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private HorarioService horarioService;
    private List<HorarioDTO> horariosCache;

    private final Map<String, Integer> userStep = new HashMap<>();
    private final Map<String, Map<String, String>> userData = new HashMap<>();
    private List<EspecialidadDTO> especialidadesCache;

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();
            String userId = update.getMessage().getFrom().getId().toString();

            System.out.println("Mensaje: " + messageText + " | Usuario: " + userId + " | Paso: " + userStep.get(userId));

            String response = processMessage(messageText, userId);
            sendMessage(chatId, response);
        }
    }

    private String processMessage(String message, String userId) {
        // SALIR
        if (message.equalsIgnoreCase("2") && userStep.get(userId) != null && userStep.get(userId) == 99) {
            userStep.remove(userId);
            userData.remove(userId);
            return "Gracias por usar nuestro servicio. ¡Que tengas un buen día!";
        }

        // NUEVO TRAMITE
        if (message.equalsIgnoreCase("1") && userStep.get(userId) != null && userStep.get(userId) == 99) {
            userStep.remove(userId);
            userData.remove(userId);
            return getMainMenu();
        }

        // /start
        if (message.equals("/start")) {
            userStep.remove(userId);
            userData.remove(userId);
            return getMainMenu();
        }

        Integer step = userStep.get(userId);

        // MENU PRINCIPAL
        if (step == null) {
            if (message.equalsIgnoreCase("1")) {
                PacienteDTO paciente = pacienteService.buscarPorTelegramId(userId);
                if (paciente == null) {
                    userData.put(userId, new HashMap<>());
                    userStep.put(userId, 0);
                    return "Registro de paciente\n\nCual es tu nombre?";
                } else {
                    userData.put(userId, new HashMap<>());
                    userStep.put(userId, 7);
                    return getMenuEspecialidades();
                }
            } else if (message.equalsIgnoreCase("2")) {
                return getMisCitas(userId);
            } else if (message.equalsIgnoreCase("3")) {
                return getCancelarCitaMenu(userId);
            } else {
                return getMainMenu();
            }
        }

        // CANCELAR CITA
        if (step == 98) {
            try {
                Long citaId = Long.parseLong(message);
                boolean cancelada = citaService.cancelarCita(citaId);
                if (cancelada) {
                    userStep.put(userId, 99);
                    return "Cita cancelada con exito.\n\nElige una opcion:\n1. Nuevo tramite\n2. Salir";
                } else {
                    return "No se pudo cancelar la cita. Verifica el ID.\n\nEscribe 3 para intentar de nuevo.";
                }
            } catch (NumberFormatException e) {
                return "ID no valido. Escribe el numero de la cita que deseas cancelar.";
            }
        }

        Map<String, String> data = userData.get(userId);

        // REGISTRO: PASOS 0-6
        if (step == 0) {
            data.put("nombre", message);
            userStep.put(userId, 1);
            return "Nombre guardado.\n\nCual es tu apellido?";
        }
        if (step == 1) {
            data.put("apellido", message);
            userStep.put(userId, 2);
            return "Apellido guardado.\n\nCual es tu fecha de nacimiento?\nFormato: DD/MM/YYYY (Ej: 15/05/1990)";
        }
        if (step == 2) {
            String fechaNacimiento = message;
            if (!fechaNacimiento.matches("\\d{2}/\\d{2}/\\d{4}")) {
                return "Formato incorrecto. Usa DD/MM/YYYY.";
            }
            try {
                LocalDate.parse(fechaNacimiento, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } catch (Exception e) {
                return "Fecha no valida. Ejemplo: 15/05/1990";
            }
            data.put("fechaNacimiento", fechaNacimiento);
            userStep.put(userId, 3);
            return "Fecha guardada.\n\nCual es tu sexo?\nEscribe M (Masculino) o F (Femenino)";
        }
        if (step == 3) {
            String sexo = message.toUpperCase();
            if (!sexo.equals("M") && !sexo.equals("F")) {
                return "Opcion no valida. Escribe M o F.";
            }
            data.put("sexo", sexo);
            userStep.put(userId, 4);
            return "Sexo guardado.\n\nCual es tu numero de telefono?\n(Ej: 0987654321)";
        }
        if (step == 4) {
            String telefono = message;
            if (!telefono.matches("\\d{10}")) {
                return "Numero de telefono no valido. Debe tener 10 digitos.";
            }
            data.put("telefono", telefono);
            userStep.put(userId, 5);
            return "Telefono guardado.\n\nCual es tu correo electronico?\n(Opcional - escribe omitir)";
        }
        if (step == 5) {
            String email = message;
            if (!email.equalsIgnoreCase("omitir") && !email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                return "Correo no valido. Ejemplo: usuario@correo.com\nO escribe omitir";
            }
            data.put("email", email.equalsIgnoreCase("omitir") ? "" : email);
            userStep.put(userId, 6);
            return "Correo guardado.\n\nCual es tu direccion?\n(Opcional - escribe omitir)";
        }
        if (step == 6) {
            String direccion = message;
            data.put("direccion", direccion.equalsIgnoreCase("omitir") ? "" : direccion);

            PacienteDTO nuevoPaciente = new PacienteDTO();
            nuevoPaciente.setNombres(data.get("nombre"));
            nuevoPaciente.setApellidos(data.get("apellido"));
            nuevoPaciente.setFechaNacimiento(LocalDate.parse(data.get("fechaNacimiento"), DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            nuevoPaciente.setSexo(data.get("sexo"));
            nuevoPaciente.setTelefono(data.get("telefono"));
            nuevoPaciente.setEmail(data.get("email"));
            nuevoPaciente.setDireccion(data.get("direccion"));
            nuevoPaciente.setTelegramId(userId);
            nuevoPaciente.setEstado("Activo");
            pacienteService.crear(nuevoPaciente);

            userStep.put(userId, 7);
            return "Registro exitoso!\n\n" +
                    "Nombre: " + data.get("nombre") + " " + data.get("apellido") + "\n" +
                    "Fecha nac.: " + data.get("fechaNacimiento") + "\n" +
                    "Sexo: " + (data.get("sexo").equals("M") ? "Masculino" : "Femenino") + "\n" +
                    "Telefono: " + data.get("telefono") + "\n" +
                    "Email: " + (data.get("email").isEmpty() ? "No registrado" : data.get("email")) + "\n" +
                    "Direccion: " + (data.get("direccion").isEmpty() ? "No registrada" : data.get("direccion")) + "\n\n" +
                    "Ahora puedes agendar una cita.\n\n" +
                    getMenuEspecialidades();
        }

        // ============================================
        // AGENDAMIENTO: PASOS 7-9
        // ============================================
        switch (step) {
            case 7: // Especialidad
                if (especialidadesCache == null) {
                    especialidadesCache = especialidadService.listarTodas();
                }
                try {
                    int index = Integer.parseInt(message) - 1;
                    if (index < 0 || index >= especialidadesCache.size()) {
                        return "Opcion no valida. Elige un numero del 1 al " + especialidadesCache.size() + ".";
                    }
                    EspecialidadDTO especialidad = especialidadesCache.get(index);
                    data.put("especialidadId", String.valueOf(especialidad.getId()));
                    data.put("especialidad", especialidad.getNombre());

                    // Verificar si hay doctores con disponibilidad en los próximos 7 días
                    List<DoctorDTO> doctores = doctorService.listarTodos().stream()
                            .filter(d -> d.getEspecialidad().getId().equals(especialidad.getId()))
                            .collect(Collectors.toList());

                    if (doctores.isEmpty()) {
                        return "No hay doctores disponibles en esta especialidad.\n\nElige otra especialidad:\n" + getMenuEspecialidades();
                    }

                    // Verificar si algún doctor tiene horarios disponibles en los próximos 7 días
                    boolean hayDisponibilidad = false;
                    for (DoctorDTO doctor : doctores) {
                        for (int i = 1; i <= 7; i++) {
                            LocalDate fecha = LocalDate.now().plusDays(i);
                            List<HorarioDTO> horarios = horarioService.obtenerHorariosDisponibles(doctor.getId(), fecha);
                            if (!horarios.isEmpty()) {
                                hayDisponibilidad = true;
                                break;
                            }
                        }
                        if (hayDisponibilidad) break;
                    }

                    if (!hayDisponibilidad) {
                        return "No hay disponibilidad en esta especialidad en los proximos 7 dias.\n\nElige otra especialidad:\n" + getMenuEspecialidades();
                    }

                    userStep.put(userId, 8);
                    return "Especialidad: " + especialidad.getNombre() + "\n\nPaso 2/2\n\n" + getMenuFechas();
                } catch (NumberFormatException e) {
                    return "Opcion no valida. Elige un numero del 1 al " + especialidadesCache.size() + ".";
                }

            case 8: // Fecha
                String fechaStr = getFecha(message);
                if (fechaStr == null) {
                    return "Opcion no valida. Elige un numero del 1 al 3.";
                }
                data.put("fecha", fechaStr);

                LocalDate fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                Long especialidadId = Long.parseLong(data.get("especialidadId"));

                // Buscar doctores de esa especialidad con horarios disponibles para esa fecha
                List<DoctorDTO> doctoresDisponibles = doctorService.listarTodos().stream()
                        .filter(d -> d.getEspecialidad().getId().equals(especialidadId))
                        .filter(d -> {
                            List<HorarioDTO> horarios = horarioService.obtenerHorariosDisponibles(d.getId(), fecha);
                            return !horarios.isEmpty();
                        })
                        .collect(Collectors.toList());

                if (doctoresDisponibles.isEmpty()) {
                    return "No hay horarios disponibles en esta especialidad para la fecha seleccionada.\n\nElige otra fecha:\n" + getMenuFechas();
                }

                // Tomar el primer doctor disponible
                DoctorDTO doctorAsignado = doctoresDisponibles.get(0);
                List<HorarioDTO> horarios = horarioService.obtenerHorariosDisponibles(doctorAsignado.getId(), fecha);

                data.put("medico", doctorAsignado.getNombre() + " " + doctorAsignado.getApellido());
                data.put("doctorId", String.valueOf(doctorAsignado.getId()));

                horariosCache = horarios;
                userStep.put(userId, 9);
                return "Fecha: " + fechaStr + "\nMedico asignado: " + doctorAsignado.getNombre() + " " + doctorAsignado.getApellido() + "\n\n" + getMenuHorarios();

            case 9: // Horario
                try {
                    int index = Integer.parseInt(message) - 1;
                    if (index < 0 || index >= horariosCache.size()) {
                        return "Opcion no valida. Elige un numero del 1 al " + horariosCache.size() + ".";
                    }
                    HorarioDTO horario = horariosCache.get(index);

                    LocalDate fechaCita = LocalDate.parse(data.get("fecha"), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                    LocalTime hora = horario.getHoraInicio();
                    Long doctorId = Long.parseLong(data.get("doctorId"));

                    // Validar duplicado
                    if (citaService.existeCitaEnHorario(doctorId, fechaCita, hora)) {
                        horariosCache = horarioService.obtenerHorariosDisponibles(doctorId, fechaCita);
                        if (horariosCache.isEmpty()) {
                            return "El horario seleccionado ya esta ocupado y no hay mas disponibilidad para esta fecha.\n\nElige otra fecha:\n" + getMenuFechas();
                        }
                        return "El horario seleccionado ya esta ocupado. Por favor, elige otro:\n\n" + getMenuHorarios();
                    }

                    PacienteDTO paciente = pacienteService.buscarPorTelegramId(userId);
                    if (paciente == null) {
                        userStep.remove(userId);
                        userData.remove(userId);
                        return "Error: No estas registrado. Escribe /start para reiniciar.";
                    }

                    // Crear cita
                    CitaDTO citaDTO = new CitaDTO();
                    citaDTO.setPacienteId(paciente.getId());
                    citaDTO.setDoctorId(doctorId);
                    citaDTO.setFecha(fechaCita);
                    citaDTO.setHora(hora);
                    citaDTO.setAsunto("Consulta");
                    citaDTO.setMotivo("Agendada desde Telegram");
                    citaDTO.setEstado("Agendada");
                    citaService.crear(citaDTO);

                    horarioService.cambiarDisponibilidad(horario.getId(), false);

                    userStep.put(userId, 99);
                    return "Cita agendada con exito!\n\n" +
                            "Paciente: " + paciente.getNombres() + " " + paciente.getApellidos() + "\n" +
                            "Especialidad: " + data.get("especialidad") + "\n" +
                            "Medico: " + data.get("medico") + "\n" +
                            "Fecha: " + data.get("fecha") + "\n" +
                            "Hora: " + horario.getHoraInicio() + " - " + horario.getHoraFin() + "\n" +
                            "Direccion: " + direccionClinica + "\n" +
                            "Llegar con 30 minutos de anticipacion.\n\n" +
                            "Elige una opcion:\n1. Nuevo tramite\n2. Salir";

                } catch (NumberFormatException e) {
                    return "Opcion no valida. Elige un numero del 1 al " + horariosCache.size() + ".";
                }

            default:
                userStep.remove(userId);
                userData.remove(userId);
                return getMainMenu();
        }
    }

    // ============================================
    // METODOS AUXILIARES
    // ============================================

    private String getMainMenu() {
        return "Bienvenido a Salud Para Todos\n\n" +
                "Elige una opcion:\n" +
                "1. Agendar cita\n" +
                "2. Ver mis citas\n" +
                "3. Cancelar cita\n\n" +
                "Escribe el numero de la opcion (1, 2 o 3).";
    }

    private String getMenuEspecialidades() {
        if (especialidadesCache == null) {
            especialidadesCache = especialidadService.listarTodas();
        }
        StringBuilder menu = new StringBuilder("Paso 1/2 - Elige una especialidad:\n");
        int i = 1;
        for (EspecialidadDTO esp : especialidadesCache) {
            menu.append(i).append(". ").append(esp.getNombre()).append("\n");
            i++;
        }
        menu.append("\nEscribe el numero de la especialidad.");
        return menu.toString();
    }

    private String getMenuFechas() {
        return "Paso 2/2 - Elige una fecha:\n" +
                "1. " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " (Hoy)\n" +
                "2. " + LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                "3. " + LocalDate.now().plusDays(2).format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n\n" +
                "Escribe el numero de la fecha (1, 2 o 3).";
    }

    private String getMenuHorarios() {
        if (horariosCache == null || horariosCache.isEmpty()) {
            return "No hay horarios disponibles.";
        }
        StringBuilder menu = new StringBuilder("Elige una hora:\n");
        int i = 1;
        for (HorarioDTO h : horariosCache) {
            menu.append(i).append(". ").append(h.getHoraInicio()).append(" - ").append(h.getHoraFin()).append("\n");
            i++;
        }
        menu.append("\nEscribe el numero del horario.");
        return menu.toString();
    }

    private String getFecha(String message) {
        switch (message) {
            case "1": return LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            case "2": return LocalDate.now().plusDays(2).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            case "3": return LocalDate.now().plusDays(3).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            default: return null;
        }
    }

    private String getMisCitas(String userId) {
        PacienteDTO paciente = pacienteService.buscarPorTelegramId(userId);
        if (paciente == null) {
            return "No estas registrado. Escribe 1 para agendar y registrarte.";
        }
        List<CitaDTO> citas = citaService.listarPorPaciente(paciente.getId());
        if (citas.isEmpty()) {
            userStep.put(userId, 99);
            return "No tienes citas agendadas.\n\nElige una opcion:\n1. Nuevo tramite\n2. Salir";
        }
        StringBuilder response = new StringBuilder("Tus citas agendadas:\n\n");
        for (CitaDTO cita : citas) {
            response.append("ID: ").append(cita.getId()).append("\n");
            response.append("   Fecha: ").append(cita.getFecha()).append("\n");
            response.append("   Hora: ").append(cita.getHora()).append("\n");
            response.append("   Medico: ").append(cita.getDoctorNombre()).append("\n");
            response.append("   Direccion: ").append(direccionClinica).append("\n");
            response.append("   Llegar 30 min antes.\n\n");
        }
        userStep.put(userId, 99);
        response.append("Elige una opcion:\n1. Nuevo tramite\n2. Salir");
        return response.toString();
    }

    private String getCancelarCitaMenu(String userId) {
        PacienteDTO paciente = pacienteService.buscarPorTelegramId(userId);
        if (paciente == null) {
            return "No estas registrado. Escribe 1 para registrarte.";
        }
        List<CitaDTO> citas = citaService.listarPorPaciente(paciente.getId());
        if (citas.isEmpty()) {
            userStep.put(userId, 99);
            return "No tienes citas para cancelar.\n\nElige una opcion:\n1. Nuevo tramite\n2. Salir";
        }
        StringBuilder response = new StringBuilder("Para cancelar una cita, escribe el ID de la cita:\n\n");
        for (CitaDTO cita : citas) {
            response.append("ID: ").append(cita.getId())
                    .append(" - ").append(cita.getFecha())
                    .append(" - ").append(cita.getHora())
                    .append(" - ").append(cita.getDoctorNombre()).append("\n");
        }
        response.append("\nEscribe el ID de la cita que deseas cancelar.");
        userStep.put(userId, 98);
        return response.toString();
    }

    private void sendMessage(long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        ReplyKeyboardRemove removeKeyboard = new ReplyKeyboardRemove();
        removeKeyboard.setRemoveKeyboard(true);
        message.setReplyMarkup(removeKeyboard);
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}