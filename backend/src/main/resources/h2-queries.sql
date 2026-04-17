-- Query di supporto per la console H2: http://localhost:8080/h2-console

SELECT *
FROM users
ORDER BY created_at DESC;

SELECT *
FROM events
ORDER BY data_evento ASC;

SELECT id, tipo, titolo, data_evento, luogo
FROM events
ORDER BY data_evento ASC;

SELECT
 b.id,
 u.nome AS utente,
 u.email,
 e.titolo AS evento,
 e.data_evento,
 e.luogo,
 b.created_at
FROM bookings b
JOIN users u ON u.id = b.user_id
JOIN events e ON e.id = b.event_id
ORDER BY b.created_at DESC;

SELECT
 e.id,
 e.titolo,
 e.max_partecipanti,
 COUNT(b.id) AS iscritti,
 GREATEST(e.max_partecipanti - COUNT(b.id), 0) AS posti_disponibili
FROM events e
LEFT JOIN bookings b ON b.event_id = e.id
GROUP BY e.id, e.titolo, e.max_partecipanti
ORDER BY e.data_evento ASC;

SELECT *
FROM donations
ORDER BY created_at DESC;

SELECT *
FROM photos
ORDER BY created_at DESC;
