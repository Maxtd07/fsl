
package com.lacrisalide.calendar;

import org.springframework.stereotype.Service;

@Service
public class CalendarService {

 public String generateICS(String title){

  return "BEGIN:VCALENDAR\nSUMMARY:" + title + "\nEND:VCALENDAR";

 }

}
