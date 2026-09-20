import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tmqndioksymcwojrisdg.supabase.co'
const supabaseKey = 'sb_publishable_b5epw_HkblHFCU4dWJ8vJw_vf5sZOAS'

export const supabase = createClient(supabaseUrl, supabaseKey)