import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
}

export async function generateCaption(
  niche: string,
  tone: string,
  description: string,
  platforms: string[]
): Promise<{ caption: string; hashtags: string[] }> {
  try {
    const platformText = platforms.join(", ");
    
    // Special handling for Loadshedding Solutions niche
    const isLoadsheddingNiche = niche.toLowerCase().includes("loadshedding");
    
    const basePrompt = `Generate a social media caption for ${platformText} about ${niche} with a ${tone} tone. 
    Description: ${description}
    
    Requirements:
    - Engaging and authentic
    - Include relevant emojis
    - Include call-to-action
    - Optimize for ${platformText}
    - Generate 10-15 relevant hashtags`;

    const loadsheddingSpecificPrompt = `${basePrompt}
    
    IMPORTANT: This is for Loadshedding Solutions in South Africa:
    - Always mention or reference "Noshedding.co.za" as the solution provider
    - Focus on practical South African loadshedding problems
    - Use South African context (Eskom, Stage 6, etc.)
    - Suggest specific products/solutions that help during power outages
    - Be relatable to South Africans dealing with daily power cuts
    - Include references to keeping WiFi running, preserving food, lighting solutions
    - Use tone that acknowledges the frustration but offers real hope/solutions`;

    const finalPrompt = isLoadsheddingNiche ? loadsheddingSpecificPrompt : basePrompt;

    const prompt = `${finalPrompt}
    
    Respond with JSON in this format:
    {
      "caption": "your caption here",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media marketing expert. Generate engaging, authentic content that drives engagement and follows platform best practices."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      caption: result.caption || "Generated caption",
      hashtags: result.hashtags || []
    };
  } catch (error) {
    console.error("Error generating caption:", error);
    throw new Error("Failed to generate caption: " + (error as Error).message);
  }
}

export async function generateImage(
  description: string,
  niche: string,
  tone: string
): Promise<{ url: string }> {
  try {
    // Special handling for Loadshedding Solutions niche
    const isLoadsheddingNiche = niche.toLowerCase().includes("loadshedding");
    
    let prompt = `Create a professional ${niche} social media image with a ${tone} style. ${description}. 
    The image should be high-quality, engaging, and suitable for social media platforms. 
    Style: modern, clean, visually appealing, with good color contrast.`;

    if (isLoadsheddingNiche) {
      prompt = `Create a professional South African loadshedding solutions image. ${description}
      Visual elements to include:
      - Solar panels, inverters, or backup power equipment
      - South African home/office setting
      - Warm, hopeful lighting even in darkness
      - Modern, clean technology
      - People successfully using power solutions during outages
      - Professional but relatable to South African context
      
      Style: modern, clean, optimistic, with good color contrast. Avoid overly dark or negative imagery.
      The image should convey solutions and hope, not just the problem.`;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url || "" };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image: " + (error as Error).message);
  }
}

export async function generateHashtags(
  niche: string,
  caption: string,
  platforms: string[]
): Promise<string[]> {
  try {
    const prompt = `Generate 15 trending, relevant hashtags for a ${niche} post on ${platforms.join(", ")}.
    Caption: "${caption}"
    
    Requirements:
    - Mix of popular and niche-specific hashtags
    - Include trending hashtags when relevant
    - Optimize for discoverability
    - Follow platform best practices
    
    Respond with JSON in this format:
    {
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media hashtag expert. Generate hashtags that maximize reach and engagement while staying relevant to the content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.hashtags || [];
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw new Error("Failed to generate hashtags: " + (error as Error).message);
  }
}

export async function optimizeContentForPlatform(
  content: string,
  platform: string,
  niche: string
): Promise<string> {
  try {
    const prompt = `Optimize this social media content for ${platform} in the ${niche} niche:
    "${content}"
    
    Requirements:
    - Follow ${platform} best practices
    - Optimize character count and format
    - Maintain the original message and tone
    - Include platform-specific elements (mentions, hashtags, etc.)
    
    Respond with the optimized content as plain text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a ${platform} content optimization expert. Adapt content to maximize performance on ${platform} while maintaining authenticity.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error("Failed to optimize content: " + (error as Error).message);
  }
}
