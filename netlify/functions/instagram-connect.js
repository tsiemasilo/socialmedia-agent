const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.NETLIFY_DATABASE_URL || "postgresql://neondb_owner:npg_3ZrLMJhXf7bv@ep-mute-lake-aewl9d1o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { accessToken } = body;

    if (!accessToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Access token is required" })
      };
    }

    // Validate the access token with Instagram API
    const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
    
    if (!userResponse.ok) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid Instagram access token" })
      };
    }

    const userData = await userResponse.json();
    
    // Get follower count (requires Instagram Business Account)
    let followerCount = 0;
    try {
      const insightsResponse = await fetch(`https://graph.instagram.com/${userData.id}/insights?metric=follower_count&period=lifetime&access_token=${accessToken}`);
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        followerCount = insightsData.data[0]?.values[0]?.value || 0;
      }
    } catch (e) {
      // Business insights might not be available for personal accounts
      console.log("Could not fetch follower count:", e);
      followerCount = userData.media_count || 0;
    }

    // Connect to database
    const pool = new Pool({ connectionString: databaseUrl });
    const db = drizzle({ client: pool });

    // Create social account record
    const result = await pool.query(`
      INSERT INTO social_accounts (user_id, platform, account_name, followers, is_active, access_token, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [1, 'instagram', `@${userData.username}`, followerCount, true, accessToken]);

    await pool.end();

    const account = result.rows[0];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: account.id,
        userId: account.user_id,
        platform: account.platform,
        accountName: account.account_name,
        followers: account.followers,
        isActive: account.is_active,
        accessToken: account.access_token,
        createdAt: account.created_at
      })
    };

  } catch (error) {
    console.error("Instagram connect error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to connect Instagram account" })
    };
  }
};