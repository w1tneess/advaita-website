export default async function handler(req, res) {
  // Allow HEAD/GET requests from cron or uptime monitors
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || 'https://efpnrcwxvsvhlxqmvput.supabase.co'
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcG5yY3d4dnN2aGx4cW12cHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NTY2ODEsImV4cCI6MjEwMzIzMjY4MX0.lTAG1di8VWD0MeRP1U2ZQKHzdDkzvW-RBrjD2I-_VRI'

  try {
    // 1. Query the site_content table to trigger active Postgres query activity
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_content?select=id,updated_at&limit=1`,
      {
        method: 'GET',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await response.json()

    if (response.ok) {
      return res.status(200).json({
        ok: true,
        message: 'Supabase PostgreSQL database pinged successfully.',
        timestamp: new Date().toISOString(),
        rows: Array.isArray(data) ? data.length : 1,
      })
    }

    return res.status(response.status).json({
      ok: false,
      status: response.status,
      message: 'Supabase returned non-200 status',
      data,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    })
  }
}
