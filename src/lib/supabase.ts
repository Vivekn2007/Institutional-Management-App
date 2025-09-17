import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmwuocjxblgxdnniwkoe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3VvY2p4YmxneGRubml3a29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Mzk0MjcsImV4cCI6MjA3MzUxNTQyN30.heL_UjCUGNArcfHf-Io8AKwv-WffF-xp_ujC75AwL_0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)