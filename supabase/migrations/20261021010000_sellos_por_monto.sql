-- Sellos según el monto de compra y condiciones del programa.
-- * spend_per_stamp: cada cuánto dinero se gana un sello (ej. 1 sello por cada
--   $150). Null = un sello por visita.
-- * terms: condiciones que se muestran en Recompensas.

alter table public.loyalty_programs
  add column spend_per_stamp numeric(10, 2) check (spend_per_stamp is null or spend_per_stamp > 0),
  add column terms text;
