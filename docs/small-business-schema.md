# Small Business Tier - Database Schema Recommendations

These changes will support the key features we want for the Small Business tier:
- Team accounts
- Shared conversations
- Device inventory
- Admin controls & reporting

---

## 1. Core Tables to Add / Modify

### `teams` table
```sql
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_owner_id ON public.teams(owner_id);
```

### `team_members` table
```sql
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
```

### `devices` table (Business Device Inventory)
```sql
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT,                    -- e.g. "Laptop", "Printer", "Router", "POS Terminal"
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  last_troubleshot_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_devices_team_id ON public.devices(team_id);
CREATE INDEX idx_devices_assigned_to ON public.devices(assigned_to);
```

### Update `chat_sessions` table
Add these columns to support team context:

```sql
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id),
  ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS tags TEXT[];           -- e.g. ["urgent", "finance-dept"]
```

---

## 2. Row Level Security (RLS) Policies

```sql
-- Teams: Only members can see their team
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view their team"
  ON public.teams FOR SELECT
  USING (id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid()));

-- Team members
CREATE POLICY "Users can see teams they belong to"
  ON public.team_members FOR SELECT
  USING (user_id = auth.uid() OR team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Devices
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid()));
```

---

## 3. Update Existing Triggers / Logic

- When a user signs up under a Small Business account, automatically add them to the team.
- When creating a chat session from a business account, attach `team_id`.
- Consider adding a `visibility` column on `chat_sessions` (`private` / `team`).

---

## 4. Recommended Indexes for Performance

```sql
CREATE INDEX idx_chat_sessions_team_id ON public.chat_sessions(team_id);
CREATE INDEX idx_chat_sessions_device_id ON public.chat_sessions(device_id);
```

---

These changes will allow you to properly support multi-user business accounts while keeping consumer plans simple.
