package com.lacrisalide.payment;

import com.lacrisalide.dto.donation.CapturePaymentResponse;
import com.lacrisalide.dto.donation.CreatePaymentRequest;
import com.lacrisalide.dto.donation.CreatePaymentResponse;
import com.lacrisalide.exception.BadRequestException;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class PayPalAdapter implements PaymentAdapter {

 private final RestTemplate restTemplate;

 @Value("${paypal.client-id:}")
 private String clientId;

 @Value("${paypal.client-secret:}")
 private String clientSecret;

 @Value("${paypal.base-url}")
 private String baseUrl;

 @Value("${paypal.currency:EUR}")
 private String currency;

 @Override
 public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
  ensureConfigured();

  HttpHeaders headers = bearerHeaders(fetchAccessToken());
  headers.setContentType(MediaType.APPLICATION_JSON);

  Map<String, Object> payload = Map.of(
   "intent", "CAPTURE",
   "purchase_units", List.of(
    Map.of(
     "description", "Donazione La Crisalide - " + request.nome(),
     "amount", Map.of(
      "currency_code", currency,
      "value", formatAmount(request.importo())
     )
    )
   ),
   "payment_source", Map.of(
    "paypal", Map.of(
     "experience_context", Map.of(
      "payment_method_preference", "IMMEDIATE_PAYMENT_REQUIRED",
      "shipping_preference", "NO_SHIPPING",
      "user_action", "PAY_NOW"
     )
    )
   )
  );

  try {
   ResponseEntity<Map> response = restTemplate.exchange(
    baseUrl + "/v2/checkout/orders",
    HttpMethod.POST,
    new HttpEntity<>(payload, headers),
    Map.class
   );

   Map<String, Object> body = response.getBody();
   if (body == null) {
    throw new BadRequestException("PayPal non ha restituito una risposta valida");
   }

   return new CreatePaymentResponse(
    stringValue(body.get("id")),
    stringValue(body.get("status")),
    extractApprovalUrl(body)
   );
  } catch (RestClientException ex) {
   throw new BadRequestException("Errore durante la creazione dell'ordine PayPal");
  }
 }

 @Override
 public CapturePaymentResponse capturePayment(String orderId) {
  ensureConfigured();

  HttpHeaders headers = bearerHeaders(fetchAccessToken());
  headers.setContentType(MediaType.APPLICATION_JSON);

  try {
   ResponseEntity<Map> response = restTemplate.exchange(
    baseUrl + "/v2/checkout/orders/" + orderId + "/capture",
    HttpMethod.POST,
    new HttpEntity<>(headers),
    Map.class
   );

   Map<String, Object> body = response.getBody();
   if (body == null) {
    throw new BadRequestException("PayPal non ha restituito i dettagli della cattura");
   }

   Map<String, Object> payer = castMap(body.get("payer"));
   List<Map<String, Object>> purchaseUnits = castList(body.get("purchase_units"));
   Map<String, Object> payments = purchaseUnits.isEmpty() ? Map.of() : castMap(purchaseUnits.get(0).get("payments"));
   List<Map<String, Object>> captures = payments.isEmpty() ? List.of() : castList(payments.get("captures"));
   Map<String, Object> firstCapture = captures.isEmpty() ? Map.of() : captures.get(0);

   return new CapturePaymentResponse(
    stringValue(body.get("id")),
    stringValue(body.get("status")),
    stringValue(payer.get("payer_id")),
    stringValue(firstCapture.get("id"))
   );
  } catch (RestClientException ex) {
   throw new BadRequestException("Errore durante la cattura del pagamento PayPal");
  }
 }

 private String fetchAccessToken() {
  HttpHeaders headers = new HttpHeaders();
  headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
  headers.set(
   HttpHeaders.AUTHORIZATION,
   "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8))
  );

  MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
  body.add("grant_type", "client_credentials");

  try {
   ResponseEntity<Map> response = restTemplate.exchange(
    baseUrl + "/v1/oauth2/token",
    HttpMethod.POST,
    new HttpEntity<>(body, headers),
    Map.class
   );
   Map<String, Object> responseBody = response.getBody();
   if (responseBody == null || responseBody.get("access_token") == null) {
    throw new BadRequestException("Impossibile ottenere il token PayPal");
   }
   return responseBody.get("access_token").toString();
  } catch (RestClientException ex) {
   throw new BadRequestException("Autenticazione PayPal non riuscita");
  }
 }

 private HttpHeaders bearerHeaders(String accessToken) {
  HttpHeaders headers = new HttpHeaders();
  headers.setBearerAuth(accessToken);
  headers.setAccept(List.of(MediaType.APPLICATION_JSON));
  return headers;
 }

 private void ensureConfigured() {
  if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
   throw new BadRequestException("Configura PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET per usare PayPal");
  }
 }

 @SuppressWarnings("unchecked")
 private Map<String, Object> castMap(Object value) {
  return value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
 }

 @SuppressWarnings("unchecked")
 private List<Map<String, Object>> castList(Object value) {
  return value instanceof List<?> list ? (List<Map<String, Object>>) list : List.of();
 }

 private String extractApprovalUrl(Map<String, Object> body) {
  List<Map<String, Object>> links = castList(body.get("links"));
  return links.stream()
   .filter(link -> "approve".equalsIgnoreCase(stringValue(link.get("rel"))))
   .map(link -> stringValue(link.get("href")))
   .findFirst()
   .orElse(null);
 }

 private String formatAmount(Double amount) {
  DecimalFormat formatter = new DecimalFormat("0.00", DecimalFormatSymbols.getInstance(Locale.US));
  return formatter.format(amount);
 }

 private String stringValue(Object value) {
  return value == null ? null : value.toString();
 }
}
