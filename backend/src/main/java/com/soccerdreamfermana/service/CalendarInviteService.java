package com.soccerdreamfermana.service;

import com.soccerdreamfermana.model.Event;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CalendarInviteService {

 private static final ZoneId EVENT_ZONE = ZoneId.of("Europe/Rome");
 private static final DateTimeFormatter ICS_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'", Locale.ITALY);

 public byte[] buildEventInvite(Event event) {
  LocalDateTime endDate = event.getDataFine() != null ? event.getDataFine() : event.getData().plusHours(2);

  String ics = String.join("\r\n",
   "BEGIN:VCALENDAR",
   "VERSION:2.0",
   "PRODID:-//Associazione Disabili//Eventi//IT",
   "CALSCALE:GREGORIAN",
   "METHOD:PUBLISH",
   "BEGIN:VEVENT",
   "UID:event-" + event.getId() + "@soccerdreamfermana.local",
   "DTSTAMP:" + toUtc(LocalDateTime.now()),
   "DTSTART:" + toUtc(event.getData()),
   "DTEND:" + toUtc(endDate),
   "SUMMARY:" + escape(event.getTitolo()),
   "DESCRIPTION:" + escape(event.getDescrizione()),
   "LOCATION:" + escape(event.getLuogo()),
   "END:VEVENT",
   "END:VCALENDAR",
   ""
  );

  return ics.getBytes(StandardCharsets.UTF_8);
 }

 public String buildFileName(Event event) {
  String slug = event.getTitolo().toLowerCase(Locale.ITALY).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
  return (slug.isBlank() ? "evento" : slug) + ".ics";
 }

 private String toUtc(LocalDateTime dateTime) {
  return dateTime.atZone(EVENT_ZONE).withZoneSameInstant(ZoneOffset.UTC).format(ICS_FORMATTER);
 }

 private String escape(String value) {
  if (value == null) {
   return "";
  }
  return value
   .replace("\\", "\\\\")
   .replace(",", "\\,")
   .replace(";", "\\;")
   .replace("\n", "\\n");
 }
}

