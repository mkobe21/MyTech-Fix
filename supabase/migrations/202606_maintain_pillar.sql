-- ============================================================
-- MyTech-Fix — Maintain Pillar
-- Automated device monitoring, firmware checks, CVE alerts,
-- hygiene notifications, and user notification preferences.
-- ============================================================

-- 1. USER DEVICES
-- Personal device profiles for all users (all tiers).
-- Separate from the business `devices` table which is team-scoped.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_devices (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_brand                    TEXT NOT NULL,
  device_model                    TEXT NOT NULL,
  device_type                     TEXT,            -- e.g. 'Router/WiFi', 'Smart Thermostat', 'Camera'
  nickname                        TEXT,            -- user-facing display name
  purchase_date                   DATE,
  warranty_months                 INTEGER,         -- manufacturer warranty period
  plan_speed_mbps                 INTEGER,         -- ISP plan speed (for routers/modems)
  is_battery_powered              BOOLEAN DEFAULT false,
  battery_last_replaced           DATE,
  local_ip                        TEXT,            -- static IP if applicable (e.g. printer)
  default_password_confirmed_changed BOOLEAN DEFAULT false,
  created_at                      TIMESTAMPTZ DEFAULT now(),
  updated_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_brand_model ON public.user_devices(device_brand, device_model);

ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own devices"
  ON public.user_devices FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2. DEVICE FIRMWARE
-- Shared knowledge base: one row per device model, maintained by cron job.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.device_firmware (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_brand                TEXT NOT NULL,
  device_model                TEXT NOT NULL,
  latest_version              TEXT,
  release_date                DATE,
  release_notes_url           TEXT,
  eol_date                    DATE,
  eol_replacement_suggestion  TEXT,
  last_checked_at             TIMESTAMPTZ DEFAULT now(),
  created_at                  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(device_brand, device_model)
);

CREATE INDEX IF NOT EXISTS idx_device_firmware_brand_model ON public.device_firmware(device_brand, device_model);
CREATE INDEX IF NOT EXISTS idx_device_firmware_last_checked ON public.device_firmware(last_checked_at);

ALTER TABLE public.device_firmware ENABLE ROW LEVEL SECURITY;

-- Read-only for all authenticated users; writes reserved for service role (cron jobs)
CREATE POLICY "Authenticated users can read firmware data"
  ON public.device_firmware FOR SELECT
  TO authenticated
  USING (true);

-- 3. DEVICE CVES
-- CVE/security advisories per device model (populated from NVD API).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.device_cves (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_brand    TEXT NOT NULL,
  device_model    TEXT NOT NULL,
  cve_id          TEXT NOT NULL UNIQUE,
  severity        TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description     TEXT,
  published_date  DATE,
  patch_version   TEXT,
  is_patched      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_cves_brand_model ON public.device_cves(device_brand, device_model);
CREATE INDEX IF NOT EXISTS idx_device_cves_severity ON public.device_cves(severity);

ALTER TABLE public.device_cves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read CVE data"
  ON public.device_cves FOR SELECT
  TO authenticated
  USING (true);

-- 4. DEVICE DEFAULT CREDENTIALS
-- Known factory defaults per brand/model — used for password hygiene checks.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.device_default_credentials (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_brand     TEXT NOT NULL,
  device_model     TEXT,             -- NULL = applies to all models from this brand
  default_username TEXT,
  default_password TEXT,
  admin_url_path   TEXT,             -- e.g. '192.168.1.1' or 'routerlogin.net'
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_defaults_brand ON public.device_default_credentials(device_brand);

ALTER TABLE public.device_default_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read default credentials"
  ON public.device_default_credentials FOR SELECT
  TO authenticated
  USING (true);

-- 5. DEVICE NOTIFICATIONS
-- Notification log — prevents duplicate alerts, tracks read status.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.device_notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_device_id    UUID REFERENCES public.user_devices(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'firmware_update', 'cve', 'eol_warning', 'eol_final',
    'password_hygiene', 'dns_security', 'wifi_degradation',
    'battery_reminder', 'warranty_expiry', 'speed_vs_plan',
    'all_clear'
  )),
  device_brand    TEXT,
  device_model    TEXT,
  reference_id    TEXT,           -- CVE ID, firmware version, etc.
  ai_summary      TEXT,           -- Claude-generated plain-English explanation
  severity        TEXT CHECK (severity IN ('critical', 'high', 'medium', 'info')),
  sent_at         TIMESTAMPTZ DEFAULT now(),
  read_at         TIMESTAMPTZ,
  email_sent      BOOLEAN DEFAULT false,
  email_sent_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_device_notifications_user_id ON public.device_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_device_notifications_user_device ON public.device_notifications(user_device_id);
CREATE INDEX IF NOT EXISTS idx_device_notifications_unread ON public.device_notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_device_notifications_email_unsent ON public.device_notifications(email_sent) WHERE email_sent = false;

ALTER TABLE public.device_notifications ENABLE ROW LEVEL SECURITY;

-- Users read and mark-as-read their own notifications
CREATE POLICY "Users read their own notifications"
  ON public.device_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update read_at on their own notifications"
  ON public.device_notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. USER NOTIFICATION PREFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  user_id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled       BOOLEAN DEFAULT true,
  firmware_updates    BOOLEAN DEFAULT true,
  firmware_frequency  TEXT DEFAULT 'weekly' CHECK (firmware_frequency IN ('weekly', 'monthly')),
  maintenance_tips    BOOLEAN DEFAULT true,
  monthly_summary     BOOLEAN DEFAULT true,
  -- security alerts (cve/eol_final) are always on, not stored here
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notification preferences"
  ON public.user_notification_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 7. MAINTENANCE JOB LOGS
-- Edge Functions write errors here so failures are visible without log monitoring.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.maintenance_job_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name    TEXT NOT NULL,
  run_at      TIMESTAMPTZ DEFAULT now(),
  status      TEXT NOT NULL CHECK (status IN ('success', 'partial', 'error')),
  devices_processed INTEGER DEFAULT 0,
  notifications_sent INTEGER DEFAULT 0,
  error_message TEXT,
  details     JSONB
);

CREATE INDEX IF NOT EXISTS idx_maintenance_logs_job ON public.maintenance_job_logs(job_name, run_at DESC);

ALTER TABLE public.maintenance_job_logs ENABLE ROW LEVEL SECURITY;
-- Logs are service-role only — no user-facing RLS policy needed

-- ============================================================
-- SEED: device_default_credentials
-- ============================================================
INSERT INTO public.device_default_credentials
  (device_brand, device_model, default_username, default_password, admin_url_path)
VALUES
  ('Netgear',       NULL,    'admin',  'password', '192.168.1.1'),
  ('TP-Link',       NULL,    'admin',  'admin',    '192.168.0.1'),
  ('Linksys',       NULL,    'admin',  '',         '192.168.1.1'),
  ('Asus',          NULL,    'admin',  'admin',    '192.168.1.1'),
  ('Eero',          NULL,    NULL,     NULL,       NULL),          -- app-only setup, no web admin
  ('Netgear Orbi',  'RBK50', 'admin',  'password', 'orbilogin.com'),
  ('Ring',          NULL,    NULL,     NULL,       NULL),          -- cloud account only
  ('Canon',         NULL,    NULL,     NULL,       NULL)           -- no default admin password
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: device_firmware (top 15 devices — latest_version populated by cron)
-- ============================================================
INSERT INTO public.device_firmware
  (device_brand, device_model, eol_date, eol_replacement_suggestion)
VALUES
  ('Eero',    'Eero 6',                 NULL,         NULL),
  ('Eero',    'Eero 2nd Generation',    '2027-03-01', 'Eero 6 or Eero Pro 6'),
  ('Netgear', 'Orbi RBK50',             NULL,         NULL),
  ('TP-Link', 'Deco M9 Plus',           NULL,         NULL),
  ('TP-Link', 'Deco M5',                '2026-12-01', 'TP-Link Deco XE75'),
  ('HP',      'OfficeJet Pro 9015',     NULL,         NULL),
  ('Canon',   'PIXMA MG3620',           NULL,         NULL),
  ('Google',  'Nest Thermostat',        NULL,         NULL),
  ('Ring',    'Video Doorbell 4',       NULL,         NULL),
  ('Ring',    'Indoor Cam',             NULL,         NULL),
  ('Philips', 'Hue Bridge v2',          NULL,         NULL),
  ('Ecobee',  'SmartThermostat Premium', NULL,        NULL),
  ('Arlo',    'Pro 4',                  NULL,         NULL),
  ('Wyze',    'Cam v3',                 NULL,         NULL),
  ('Windows', 'Windows 11',             NULL,         NULL)
ON CONFLICT (device_brand, device_model) DO NOTHING;
