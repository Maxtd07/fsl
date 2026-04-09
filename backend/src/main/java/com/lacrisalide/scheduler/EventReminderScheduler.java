
package com.lacrisalide.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EventReminderScheduler {

 @Scheduled(cron = "0 0 8 * * *")
 public void checkEvents(){

  System.out.println("Checking events for reminders...");

 }

}
