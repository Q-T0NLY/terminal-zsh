// Supabase configuration
export const supabaseConfig = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_NEXUS_PUBLICSUPABASE_URL ||
    "https://jvreouvejyogshzskagz.supabase.co",
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_NEXUS_PUBLICSUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cmVvdXZlanlvZ3NoenNrYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjkwNTQsImV4cCI6MjA3ODE0NTA1NH0.dLlWJnF4hbTHVnlC28tTQr38J9dtOj8WEPC4zRgV_KE",
}
