import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { dailyPrompts } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NETLIFY_DATABASE_URL or DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle({ client: pool, schema });

async function seedDatabase() {
  try {
    console.log('Checking for existing daily prompts...');
    
    // Check if we already have prompts
    const existingPrompts = await db.select().from(dailyPrompts).limit(1);
    if (existingPrompts.length > 0) {
      console.log('Daily prompts already exist in database');
      return;
    }

    console.log('Seeding database with Loadshedding Solutions daily prompts...');

    const loadsheddingPrompts = [
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "sunday",
        category: "Solution Sunday",
        title: "Practical Loadshedding Solution",
        prompt: "Share a practical solution to help South Africans during loadshedding. Focus on affordable options from Noshedding.co.za that can power essential devices like WiFi routers, lights, or keep food fresh.",
        hashtags: ["#LoadSheddingTips", "#NosheddingZA", "#SouthAfricaPower", "#SolarSolutions"],
        tone: "helpful and informative with a touch of humor about the SA situation",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "monday",
        category: "Monday Forecast & News",
        title: "Weekly Loadshedding Update",
        prompt: "Post the weekly loadshedding schedule and share tips on how to prepare. Include updates from Eskom and remind followers about Noshedding.co.za backup solutions.",
        hashtags: ["#LoadSheddingUpdate", "#EskomNews", "#NosheddingZA", "#PowerOutages"],
        tone: "informative but relatable, acknowledging the frustration while offering hope",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "tuesday",
        category: "Tech Tuesday",
        title: "Tech Products & DIY Solutions",
        prompt: "Showcase affordable tech products that help during outages. Review inverters, solar lights, power banks, or DIY solutions. Highlight products available on Noshedding.co.za.",
        hashtags: ["#TechTuesday", "#SolarTech", "#NosheddingZA", "#LoadSheddingGadgets"],
        tone: "excited and practical, like sharing a cool discovery",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "wednesday",
        category: "Watt Wednesday",
        title: "Energy Saving Tips",
        prompt: "Teach followers how to save energy and reduce their Eskom bill. Share tips about energy vampires, geyser settings, and efficient appliances. Mention energy-saving products from Noshedding.co.za.",
        hashtags: ["#WattWednesday", "#EnergySaving", "#EskomBill", "#NosheddingZA"],
        tone: "educational and empowering, helping people take control",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "thursday",
        category: "Tips Thursday",
        title: "User Tips & Throwbacks",
        prompt: "Share funny loadshedding moments or user-submitted survival tips. Create nostalgia content about 'the good old days before loadshedding' or highlight creative solutions from followers.",
        hashtags: ["#TipsThursday", "#LoadSheddingLife", "#SouthAfricaStruggles", "#NosheddingZA"],
        tone: "humorous and community-focused, building solidarity",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "friday",
        category: "Feature Friday",
        title: "Business & Product Spotlight",
        prompt: "Highlight a small business or feature products that help with power outages. Showcase Noshedding.co.za products or partner businesses offering backup solutions.",
        hashtags: ["#FeatureFriday", "#SupportLocal", "#LoadSheddingBusiness", "#NosheddingZA"],
        tone: "supportive and community-minded, celebrating solutions",
        isActive: true,
      },
      {
        niche: "Loadshedding Solutions",
        dayOfWeek: "saturday",
        category: "Saturday Polls & Engagement",
        title: "Interactive Content & Polls",
        prompt: "Run polls about loadshedding experiences, survival strategies, or product preferences. Ask engaging questions that get followers talking about their power outage stories.",
        hashtags: ["#SaturdayPolls", "#LoadSheddingLife", "#CommunityChoice", "#NosheddingZA"],
        tone: "interactive and fun, building community engagement",
        isActive: true,
      },
    ];

    const result = await db.insert(dailyPrompts).values(loadsheddingPrompts).returning();
    console.log(`Successfully seeded ${result.length} daily prompts`);
    
    // Verify the data was inserted
    const allPrompts = await db.select().from(dailyPrompts);
    console.log(`Total prompts in database: ${allPrompts.length}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });