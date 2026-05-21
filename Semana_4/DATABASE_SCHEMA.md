# Esquema de Base de Datos DevSolve (Supabase)

## Tabla: profiles
- id: uuid (primary key, references auth.users)
- username: text (unique)
- full_name: text
- role: text (check: 'cliente', 'desarrollador')
- avatar_url: text
- updated_at: timestamp

## Tabla: problems (Bounties)
- id: uuid (primary key, default: gen_random_uuid())
- client_id: uuid (references profiles.id)
- title: text
- description: text
- budget: numeric
- category: text
- status: text (default: 'open')
- created_at: timestamp

## Tabla: solutions (propuestas a bounties + marketplace)
- id: uuid (primary key, default: gen_random_uuid())
- developer_id: uuid (references profiles.id)
- problem_id: uuid (references problems.id) — **vincula la propuesta al bounty**
- title: text
- description: text
- price: numeric
- demo_url: text
- status: text (default: 'submitted') — **p. ej. submitted, reviewing, accepted, rejected**
- created_at: timestamp

### Migración SQL sugerida (si aún no existen columnas)

Ejecuta en el SQL Editor de Supabase si tu tabla `solutions` no tiene `problem_id` ni `status`:

```sql
alter table public.solutions
  add column if not exists problem_id uuid references public.problems(id) on delete set null;

alter table public.solutions
  add column if not exists status text not null default 'submitted';

create index if not exists solutions_problem_id_idx on public.solutions (problem_id);
create index if not exists solutions_developer_id_idx on public.solutions (developer_id);
```

Ajusta políticas RLS: insert/select/update según tu modelo (desarrollador inserta su fila; lectura pública opcional para marketplace).
