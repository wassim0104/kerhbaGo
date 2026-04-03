-- kerhbaGo MVP Seed Script
-- Populates 10 Agencies, 50 Vehicles, 20 Clients, 30 Reservations

-- 1. Agencies (10)
INSERT INTO public.agencies (id, name, city, address, phone, email, rating, verified)
SELECT 
  gen_random_uuid(),
  'Agence ' || (ARRAY['Prestige Auto', 'RentTN', 'DriveSafe', 'AutoGo', 'Elite Rent'])[floor(random() * 5 + 1)::int] || ' ' || i,
  (ARRAY['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Djerba'])[floor(random() * 5 + 1)::int],
  'Avenue Principale ' || i,
  '55 000 00' || (i % 10),
  'contact' || i || '@agence.tn',
  floor(random() * 2 + 3)::numeric(3,2) + random()::numeric(3,2),
  true
FROM generate_series(1, 10) as i;

-- 2. Vehicles (50)
INSERT INTO public.vehicles (id, agency_id, name, category, photo_urls, seats, transmission, base_price, current_price, status)
SELECT
  gen_random_uuid(),
  (SELECT id FROM public.agencies ORDER BY random() LIMIT 1),
  (ARRAY['Renault Clio 5', 'Peugeot 208', 'Volkswagen Golf 8', 'Dacia Logan', 'Kia Rio', 'Range Rover Evoque', 'BMW Serie 3', 'Audi A3'])[floor(random() * 8 + 1)::int],
  (ARRAY['Citadine', 'Compacte', 'Berline', 'SUV', 'Luxe'])[floor(random() * 5 + 1)::int],
  ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80'],
  5,
  (ARRAY['manuelle', 'automatique'])[floor(random() * 2 + 1)::int],
  floor(random() * 300 + 80),
  floor(random() * 300 + 80),
  'available'
FROM generate_series(1, 50);

-- 3. Clients (20) - (user_id left null since auth isn't seeded)
INSERT INTO public.clients (id, full_name, phone, cin_number, trust_score, total_rentals)
SELECT
  gen_random_uuid(),
  (ARRAY['Ahmed', 'Mouna', 'Sami', 'Youssef', 'Amira', 'Khaled', 'Rania'])[floor(random() * 7 + 1)::int] || ' ' || 
  (ARRAY['Ben Ali', 'Trabelsi', 'Gharbi', 'Mansour'])[floor(random() * 4 + 1)::int],
  '22 000 00' || (i % 10),
  '0' || (floor(random() * 9000000 + 1000000)::text),
  floor(random() * 40 + 60),
  floor(random() * 10)
FROM generate_series(1, 20) as i;

-- 4. Reservations (30)
INSERT INTO public.reservations (id, vehicle_id, client_id, agency_id, start_date, end_date, total_days, status, payment_method)
SELECT
  gen_random_uuid(),
  v.id,
  c.id,
  v.agency_id,
  CURRENT_DATE + (floor(random() * 10)::int * interval '1 day'),
  CURRENT_DATE + (floor(random() * 10 + 2)::int * interval '1 day'),
  floor(random() * 7 + 1)::int,
  (ARRAY['pending', 'confirmed', 'completed'])[floor(random() * 3 + 1)::int],
  'konnect'
FROM generate_series(1, 30)
CROSS JOIN LATERAL (SELECT id, agency_id FROM public.vehicles ORDER BY random() LIMIT 1) v
CROSS JOIN LATERAL (SELECT id FROM public.clients ORDER BY random() LIMIT 1) c;
