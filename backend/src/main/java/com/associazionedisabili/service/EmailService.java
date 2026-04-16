package com.associazionedisabili.service;

import com.associazionedisabili.dto.email.ContactRequest;
import com.associazionedisabili.model.Event;
import com.associazionedisabili.model.User;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

 private final JavaMailSender mailSender;
 private final CalendarInviteService calendarInviteService;

 @Value("${app.mail.from}")
 private String mailFrom;

 @Value("${spring.mail.host:}")
 private String mailHost;

 public boolean sendContactEmail(ContactRequest request) {
  if (!isMailConfigured()) {
   log.info("SMTP non configurato. Messaggio contatti ricevuto da {} <{}>: {}", request.nome(), request.email(), request.messaggio());
   return false;
  }

  try {
   SimpleMailMessage message = new SimpleMailMessage();
   message.setFrom(mailFrom);
   message.setTo(mailFrom);
   message.setReplyTo(request.email());
   message.setSubject("Nuovo messaggio dal sito - " + request.nome());
   message.setText("""
    Hai ricevuto un nuovo messaggio dal form contatti.

    Nome: %s
    Email: %s

    Messaggio:
    %s
    """.formatted(request.nome(), request.email(), request.messaggio()));
   mailSender.send(message);
   return true;
  } catch (MailException ex) {
   log.warn("Invio email contatti non riuscito", ex);
   return false;
  }
 }

 public boolean sendBookingConfirmation(User user, Event event) {
  if (!isMailConfigured()) {
   log.info("SMTP non configurato. Conferma iscrizione non inviata a {}", user.getEmail());
   return false;
  }

  try {
   MimeMessage message = mailSender.createMimeMessage();
   MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
   helper.setFrom(mailFrom);
   helper.setTo(user.getEmail());
   helper.setSubject("Iscrizione confermata: " + event.getTitolo());
   helper.setText(buildBookingEmailBody(user, event), true);
   helper.addAttachment(
    calendarInviteService.buildFileName(event),
    new ByteArrayResource(calendarInviteService.buildEventInvite(event)),
    "text/calendar"
   );
   mailSender.send(message);
   return true;
  } catch (Exception ex) {
   log.warn("Invio email di promemoria non riuscito per {}", user.getEmail(), ex);
   return false;
  }
 }

 private boolean isMailConfigured() {
  return mailHost != null && !mailHost.isBlank();
 }

 private String buildBookingEmailBody(User user, Event event) {
  return """
   <html>
    <body style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.6;">
     <h2>Ciao %s, la tua iscrizione è confermata</h2>
     <p>Ti aspettiamo al prossimo evento dell'Associazione.</p>
     <p><strong>Evento:</strong> %s</p>
     <p><strong>Data:</strong> %s</p>
     <p><strong>Luogo:</strong> %s</p>
     <p><strong>Dettagli:</strong> %s</p>
     <p>In allegato trovi il file calendario <strong>.ics</strong>, compatibile con Google Calendar, Apple Calendar e altri client.</p>
    </body>
   </html>
   """.formatted(
   user.getNome(),
   event.getTitolo(),
   event.getData(),
   event.getLuogo(),
   event.getDescrizione()
  );
 }
}
