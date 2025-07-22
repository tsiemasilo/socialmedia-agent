import type { Handler } from "@netlify/functions";

// Simple handler for Instagram connection without complex dependencies
const handler: Handler = async (event, context) => {
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
    try {
      // Get user info from Instagram API
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

      // Connect to database and store account
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const { drizzle } = await import('drizzle-orm/neon-serverless');
      const ws = await import('ws');
      const { socialAccounts } = await import('../../shared/schema');
      
      neonConfig.webSocketConstructor = ws.default;
      
      const databaseUrl = "postgresql://neondb_owner:npg_3ZrLMJhXf7bv@ep-mute-lake-aewl9d1o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
      const pool = new Pool({ connectionString: databaseUrl });
      const db = drizzle({ client: pool, schema: { socialAccounts } });

      // Create or update the social account
      const account = await db.insert(socialAccounts).values({
        userId: 1,
        platform: "instagram",
        accountName: `@${userData.username}`,
        followers: followerCount,
        isActive: true,
        accessToken: accessToken,
      }).returning();

      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(account[0])
      };

    } catch (apiError) {
      console.error("Instagram API error:", apiError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Failed to validate Instagram account. Please check your access token." 
        })
      };
    }

  } catch (error) {
    console.error("Instagram connect error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to connect Instagram account" })
    };
  }
};

export { handler };