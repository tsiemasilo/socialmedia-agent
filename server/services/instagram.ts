// Instagram Basic Display API and Instagram Graph API integration
// This service handles Instagram account connection and posting

interface InstagramAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface InstagramUserInfo {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export class InstagramService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.INSTAGRAM_APP_ID || '';
    this.clientSecret = process.env.INSTAGRAM_APP_SECRET || '';
    this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:5000/auth/instagram/callback';
    
    // Log configuration for debugging (without exposing secrets)
    console.log('Instagram service initialized:', {
      hasClientId: !!this.clientId,
      hasClientSecret: !!this.clientSecret,
      redirectUri: this.redirectUri
    });
  }

  // Generate Instagram OAuth URL
  getAuthUrl(): string {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Instagram App ID and App Secret are required');
    }
    
    const baseUrl = 'https://api.instagram.com/oauth/authorize';
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<InstagramAuthResponse> {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  // Get user profile information
  async getUserInfo(accessToken: string): Promise<InstagramUserInfo> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }

  // Get long-lived access token
  async getLongLivedToken(shortLivedToken: string): Promise<{ access_token: string; expires_in: number }> {
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.clientSecret}&access_token=${shortLivedToken}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Failed to get long-lived token');
    }

    return response.json();
  }

  // Create Instagram media (for posting)
  async createMedia(accessToken: string, imageUrl: string, caption: string): Promise<{ id: string }> {
    const response = await fetch(
      `https://graph.instagram.com/me/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create media');
    }

    return response.json();
  }

  // Publish Instagram media
  async publishMedia(accessToken: string, creationId: string): Promise<{ id: string }> {
    const response = await fetch(
      `https://graph.instagram.com/me/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to publish media');
    }

    return response.json();
  }

  // Get account insights (for analytics)
  async getAccountInsights(accessToken: string, metrics: string[] = ['impressions', 'reach', 'profile_views']): Promise<any> {
    const metricsParam = metrics.join(',');
    const response = await fetch(
      `https://graph.instagram.com/me/insights?metric=${metricsParam}&period=day&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch account insights');
    }

    return response.json();
  }

  // Validate access token
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?access_token=${accessToken}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const instagramService = new InstagramService();