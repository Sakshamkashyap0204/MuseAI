'use strict';

const AppError = require('../utils/AppError');
const openaiService = require('./openai.service');
const Generation = require('../models/Generation');
const User = require('../models/User');

const TOOLS = {
  video_prompt: {
    system: `You are a professional AI video prompt engineer. Your job is to transform a simple idea into a detailed, structured prompt for AI video generation tools like Sora, Runway, Kling, or Pika.
Return ONLY a structured prompt with clearly labeled sections. Use this exact format:

**Subject:** [who/what is the focus]
**Environment:** [location, setting, world]
**Action:** [what is happening, movement]
**Camera Angle:** [e.g. low angle, bird's eye, eye level]
**Camera Movement:** [e.g. slow dolly in, tracking shot, static]
**Lens/Framing:** [e.g. wide shot, close-up, extreme close-up]
**Lighting:** [e.g. golden hour, neon, harsh shadows]
**Mood/Atmosphere:** [emotional tone]
**Visual Style:** [e.g. cinematic, anime, documentary, hyperrealistic]
**Time of Day:** [dawn, dusk, night, midday]
**Weather:** [clear, rainy, foggy, stormy]
**Color Tone:** [warm, cold, desaturated, vibrant]
**Cinematic Details:** [film grain, lens flare, depth of field, etc.]
**Audio Suggestion:** [ambient sounds, music mood]`,
    build: ({ idea, style }) =>
      `Transform this idea into a detailed AI video generation prompt.\nIdea: ${idea}\nStyle: ${style || 'Cinematic'}\nBe specific, vivid, and professional.`,
  },

  script: {
    system: `You are a professional screenwriter and script writer. Write complete, properly formatted scripts.
Structure your output with clear sections: Title, Logline, Characters, then the full script with scene headings (INT./EXT.), action lines, character names centered above dialogue, and transitions.
Return only the script — no meta-commentary.`,
    build: ({ idea, format, genre, duration, audience, language, tone, characters, setting }) =>
      `Write a complete ${format || 'short film'} script.\nIdea: ${idea}\nGenre: ${genre || 'Drama'}\nDuration: ${duration || '5 minutes'}\nTarget Audience: ${audience || 'General'}\nLanguage: ${language || 'English'}\nTone: ${tone || 'Serious'}\nNumber of Characters: ${characters || '2'}\nSetting: ${setting || 'Contemporary'}`,
  },

  story_idea: {
    system: `You are a creative development executive and story consultant. Help filmmakers and writers develop compelling story ideas.
Return a structured development document with these sections:
**Title Ideas** | **Logline** | **Synopsis** | **Main Characters** | **Character Motivations** | **Central Conflict** | **Story Arc** | **Three-Act Structure** | **Major Plot Points** | **Twist Ideas** | **Ending Options**`,
    build: ({ idea, genre, tone }) =>
      `Develop this story idea into a full creative document.\nIdea: ${idea}\nGenre: ${genre || 'Drama'}\nTone: ${tone || 'Serious'}`,
  },

  scene: {
    system: `You are a film director and screenwriter. Generate detailed, cinematic scene breakdowns.
For each scene return:
**Scene Heading** | **Scene Description** | **Characters Present** | **Location** | **Time** | **Action** | **Dialogue** | **Camera Directions** | **Shot Suggestions** | **Lighting** | **Mood** | **Sound/Music** | **AI Video Prompt**`,
    build: ({ story, sceneNumber, instruction }) =>
      `Generate a detailed scene breakdown.\nStory/Context: ${story}\nScene Number: ${sceneNumber || 1}\nSpecial Instruction: ${instruction || 'Make it cinematic and emotionally engaging'}`,
  },

  shot_plan: {
    system: `You are a professional cinematographer and director of photography. Generate detailed shot lists.
For each shot provide: Shot Type | Description | Camera Movement | Lens | Framing Notes | Mood | AI Video Prompt.
Cover a variety of shot types: establishing, wide, medium, close-up, extreme close-up, OTS, POV, tracking, dolly, crane, handheld.`,
    build: ({ scene, style }) =>
      `Generate a complete shot list for this scene.\nScene: ${scene}\nVisual Style: ${style || 'Cinematic'}`,
  },

  character: {
    system: `You are a character development specialist and casting director. Create rich, detailed characters.
Return a structured character profile:
**Name** | **Age** | **Appearance** | **Personality** | **Background** | **Goals** | **Motivation** | **Strengths** | **Weaknesses** | **Character Arc** | **Relationships** | **Consistent Visual Description** (reusable AI prompt for this character across scenes)`,
    build: ({ description, genre, role }) =>
      `Create a detailed character profile.\nDescription: ${description}\nGenre/World: ${genre || 'Contemporary Drama'}\nRole in Story: ${role || 'Protagonist'}`,
  },

  enhance_prompt: {
    system: `You are an expert AI video prompt engineer. Enhance existing prompts to be more detailed, cinematic, and effective for AI video generation.
Return two clearly labeled sections:
**Original Prompt:**
[the original prompt]

**Enhanced Prompt:**
[the improved prompt with added cinematography, camera movement, lighting, environment, character actions, composition, visual consistency, realism, and atmosphere]

**What Was Added:**
[bullet list of improvements made]`,
    build: ({ prompt }) =>
      `Enhance this AI video generation prompt to be more detailed and cinematic.\nOriginal Prompt: ${prompt}`,
  },
};

class VideoStudioService {
  async generate(userId, tool, inputs) {
    const definition = TOOLS[tool];
    if (!definition) throw new AppError(`Unknown video studio tool: ${tool}`, 400);

    const startTime = Date.now();
    const userPrompt = definition.build(inputs);
    const { content, tokensUsed, model } = await openaiService.generate(
      '_raw',
      userPrompt,
      {},
      [],
      [],
      [],
      { systemOverride: definition.system }
    );

    const [generation] = await Promise.all([
      Generation.create({
        userId,
        type: 'video_studio',
        prompt: inputs.idea || inputs.prompt || inputs.scene || inputs.story || inputs.description || tool,
        content,
        parameters: { style: inputs.style || tool },
        metadata: { model, tokensUsed, generationTimeMs: Date.now() - startTime },
      }),
      User.findByIdAndUpdate(userId, { $inc: { generationCount: 1 } }),
    ]);

    return { content, tokensUsed, model, tool, generationId: generation._id };
  }
}

module.exports = new VideoStudioService();
