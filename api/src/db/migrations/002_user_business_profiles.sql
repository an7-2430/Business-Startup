-- Migration: 002_user_business_profiles
-- Description: Creates the 7-stage setup form data table

CREATE TABLE IF NOT EXISTS public.user_business_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Stage 2
    legal_and_registration JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 3
    location_and_premises JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 4
    compliance_and_safety JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 5
    equipment_and_operations JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 6
    digital_and_finance JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 7
    launch_readiness JSONB DEFAULT '{}'::jsonb,
    
    -- Status Tracking
    stage_statuses JSONB DEFAULT '{"1": "not_started", "2": "not_started", "3": "not_started", "4": "not_started", "5": "not_started", "6": "not_started", "7": "not_started"}'::jsonb,
    overall_progress_percent INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.user_business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile data" ON public.user_business_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile data" ON public.user_business_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile data" ON public.user_business_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update Trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
