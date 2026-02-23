// AI Service for PiUI - Uses MiniMax API for intelligent cover generation

export interface GeneratedElement {
  type: 'text' | 'rectangle' | 'circle' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface AIGenerationResult {
  elements: GeneratedElement[];
  description: string;
}

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/text/chatcompletion_v2';

export async function generateCoverWithAI(
  prompt: string,
  canvasWidth: number,
  canvasHeight: number,
  apiKey?: string
): Promise<AIGenerationResult> {
  // Use stored API key or provided one
  const key = apiKey || localStorage.getItem('piui_api_key');
  
  if (!key) {
    // Fall back to smart template-based generation
    return generateSmartTemplate(prompt, canvasWidth, canvasHeight);
  }

  const systemPrompt = `You are an expert graphic designer for creating video covers and social media posts. 
Generate a JSON response describing the design elements for a cover image.
Canvas size: ${canvasWidth}x${canvasHeight}

Respond with ONLY valid JSON in this exact format:
{
  "elements": [
    {
      "type": "rectangle" | "text" | "circle",
      "x": number,
      "y": number, 
      "width": number,
      "height": number,
      "rotation": number,
      "opacity": number,
      "fill": "#hex color" (for shapes),
      "color": "#hex color" (for text),
      "text": "text content" (for text elements),
      "fontSize": number (for text),
      "fontFamily": "font name",
      "fontWeight": number,
      "gradient": { "type": "linear" | "radial", "colors": ["#color1", "#color2"], "angle": number }
    }
  ],
  "description": "brief description of the design"
}

Create a visually appealing cover with:
- A gradient or solid color background
- Main title text (large, bold)
- Secondary text or decorative elements
- Use modern color schemes based on the prompt

Respond with ONLY JSON, no other text.`;

  try {
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      // Try to parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    }
    
    // Fall back to smart template if parsing fails
    return generateSmartTemplate(prompt, canvasWidth, canvasHeight);
  } catch (error) {
    console.error('AI generation failed:', error);
    // Fall back to smart template generation
    return generateSmartTemplate(prompt, canvasWidth, canvasHeight);
  }
}

// Smart template-based generation (works without API key)
function generateSmartTemplate(prompt: string, width: number, height: number): AIGenerationResult {
  const elements: GeneratedElement[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Color schemes based on mood
  const colorSchemes: Record<string, { bg: string[], primary: string, accent: string, text: string }> = {
    tech: { bg: ['#0f0c29', '#302b63', '#24243e'], primary: '#00d4ff', accent: '#ff0080', text: '#ffffff' },
    neon: { bg: ['#1a1a2e', '#16213e', '#0f3460'], primary: '#e94560', accent: '#00fff5', text: '#ffffff' },
    minimal: { bg: ['#f5f5f5', '#ffffff', '#eeeeee'], primary: '#333333', accent: '#666666', text: '#111111' },
    gaming: { bg: ['#1a0000', '#330000', '#1a1a00'], primary: '#ff0000', accent: '#ffff00', text: '#ffffff' },
    nature: { bg: ['#134e5e', '#71b280', '#2d5016'], primary: '#2d5016', accent: '#f4d03f', text: '#ffffff' },
    dark: { bg: ['#0d0d0d', '#1a1a1a', '#262626'], primary: '#ffffff', accent: '#888888', text: '#ffffff' },
    warm: { bg: ['#ff416c', '#ff4b2b', '#f12711'], primary: '#ffffff', accent: '#ffc300', text: '#ffffff' },
    cool: { bg: ['#2193b0', '#6dd5ed', '#0099c6'], primary: '#ffffff', accent: '#ffeb3b', text: '#ffffff' },
    purple: { bg: ['#4a00e0', '#8e2de2', '#2d0a4e'], primary: '#ffffff', accent: '#ff00ff', text: '#ffffff' },
    gold: { bg: ['#1a1a2e', '#162447', '#1f4068'], primary: '#ffd700', accent: '#c9a227', text: '#ffffff' },
  };

  // Detect color scheme from prompt
  let scheme = colorSchemes.dark;
  if (lowerPrompt.includes('tech') || lowerPrompt.includes('technology')) scheme = colorSchemes.tech;
  else if (lowerPrompt.includes('neon') || lowerPrompt.includes('cyberpunk')) scheme = colorSchemes.neon;
  else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean')) scheme = colorSchemes.minimal;
  else if (lowerPrompt.includes('game') || lowerPrompt.includes('gaming')) scheme = colorSchemes.gaming;
  else if (lowerPrompt.includes('nature') || lowerPrompt.includes('green')) scheme = colorSchemes.nature;
  else if (lowerPrompt.includes('warm') || lowerPrompt.includes('sunset') || lowerPrompt.includes('sale')) scheme = colorSchemes.warm;
  else if (lowerPrompt.includes('cool') || lowerPrompt.includes('ice') || lowerPrompt.includes('water')) scheme = colorSchemes.cool;
  else if (lowerPrompt.includes('purple') || lowerPrompt.includes('pink')) scheme = colorSchemes.purple;
  else if (lowerPrompt.includes('gold') || lowerPrompt.includes('premium') || lowerPrompt.includes('luxury')) scheme = colorSchemes.gold;

  // Background
  elements.push({
    type: 'rectangle',
    x: 0,
    y: 0,
    width,
    height,
    rotation: 0,
    opacity: 1,
    gradient: { type: 'linear', colors: scheme.bg, angle: 135 },
  });

  // Decorative circles
  elements.push({
    type: 'circle',
    x: width * 0.8,
    y: height * 0.15,
    width: Math.min(width, height) * 0.3,
    height: Math.min(width, height) * 0.3,
    rotation: 0,
    opacity: 0.3,
    gradient: { type: 'radial', colors: [scheme.accent, 'transparent'] },
  });

  elements.push({
    type: 'circle',
    x: -width * 0.1,
    y: height * 0.7,
    width: Math.min(width, height) * 0.4,
    height: Math.min(width, height) * 0.4,
    rotation: 0,
    opacity: 0.2,
    gradient: { type: 'radial', colors: [scheme.primary, 'transparent'] },
  });

  // Detect type and create appropriate elements
  if (lowerPrompt.includes('youtube') || lowerPrompt.includes('thumbnail') || lowerPrompt.includes('video')) {
    // YouTube thumbnail style
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.4,
      width: width * 0.8,
      height: Math.min(80, height * 0.12),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || 'YOUR TITLE',
      fontSize: Math.min(64, width / 15),
      fontFamily: 'Outfit',
      fontWeight: 700,
      color: scheme.text,
      textAlign: 'center',
      shadowColor: '#000000',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.6,
      width: width * 0.5,
      height: 30,
      rotation: 0,
      opacity: 0.9,
      text: getSubText(prompt) || 'Subscribe for more',
      fontSize: Math.min(24, width / 40),
      fontFamily: 'DM Sans',
      fontWeight: 500,
      color: scheme.accent,
      textAlign: 'center',
    });

    // Add play button circle
    elements.push({
      type: 'circle',
      x: width / 2,
      y: height * 0.75,
      width: 60,
      height: 60,
      rotation: 0,
      opacity: 0.9,
      fill: scheme.accent,
    });
  } 
  else if (lowerPrompt.includes('instagram') || lowerPrompt.includes('post') || lowerPrompt.includes('square')) {
    // Instagram post style
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.35,
      width: width * 0.7,
      height: Math.min(60, height * 0.1),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || 'YOUR TEXT',
      fontSize: Math.min(48, width / 18),
      fontFamily: 'Poppins',
      fontWeight: 600,
      color: scheme.text,
      textAlign: 'center',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.55,
      width: width * 0.6,
      height: 24,
      rotation: 0,
      opacity: 0.8,
      text: getSubText(prompt) || '#hashtag',
      fontSize: Math.min(18, width / 45),
      fontFamily: 'DM Sans',
      fontWeight: 400,
      color: scheme.accent,
      textAlign: 'center',
    });
  }
  else if (lowerPrompt.includes('quote')) {
    // Quote style
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.3,
      width: width * 0.75,
      height: Math.min(100, height * 0.15),
      rotation: 0,
      opacity: 1,
      text: '"',
      fontSize: 80,
      fontFamily: 'Playfair Display',
      fontWeight: 400,
      color: scheme.accent,
      textAlign: 'center',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.45,
      width: width * 0.8,
      height: Math.min(80, height * 0.12),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || 'Your inspiring quote here',
      fontSize: Math.min(32, width / 30),
      fontFamily: 'Merriweather',
      fontWeight: 400,
      color: scheme.text,
      textAlign: 'center',
      fontStyle: 'italic',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.7,
      width: width * 0.4,
      height: 24,
      rotation: 0,
      opacity: 0.7,
      text: getSubText(prompt) || '— Author',
      fontSize: Math.min(16, width / 50),
      fontFamily: 'DM Sans',
      fontWeight: 500,
      color: scheme.primary,
      textAlign: 'center',
    });
  }
  else if (lowerPrompt.includes('sale') || lowerPrompt.includes('discount') || lowerPrompt.includes('offer')) {
    // Sale banner style
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.25,
      width: width * 0.8,
      height: Math.min(50, height * 0.08),
      rotation: 0,
      opacity: 1,
      text: 'FLASH SALE',
      fontSize: Math.min(36, width / 25),
      fontFamily: 'Outfit',
      fontWeight: 700,
      color: scheme.accent,
      textAlign: 'center',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.42,
      width: width * 0.7,
      height: Math.min(80, height * 0.12),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || 'UP TO 50% OFF',
      fontSize: Math.min(56, width / 14),
      fontFamily: 'Montserrat',
      fontWeight: 900,
      color: scheme.text,
      textAlign: 'center',
      shadowColor: scheme.accent,
      shadowBlur: 30,
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.65,
      width: width * 0.5,
      height: 30,
      rotation: 0,
      opacity: 0.9,
      text: getSubText(prompt) || 'Limited time only!',
      fontSize: Math.min(20, width / 40),
      fontFamily: 'DM Sans',
      fontWeight: 500,
      color: scheme.text,
      textAlign: 'center',
    });
  }
  else if (lowerPrompt.includes('tiktok') || lowerPrompt.includes('story')) {
    // TikTok/Story style (vertical)
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.3,
      width: width * 0.8,
      height: Math.min(70, height * 0.1),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || '@username',
      fontSize: Math.min(36, width / 20),
      fontFamily: 'Outfit',
      fontWeight: 700,
      color: scheme.text,
      textAlign: 'center',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.5,
      width: width * 0.7,
      height: Math.min(50, height * 0.08),
      rotation: 0,
      opacity: 0.85,
      text: getSubText(prompt) || 'Your caption here',
      fontSize: Math.min(20, width / 35),
      fontFamily: 'DM Sans',
      fontWeight: 400,
      color: scheme.text,
      textAlign: 'center',
    });
  }
  else {
    // Default modern cover
    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.35,
      width: width * 0.75,
      height: Math.min(60, height * 0.1),
      rotation: 0,
      opacity: 1,
      text: extractMainText(prompt) || 'PiUI Generated',
      fontSize: Math.min(48, width / 18),
      fontFamily: 'Outfit',
      fontWeight: 600,
      color: scheme.text,
      textAlign: 'center',
    });

    elements.push({
      type: 'text',
      x: width / 2,
      y: height * 0.55,
      width: width * 0.6,
      height: 24,
      rotation: 0,
      opacity: 0.7,
      text: getSubText(prompt) || 'Design with AI',
      fontSize: Math.min(18, width / 45),
      fontFamily: 'DM Sans',
      fontWeight: 400,
      color: scheme.primary,
      textAlign: 'center',
    });
  }

  return {
    elements,
    description: `Generated ${scheme === colorSchemes.tech ? 'tech' : 'modern'} style cover based on: ${prompt}`,
  };
}

function extractMainText(prompt: string): string | null {
  // Try to extract the main text user wants to display
  const match = prompt.match(/(?:with|text|saying|says?|displaying)\s+["'](.+?)["']/i);
  if (match) return match[1];
  
  const simpleMatch = prompt.match(/^["'](.+?)["']$/);
  if (simpleMatch) return simpleMatch[1];
  
  return null;
}

function getSubText(prompt: string): string | null {
  const match = prompt.match(/and\s+(.+)$/i);
  if (match) return match[1];
  return null;
}

export default { generateCoverWithAI };
