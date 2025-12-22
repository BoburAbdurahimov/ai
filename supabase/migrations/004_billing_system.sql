-- Billing & Subscription System
-- Comprehensive schema for Premium/Pro/Business tiers

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Subscription Plan
  plan VARCHAR(20) NOT NULL DEFAULT 'STARTER' CHECK (plan IN ('STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE')),
  plan_status VARCHAR(20) NOT NULL DEFAULT 'TRIAL' CHECK (plan_status IN ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED')),
  
  -- Stripe IDs
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  
  -- Trial tracking
  trial_ends_at TIMESTAMPTZ,
  
  -- Payment failure tracking
  payment_failed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contact info
  phone VARCHAR(50),
  timezone VARCHAR(100) DEFAULT 'UTC'
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_stripe_customer_id ON organizations(stripe_customer_id);
CREATE INDEX idx_organizations_plan_status ON organizations(plan_status);
CREATE INDEX idx_organizations_trial_ends_at ON organizations(trial_ends_at) WHERE trial_ends_at IS NOT NULL;

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- User role within organization
  role VARCHAR(20) NOT NULL DEFAULT 'VIEWER' CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER')),
  
  -- Profile
  full_name VARCHAR(255),
  avatar_url TEXT,
  
  -- Preferences
  language VARCHAR(5) DEFAULT 'ru',
  timezone VARCHAR(100) DEFAULT 'UTC',
  
  -- Status
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  last_seen_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe details
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,
  
  -- Plan details
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE')),
  interval VARCHAR(10) NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'PAUSED')),
  
  -- Billing period
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe details
  stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_subscription_id VARCHAR(255),
  
  -- Invoice details
  amount_due INTEGER NOT NULL, -- in cents
  amount_paid INTEGER NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  
  -- URLs
  invoice_url TEXT,
  invoice_pdf TEXT,
  
  -- Period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Dates
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_paid_at ON invoices(paid_at);

-- ============================================
-- USAGE RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Metric
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('minutes', 'calls', 'phone_numbers', 'team_members', 'api_calls')),
  quantity INTEGER NOT NULL,
  
  -- Associated call (if applicable)
  call_id VARCHAR(255),
  
  -- Date for aggregation
  date DATE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_records_organization_id ON usage_records(organization_id);
CREATE INDEX idx_usage_records_date ON usage_records(date);
CREATE INDEX idx_usage_records_metric_type ON usage_records(metric_type);
CREATE INDEX idx_usage_records_org_date ON usage_records(organization_id, date);

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe details
  stripe_payment_method_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Card details (stored by Stripe, we only store references)
  card_brand VARCHAR(50),
  card_last4 VARCHAR(4),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_organization_id ON payment_methods(organization_id);
CREATE INDEX idx_payment_methods_stripe_id ON payment_methods(stripe_payment_method_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(organization_id, is_default) WHERE is_default = TRUE;

-- ============================================
-- CHECKOUT SESSIONS TABLE (for idempotency)
-- ============================================
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe session
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Session details
  plan VARCHAR(20) NOT NULL,
  interval VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'canceled')),
  
  -- Expiry
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkout_sessions_organization_id ON checkout_sessions(organization_id);
CREATE INDEX idx_checkout_sessions_stripe_id ON checkout_sessions(stripe_session_id);
CREATE INDEX idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX idx_checkout_sessions_expires_at ON checkout_sessions(expires_at) WHERE status = 'pending';

-- ============================================
-- MONTHLY USAGE SUMMARY VIEW
-- ============================================
CREATE OR REPLACE VIEW monthly_usage_summary AS
SELECT
  organization_id,
  DATE_TRUNC('month', date) as month,
  metric_type,
  SUM(quantity) as total_quantity,
  COUNT(*) as record_count
FROM usage_records
GROUP BY organization_id, DATE_TRUNC('month', date), metric_type;

-- ============================================
-- CURRENT BILLING PERIOD USAGE VIEW
-- ============================================
CREATE OR REPLACE VIEW current_period_usage AS
SELECT
  u.organization_id,
  u.metric_type,
  SUM(u.quantity) as total_quantity,
  s.current_period_start,
  s.current_period_end,
  o.plan
FROM usage_records u
JOIN organizations o ON u.organization_id = o.id
LEFT JOIN subscriptions s ON o.id = s.organization_id AND s.status = 'ACTIVE'
WHERE u.date >= COALESCE(s.current_period_start::date, DATE_TRUNC('month', CURRENT_DATE)::date)
  AND u.date < COALESCE(s.current_period_end::date, (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::date)
GROUP BY u.organization_id, u.metric_type, s.current_period_start, s.current_period_end, o.plan;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_checkout_sessions_updated_at
  BEFORE UPDATE ON checkout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Organizations: Only owners can update
CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'OWNER'
    )
  );

-- Users: Can view users in their organization
CREATE POLICY "Users can view organization members"
  ON users FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Users: Admins and owners can manage users
CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Subscriptions: Users can view their organization's subscription
CREATE POLICY "Users can view organization subscription"
  ON subscriptions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Invoices: Users can view their organization's invoices
CREATE POLICY "Users can view organization invoices"
  ON invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Usage records: Users can view their organization's usage
CREATE POLICY "Users can view organization usage"
  ON usage_records FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Payment methods: Owners and admins can manage payment methods
CREATE POLICY "Owners and admins can manage payment methods"
  ON payment_methods FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Checkout sessions: Users can view their organization's sessions
CREATE POLICY "Users can view checkout sessions"
  ON checkout_sessions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE organizations IS 'Organizations (tenants) with subscription plans';
COMMENT ON TABLE users IS 'User profiles linked to organizations with roles';
COMMENT ON TABLE subscriptions IS 'Active Stripe subscriptions for organizations';
COMMENT ON TABLE invoices IS 'Invoice history from Stripe';
COMMENT ON TABLE usage_records IS 'Granular usage tracking for metering';
COMMENT ON TABLE payment_methods IS 'Payment methods linked to organizations';
COMMENT ON TABLE checkout_sessions IS 'Stripe checkout sessions for idempotency';
COMMENT ON VIEW monthly_usage_summary IS 'Aggregated monthly usage by organization and metric';
COMMENT ON VIEW current_period_usage IS 'Current billing period usage with plan limits';
