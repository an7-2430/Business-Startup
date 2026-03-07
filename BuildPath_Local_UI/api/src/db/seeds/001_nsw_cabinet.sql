-- ============================================================================
-- BuildPath MVP — Seed Data: NSW + Cabinet Manufacturing
-- Run AFTER 001_core_schema.sql
-- ============================================================================

-- ── Industry: Cabinet Manufacturing ──────────────────────────────────────────
INSERT INTO industries (id, name, active)
VALUES ('a1b2c3d4-1111-4000-8000-000000000001', 'Cabinet Manufacturing', true)
ON CONFLICT (id) DO NOTHING;

-- ── Stages for Cabinet Manufacturing ─────────────────────────────────────────
INSERT INTO stages (id, industry_id, title, order_index) VALUES
  ('b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001', 'Business Registration & Legal', 1),
  ('b1b2c3d4-2222-4000-8000-000000000002', 'a1b2c3d4-1111-4000-8000-000000000001', 'Compliance & Safety', 2),
  ('b1b2c3d4-2222-4000-8000-000000000003', 'a1b2c3d4-1111-4000-8000-000000000001', 'Workshop & Equipment', 3),
  ('b1b2c3d4-2222-4000-8000-000000000004', 'a1b2c3d4-1111-4000-8000-000000000001', 'Software & Tools', 4),
  ('b1b2c3d4-2222-4000-8000-000000000005', 'a1b2c3d4-1111-4000-8000-000000000001', 'Insurance & Finance', 5),
  ('b1b2c3d4-2222-4000-8000-000000000006', 'a1b2c3d4-1111-4000-8000-000000000001', 'Operations Setup', 6),
  ('b1b2c3d4-2222-4000-8000-000000000007', 'a1b2c3d4-1111-4000-8000-000000000001', 'Launch Readiness', 7)
ON CONFLICT (id) DO NOTHING;

-- ── Steps ────────────────────────────────────────────────────────────────────

-- Stage 1: Business Registration & Legal
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000001', 'b1b2c3d4-2222-4000-8000-000000000001',
   'Register Your Business Name',
   'Register your business name with ASIC via the Australian Business Register.',
   1,
   '[{"text":"Choose a business name","done":false},{"text":"Check name availability on ASIC","done":false},{"text":"Complete registration","done":false}]',
   '[{"label":"ASIC Business Name Registration","url":"https://asic.gov.au/for-business/registering-a-business-name/"}]'),

  ('c1000000-3333-4000-8000-000000000002', 'b1b2c3d4-2222-4000-8000-000000000001',
   'Get an ABN',
   'Apply for an Australian Business Number through the ATO.',
   2,
   '[{"text":"Gather identity documents","done":false},{"text":"Apply online at ABR","done":false},{"text":"Record your ABN","done":false}]',
   '[{"label":"Apply for ABN","url":"https://www.abr.gov.au/business-super-funds-702charities/applying-abn"}]'),

  ('c1000000-3333-4000-8000-000000000003', 'b1b2c3d4-2222-4000-8000-000000000001',
   'Choose a Business Structure',
   'Decide between sole trader, partnership, or company structure.',
   3,
   '[{"text":"Research structures","done":false},{"text":"Consult accountant if needed","done":false},{"text":"Register chosen structure","done":false}]',
   '[{"label":"Business Structures Guide","url":"https://business.gov.au/planning/business-structures-and-types"}]'),

  ('c1000000-3333-4000-8000-000000000004', 'b1b2c3d4-2222-4000-8000-000000000001',
   'Register for GST',
   'Register for Goods and Services Tax if turnover is expected to exceed $75,000.',
   4,
   '[{"text":"Determine if GST applies","done":false},{"text":"Register via ATO","done":false}]',
   '[{"label":"GST Registration","url":"https://www.ato.gov.au/business/gst/registering-for-gst/"}]')
ON CONFLICT (id) DO NOTHING;

-- Stage 2: Compliance & Safety
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000005', 'b1b2c3d4-2222-4000-8000-000000000002',
   'WHS Obligations (SafeWork NSW)',
   'Understand and comply with Work Health and Safety requirements for manufacturing.',
   1,
   '[{"text":"Read SafeWork NSW manufacturing guide","done":false},{"text":"Create WHS policy","done":false},{"text":"Set up incident reporting process","done":false}]',
   '[{"label":"SafeWork NSW","url":"https://www.safework.nsw.gov.au/"}]'),

  ('c1000000-3333-4000-8000-000000000006', 'b1b2c3d4-2222-4000-8000-000000000002',
   'Workers Compensation Insurance',
   'Arrange workers compensation if you plan to hire employees.',
   2,
   '[{"text":"Determine if required","done":false},{"text":"Get quotes from insurers","done":false},{"text":"Purchase policy","done":false}]',
   '[{"label":"icare NSW","url":"https://www.icare.nsw.gov.au/"}]'),

  ('c1000000-3333-4000-8000-000000000007', 'b1b2c3d4-2222-4000-8000-000000000002',
   'Environmental Compliance',
   'Check local council requirements for dust, noise, and waste management.',
   3,
   '[{"text":"Contact local council","done":false},{"text":"Review EPA guidelines","done":false},{"text":"Install required dust extraction","done":false}]',
   '[{"label":"NSW EPA","url":"https://www.epa.nsw.gov.au/"}]')
ON CONFLICT (id) DO NOTHING;

-- Stage 3: Workshop & Equipment
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000008', 'b1b2c3d4-2222-4000-8000-000000000003',
   'Find a Workshop Space',
   'Secure an appropriate industrial or commercial space for your cabinet workshop.',
   1,
   '[{"text":"Define space requirements","done":false},{"text":"Search commercial listings","done":false},{"text":"Sign lease","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000009', 'b1b2c3d4-2222-4000-8000-000000000003',
   'Purchase Core Equipment',
   'Acquire essential machinery: table saw, router, edge bander, drill press, clamps.',
   2,
   '[{"text":"List required equipment","done":false},{"text":"Get quotes (new vs used)","done":false},{"text":"Purchase and install","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000010', 'b1b2c3d4-2222-4000-8000-000000000003',
   'Set Up Dust Extraction',
   'Install a dust extraction system compliant with SafeWork NSW standards.',
   3,
   '[{"text":"Research extraction systems","done":false},{"text":"Purchase and install","done":false},{"text":"Test and certify","done":false}]',
   '[]')
ON CONFLICT (id) DO NOTHING;

-- Stage 4: Software & Tools
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000011', 'b1b2c3d4-2222-4000-8000-000000000004',
   'Choose CAD/Design Software',
   'Select cabinet design software (e.g., Cabinet Vision, SketchUp, Polyboard).',
   1,
   '[{"text":"Trial 2-3 options","done":false},{"text":"Purchase licence","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000012', 'b1b2c3d4-2222-4000-8000-000000000004',
   'Set Up Accounting Software',
   'Choose and configure accounting software (Xero, MYOB, or QuickBooks).',
   2,
   '[{"text":"Compare options","done":false},{"text":"Set up accounts","done":false},{"text":"Connect bank feed","done":false}]',
   '[]')
ON CONFLICT (id) DO NOTHING;

-- Stage 5: Insurance & Finance
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000013', 'b1b2c3d4-2222-4000-8000-000000000005',
   'Get Public Liability Insurance',
   'Protect your business with public liability insurance.',
   1,
   '[{"text":"Get quotes","done":false},{"text":"Compare coverage","done":false},{"text":"Purchase policy","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000014', 'b1b2c3d4-2222-4000-8000-000000000005',
   'Open a Business Bank Account',
   'Separate personal and business finances.',
   2,
   '[{"text":"Compare bank offerings","done":false},{"text":"Open account","done":false},{"text":"Set up online banking","done":false}]',
   '[]')
ON CONFLICT (id) DO NOTHING;

-- Stage 6: Operations Setup
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000015', 'b1b2c3d4-2222-4000-8000-000000000006',
   'Create Pricing & Quoting Process',
   'Develop a system for calculating material costs, labour, and profit margins.',
   1,
   '[{"text":"Define cost categories","done":false},{"text":"Build a quoting template","done":false},{"text":"Set margin targets","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000016', 'b1b2c3d4-2222-4000-8000-000000000006',
   'Set Up Supplier Accounts',
   'Establish trade accounts with timber, hardware, and panel suppliers.',
   2,
   '[{"text":"Research local suppliers","done":false},{"text":"Open trade accounts","done":false},{"text":"Negotiate terms","done":false}]',
   '[]')
ON CONFLICT (id) DO NOTHING;

-- Stage 7: Launch Readiness
INSERT INTO steps (id, stage_id, title, description, order_index, checklist_json, resources_json) VALUES
  ('c1000000-3333-4000-8000-000000000017', 'b1b2c3d4-2222-4000-8000-000000000007',
   'Build a Portfolio / Website',
   'Create an online presence to attract customers.',
   1,
   '[{"text":"Design a simple website","done":false},{"text":"Add portfolio images","done":false},{"text":"Set up Google Business Profile","done":false}]',
   '[]'),

  ('c1000000-3333-4000-8000-000000000018', 'b1b2c3d4-2222-4000-8000-000000000007',
   'Get Your First Client',
   'Start marketing and secure your first cabinet project.',
   2,
   '[{"text":"Tell your network","done":false},{"text":"List on trade directories","done":false},{"text":"Follow up leads","done":false}]',
   '[]')
ON CONFLICT (id) DO NOTHING;

-- ── Step Prerequisites ───────────────────────────────────────────────────────
-- ABN requires Business Name
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000002', 'c1000000-3333-4000-8000-000000000001')
ON CONFLICT DO NOTHING;

-- Business Structure requires ABN
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000003', 'c1000000-3333-4000-8000-000000000002')
ON CONFLICT DO NOTHING;

-- GST requires ABN
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000004', 'c1000000-3333-4000-8000-000000000002')
ON CONFLICT DO NOTHING;

-- Equipment requires Workshop
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000009', 'c1000000-3333-4000-8000-000000000008')
ON CONFLICT DO NOTHING;

-- Dust Extraction requires Workshop
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000010', 'c1000000-3333-4000-8000-000000000008')
ON CONFLICT DO NOTHING;

-- First Client requires Website
INSERT INTO step_prerequisites (step_id, prerequisite_step_id) VALUES
  ('c1000000-3333-4000-8000-000000000018', 'c1000000-3333-4000-8000-000000000017')
ON CONFLICT DO NOTHING;
