-- DB Schema for Lead Routing System

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  sms_phone TEXT,
  active BOOLEAN DEFAULT true,
  trades TEXT[] NOT NULL DEFAULT '{}',
  states TEXT[] NOT NULL DEFAULT '{}',
  priority_score INTEGER DEFAULT 0,
  daily_cap INTEGER DEFAULT 5,
  accepts_sms BOOLEAN DEFAULT true,
  accepts_calls BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  radius_miles INTEGER DEFAULT 25,
  UNIQUE(vendor_id, state, city_slug)
);

CREATE TABLE IF NOT EXISTS vendor_trade_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  trade TEXT NOT NULL,
  symptom_slug TEXT, -- NULL means it applies to all symptoms in the trade
  enabled BOOLEAN DEFAULT true,
  priority_score INTEGER DEFAULT 0,
  UNIQUE(vendor_id, trade, symptom_slug)
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade TEXT NOT NULL,
  symptom_slug TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  state TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  consent_sms BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  consent_text_version TEXT,
  source_url TEXT,
  assigned_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new', -- new, routing, assigned, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_routing_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  attempt_order INTEGER NOT NULL,
  channel TEXT NOT NULL, -- 'sms', 'call'
  status TEXT DEFAULT 'sent', -- sent, accepted, rejected, timeout
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(lead_id, vendor_id)
);
