export default async function handler(req, res) {
  // Allow HEAD/GET requests from cron or uptime monitors
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({
      ok: false,
      message: 'Supabase credentials not configured in environment variables.',
    })
  }


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
