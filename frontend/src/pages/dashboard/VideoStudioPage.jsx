import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiVideoLine,
  RiFileTextLine,
  RiLightbulbLine,
  RiFilmLine,
  RiCameraLine,
  RiUserStarLine,
  RiMagicLine,
  RiSparklingLine,
  RiFileCopyLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiRefreshLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useVideoStudio } from '../../hooks/useVideoStudio';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

const TABS = [
  { id: 'video_prompt', label: 'Video Prompt', icon: RiVideoLine, description: 'Generate AI video prompts' },
  { id: 'script', label: 'Script Writer', icon: RiFileTextLine, description: 'Write full scripts' },
  { id: 'story_idea', label: 'Story Idea', icon: RiLightbulbLine, description: 'Develop ideas from scratch' },
  { id: 'scene', label: 'Scene Generator', icon: RiFilmLine, description: 'Generate detailed scenes' },
  { id: 'shot_plan', label: 'Shot Planner', icon: RiCameraLine, description: 'Plan camera shots' },
  { id: 'character', label: 'Character Creator', icon: RiUserStarLine, description: 'Build rich characters' },
  { id: 'enhance_prompt', label: 'Prompt Enhancer', icon: RiMagicLine, description: 'Improve existing prompts' },
];

const STYLE_OPTIONS = [
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Realistic', label: 'Realistic' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Action', label: 'Action' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Bollywood', label: 'Bollywood' },
  { value: 'Short Film', label: 'Short Film' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Music Video', label: 'Music Video' },
];

const FORMAT_OPTIONS = [
  { value: 'YouTube video', label: 'YouTube Video' },
  { value: 'short film', label: 'Short Film' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'Instagram Reel', label: 'Instagram Reel' },
  { value: 'movie', label: 'Movie' },
  { value: 'web series episode', label: 'Web Series' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'music video', label: 'Music Video' },
];

const GENRE_OPTIONS = [
  { value: 'Drama', label: 'Drama' },
  { value: 'Thriller', label: 'Thriller' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Action', label: 'Action' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Biographical', label: 'Biographical' },
];

const TONE_OPTIONS = [
  { value: 'Serious', label: 'Serious' },
  { value: 'Humorous', label: 'Humorous' },
  { value: 'Dark', label: 'Dark' },
  { value: 'Uplifting', label: 'Uplifting' },
  { value: 'Melancholic', label: 'Melancholic' },
  { value: 'Suspenseful', label: 'Suspenseful' },
  { value: 'Romantic', label: 'Romantic' },
  { value: 'Inspirational', label: 'Inspirational' },
];

function ResultBox({ content, onRegenerate, onClear, isGenerating }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Result</span>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => copy(content)}>
              {copied ? <RiCheckLine className="text-[var(--color-success)]" /> : <RiFileCopyLine />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onRegenerate} isLoading={isGenerating}>
              <RiRefreshLine />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <RiDeleteBinLine />
              Clear
            </Button>
          </div>
        </div>
        <div className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)] font-[var(--font-mono)] leading-relaxed">
          {content}
        </div>
      </Card>
    </motion.div>
  );
}

function VideoPromptTool({ onGenerate, isGenerating, result, onClear }) {
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const lastInputs = { idea, style };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return toast.error('Please describe your video idea');
    onGenerate('video_prompt', lastInputs);
  };

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (idea.trim()) onGenerate('video_prompt', { idea, style }); } };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Describe your video idea"
        placeholder="A detective walks through a rainy Mumbai street at night, neon signs reflecting on wet pavement..."
        rows={4}
        maxLength={2000}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Select label="Visual Style" options={STYLE_OPTIONS} value={style} onChange={(e) => setStyle(e.target.value)} />
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Generating...' : 'Generate Video Prompt'}
      </Button>
      <p className="text-center text-xs text-[var(--color-text-muted)]">Enter to generate · Shift+Enter for new line</p>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('video_prompt', lastInputs)} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function ScriptTool({ onGenerate, isGenerating, result, onClear }) {
  const [inputs, setInputs] = useState({ idea: '', format: 'short film', genre: 'Drama', duration: '5 minutes', audience: 'General', language: 'English', tone: 'Serious', characters: '2', setting: '' });
  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.idea.trim()) return toast.error('Please enter your story idea');
    onGenerate('script', inputs);
  };

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (inputs.idea.trim()) onGenerate('script', inputs); } };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Story / Idea" placeholder="A young woman discovers her late grandmother was a spy during the Cold War..." rows={3} maxLength={2000} value={inputs.idea} onChange={set('idea')} onKeyDown={onKeyDown} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Format" options={FORMAT_OPTIONS} value={inputs.format} onChange={set('format')} />
        <Select label="Genre" options={GENRE_OPTIONS} value={inputs.genre} onChange={set('genre')} />
        <Select label="Tone" options={TONE_OPTIONS} value={inputs.tone} onChange={set('tone')} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Duration</label>
          <input value={inputs.duration} onChange={set('duration')} placeholder="e.g. 5 minutes" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Language</label>
          <input value={inputs.language} onChange={set('language')} placeholder="English" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Characters</label>
          <input value={inputs.characters} onChange={set('characters')} placeholder="2" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Setting</label>
        <input value={inputs.setting} onChange={set('setting')} placeholder="Contemporary Mumbai, 2024" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
      </div>
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Writing Script...' : 'Write Script'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('script', inputs)} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function StoryIdeaTool({ onGenerate, isGenerating, result, onClear }) {
  const [idea, setIdea] = useState('');
  const [genre, setGenre] = useState('Drama');
  const [tone, setTone] = useState('Serious');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return toast.error('Please enter your story idea');
    onGenerate('story_idea', { idea, genre, tone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Your idea" placeholder="A psychological thriller about a man who receives messages from his future self..." rows={3} maxLength={2000} value={idea} onChange={(e) => setIdea(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (idea.trim()) onGenerate('story_idea', { idea, genre, tone }); } }} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Genre" options={GENRE_OPTIONS} value={genre} onChange={(e) => setGenre(e.target.value)} />
        <Select label="Tone" options={TONE_OPTIONS} value={tone} onChange={(e) => setTone(e.target.value)} />
      </div>
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Developing...' : 'Develop Story Idea'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('story_idea', { idea, genre, tone })} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function SceneTool({ onGenerate, isGenerating, result, onClear }) {
  const [story, setStory] = useState('');
  const [sceneNumber, setSceneNumber] = useState('1');
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!story.trim()) return toast.error('Please provide story context');
    onGenerate('scene', { story, sceneNumber, instruction });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Story / Context" placeholder="A detective story set in 1940s Mumbai..." rows={4} maxLength={2000} value={story} onChange={(e) => setStory(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (story.trim()) onGenerate('scene', { story, sceneNumber, instruction }); } }} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Scene Number</label>
          <input value={sceneNumber} onChange={(e) => setSceneNumber(e.target.value)} placeholder="1" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Special Instruction</label>
          <input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Make it more emotional" className="h-11 px-3 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
        </div>
      </div>
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Generating Scene...' : 'Generate Scene'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('scene', { story, sceneNumber, instruction })} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function ShotPlanTool({ onGenerate, isGenerating, result, onClear }) {
  const [scene, setScene] = useState('');
  const [style, setStyle] = useState('Cinematic');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scene.trim()) return toast.error('Please describe the scene');
    onGenerate('shot_plan', { scene, style });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Scene Description" placeholder="A tense confrontation between two rivals in a dimly lit parking garage..." rows={4} maxLength={2000} value={scene} onChange={(e) => setScene(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (scene.trim()) onGenerate('shot_plan', { scene, style }); } }} />
      <Select label="Visual Style" options={STYLE_OPTIONS} value={style} onChange={(e) => setStyle(e.target.value)} />
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Planning Shots...' : 'Generate Shot List'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('shot_plan', { scene, style })} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function CharacterTool({ onGenerate, isGenerating, result, onClear }) {
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Drama');
  const [role, setRole] = useState('Protagonist');

  const ROLE_OPTIONS = [
    { value: 'Protagonist', label: 'Protagonist' },
    { value: 'Antagonist', label: 'Antagonist' },
    { value: 'Supporting Character', label: 'Supporting' },
    { value: 'Mentor', label: 'Mentor' },
    { value: 'Love Interest', label: 'Love Interest' },
    { value: 'Comic Relief', label: 'Comic Relief' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return toast.error('Please describe your character');
    onGenerate('character', { description, genre, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Character Description" placeholder="A 35-year-old female forensic scientist who lost her memory in an accident..." rows={3} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (description.trim()) onGenerate('character', { description, genre, role }); } }} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Genre / World" options={GENRE_OPTIONS} value={genre} onChange={(e) => setGenre(e.target.value)} />
        <Select label="Role in Story" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiSparklingLine />
        {isGenerating ? 'Creating Character...' : 'Create Character'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('character', { description, genre, role })} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

function EnhancePromptTool({ onGenerate, isGenerating, result, onClear }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return toast.error('Please paste a prompt to enhance');
    onGenerate('enhance_prompt', { prompt });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea label="Your existing prompt" placeholder="Paste your AI video prompt here to enhance it..." rows={5} maxLength={2000} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (prompt.trim()) onGenerate('enhance_prompt', { prompt }); } }} />
      <Button type="submit" isLoading={isGenerating} className="w-full">
        <RiMagicLine />
        {isGenerating ? 'Enhancing...' : 'Enhance Prompt'}
      </Button>
      <AnimatePresence>
        {result && <ResultBox content={result.content} onRegenerate={() => onGenerate('enhance_prompt', { prompt })} onClear={onClear} isGenerating={isGenerating} />}
      </AnimatePresence>
    </form>
  );
}

const TOOL_COMPONENTS = {
  video_prompt: VideoPromptTool,
  script: ScriptTool,
  story_idea: StoryIdeaTool,
  scene: SceneTool,
  shot_plan: ShotPlanTool,
  character: CharacterTool,
  enhance_prompt: EnhancePromptTool,
};

function VideoStudioPage() {
  const [activeTab, setActiveTab] = useState('video_prompt');
  const { isGenerating, result, generate, reset } = useVideoStudio();

  const ActiveTool = TOOL_COMPONENTS[activeTab];
  const activeTabData = TABS.find((t) => t.id === activeTab);

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      reset();
      setActiveTab(tabId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <RiVideoLine className="text-white text-base" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">AI Video Studio</h1>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          From idea to script to scenes to AI video prompts — your complete pre-production workspace.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-8 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium whitespace-nowrap transition-colors duration-150 shrink-0
              ${activeTab === id
                ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] border border-transparent'
              }`}
          >
            <Icon className="text-sm shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Active Tool */}
      <div>
        <div className="mb-5">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">{activeTabData?.description}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ActiveTool onGenerate={generate} isGenerating={isGenerating} result={result} onClear={reset} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VideoStudioPage;
