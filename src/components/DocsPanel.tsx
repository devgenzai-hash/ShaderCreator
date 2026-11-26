import { useState } from 'react'
import { nodeTemplates } from '../engine/shaderNodes'

interface NodeDoc {
  type: string
  name: string
  category: string
  whatItDoes: string
  howItWorks: string
  whenToUse: string
  parameters: { name: string; description: string }[]
  tips: string[]
  example: string
}

const nodeDocs: NodeDoc[] = [
  // INPUT NODES
  {
    type: 'uv',
    name: 'UV Coordinates',
    category: 'Input',
    whatItDoes: 'Gives you the position of each pixel on the screen as a 2D coordinate (x, y) where both values go from 0 to 1.',
    howItWorks: 'Think of your shader as a canvas. UV coordinates tell each pixel "where am I?" — (0,0) is the bottom-left corner, (1,1) is the top-right. The X value increases left-to-right, Y increases bottom-to-top.',
    whenToUse: 'Almost every shader needs this! It\'s the starting point for positioning colors, textures, and effects. Connect it to other nodes that need to know "where" to draw things.',
    parameters: [],
    tips: [
      'This is usually the FIRST node you add to any shader',
      'Connect it to Noise, Pattern, Gradient, or Texture nodes',
      'You can distort UVs before using them to create warped effects',
    ],
    example: 'UV → Gradient = smooth color transition across the screen',
  },
  {
    type: 'time',
    name: 'Time',
    category: 'Input',
    whatItDoes: 'Outputs a number that keeps increasing as time passes. This makes things animate and move.',
    howItWorks: 'Every frame, the time value goes up a little bit. When you add this value to other calculations, things start to move/change/pulse. Speed controls how fast the number increases.',
    whenToUse: 'Whenever you want animation! Connect it to anything you want to move, pulse, rotate, or change over time.',
    parameters: [
      { name: 'speed', description: 'How fast time passes. 1.0 = normal, 2.0 = double speed, 0.5 = half speed' },
    ],
    tips: [
      'Low speed (0.1-0.5) = slow, dreamy animations',
      'High speed (2-5) = fast, energetic effects',
      'Multiply time by different values for different animation rates in the same shader',
    ],
    example: 'Time → Noise = flowing, ever-changing noise pattern',
  },
  {
    type: 'mouse',
    name: 'Mouse Position',
    category: 'Input',
    whatItDoes: 'Tracks where the user\'s mouse cursor is on the screen and outputs it as a 2D position.',
    howItWorks: 'The mouse position is normalized (0 to 1), where (0,0) is bottom-left and (1,1) is top-right. You can use this to make effects follow the cursor or react to mouse movement.',
    whenToUse: 'For interactive shaders! Hover effects, cursor trails, spotlight effects, or anything that should respond to user input.',
    parameters: [
      { name: 'smoothing', description: 'How smoothly the position transitions (0 = instant, 1 = very smooth/delayed)' },
      { name: 'influence', description: 'How strongly the mouse affects the shader (higher = more dramatic)' },
    ],
    tips: [
      'Great for hero sections where you want subtle interaction',
      'Combine with Distortion for a "magnifying glass" effect',
      'Use with Light nodes to create a cursor spotlight',
    ],
    example: 'Mouse → Light position = spotlight follows cursor',
  },
  {
    type: 'click',
    name: 'Click Event',
    category: 'Input',
    whatItDoes: 'Creates a pulse or ripple at the point where the user clicks. The effect fades over time.',
    howItWorks: 'When clicked, it records the position and starts a timer. The output value starts strong and decays over time (controlled by the decay parameter). The radius controls how far the ripple spreads.',
    whenToUse: 'For click-to-interact effects like ripples, explosions, or expanding circles on user click.',
    parameters: [
      { name: 'radius', description: 'How far the click effect spreads (bigger = wider ripple)' },
      { name: 'decay', description: 'How fast the click effect fades away (higher = fades faster)' },
      { name: 'intensity', description: 'How strong/bright the click effect is' },
    ],
    tips: [
      'Combine with Particles for a "click to burst" effect',
      'Use low decay for lingering effects',
      'Stack multiple click nodes for different sized ripples',
    ],
    example: 'Click → Color mix = color splash where you click',
  },
  {
    type: 'scroll',
    name: 'Scroll Position',
    category: 'Input',
    whatItDoes: 'Outputs how far the user has scrolled down the page (0 at top, increases as you scroll).',
    howItWorks: 'As the user scrolls, this value changes. You can use it to gradually reveal effects, change colors, or drive animations based on scroll progress.',
    whenToUse: 'For scroll-driven animations and transitions. Great for storytelling pages where the shader changes as you read.',
    parameters: [
      { name: 'multiplier', description: 'Scales the scroll value (2.0 = shader changes twice as fast per scroll)' },
    ],
    tips: [
      'Connect to Mix node to transition between two states',
      'Use as a Time replacement for scroll-driven animation',
      'Great for parallax-style depth effects',
    ],
    example: 'Scroll → Gradient angle = colors rotate as you scroll',
  },

  // COLOR NODES
  {
    type: 'color',
    name: 'Solid Color',
    category: 'Color',
    whatItDoes: 'Outputs a single, flat color. Like choosing a paint color from a color picker.',
    howItWorks: 'You pick a color (RGB values), and it outputs that same color for every pixel. It\'s the simplest color source — no variation, just one solid tone.',
    whenToUse: 'When you need a specific color to mix with other effects, as a base color, or to tint other outputs.',
    parameters: [
      { name: 'color', description: 'The RGB color value. Click the color picker to choose visually.' },
    ],
    tips: [
      'Use multiple Solid Colors with a Mix node to blend them',
      'Connect to Particles or Glow to set their color',
      'Use dark colors (near black) as backgrounds',
    ],
    example: 'Solid Color + Noise → Colored noise pattern',
  },
  {
    type: 'gradient',
    name: 'Gradient',
    category: 'Color',
    whatItDoes: 'Creates a smooth blend between two colors. Goes from Color A on one side to Color B on the other.',
    howItWorks: 'Using the UV coordinates, it interpolates (smoothly transitions) between two colors. The angle parameter rotates the direction of the gradient.',
    whenToUse: 'For backgrounds, sky effects, or any time you want a smooth color transition. Also great as a base to layer effects on top of.',
    parameters: [
      { name: 'colorA', description: 'The starting color (e.g., left side or top)' },
      { name: 'colorB', description: 'The ending color (e.g., right side or bottom)' },
      { name: 'angle', description: 'Rotation of the gradient direction (0 = horizontal, 1.57 = vertical)' },
    ],
    tips: [
      'Animate the angle with Time for a rotating gradient',
      'Use as background with Particles on top',
      'Dark-to-dark gradients make great subtle backgrounds',
    ],
    example: 'Gradient + Time = animated shifting colors',
  },

  // MATH NODES
  {
    type: 'math',
    name: 'Math Operation',
    category: 'Math',
    whatItDoes: 'Performs basic math on values: add, subtract, multiply, divide, sin, cos, power, etc.',
    howItWorks: 'Takes one or two input values and performs a mathematical operation. The result can be used to control other parameters or combine effects.',
    whenToUse: 'To combine values, scale things up/down, create oscillations (sin/cos), or do any calculation needed between nodes.',
    parameters: [
      { name: 'operation', description: 'Which math function to use (0=multiply, 1=add, 2=subtract, 3=divide, 4=sin, 5=cos)' },
      { name: 'valueA', description: 'First input value' },
      { name: 'valueB', description: 'Second input value (for two-input operations)' },
    ],
    tips: [
      'sin/cos create smooth wave oscillations',
      'Multiply to scale effects stronger/weaker',
      'Use power (value^n) to sharpen or soften transitions',
    ],
    example: 'sin(Time) = smooth back-and-forth oscillation',
  },
  {
    type: 'mix',
    name: 'Mix / Blend',
    category: 'Math',
    whatItDoes: 'Smoothly blends between two inputs using a factor. Factor = 0 gives you input A, factor = 1 gives you input B.',
    howItWorks: 'Linear interpolation (lerp/mix) between A and B. At factor 0.5, you get an equal blend of both. You can animate the factor to transition between states.',
    whenToUse: 'To blend two colors/effects together, crossfade between states, or use a noise pattern to create organic blending.',
    parameters: [
      { name: 'factor', description: 'Blend amount: 0 = all A, 0.5 = half and half, 1 = all B' },
      { name: 'blendMode', description: 'How to combine: 0=linear mix, 1=add, 2=multiply, 3=screen' },
    ],
    tips: [
      'Connect Noise to the factor for organic blending',
      'Connect Mouse to factor for interactive transitions',
      'Connect Scroll to factor for scroll-driven transitions',
    ],
    example: 'Mix(Fire, Ice, mouse.x) = fire on left, ice on right',
  },

  // NOISE NODES
  {
    type: 'noise',
    name: 'Noise Generator',
    category: 'Noise',
    whatItDoes: 'Creates natural-looking random patterns (like clouds, terrain, or organic textures). NOT random static — it\'s smooth and flowing.',
    howItWorks: 'Uses Fractal Brownian Motion (FBM) which layers multiple scales of smooth noise. More octaves = more detail. Persistence controls how much detail shows. Speed animates the noise over time.',
    whenToUse: 'For anything organic: clouds, water, fire, terrain, smoke, fabric, organic blending, displacement, and much more.',
    parameters: [
      { name: 'scale', description: 'Zoom level of the noise. Low = large blobs, High = tiny detail' },
      { name: 'octaves', description: 'Layers of detail (1=smooth blobs, 8=very detailed). More = slower.' },
      { name: 'persistence', description: 'How much each detail layer contributes (0=smooth, 1=very detailed)' },
      { name: 'lacunarity', description: 'Gap between detail scales (2.0 is standard)' },
      { name: 'speed', description: 'How fast the noise animates/flows' },
    ],
    tips: [
      'Scale 2-5 for large cloud-like patterns',
      'Scale 10-30 for fine grain/texture',
      'Low octaves (2-3) for performance, high (5-8) for detail',
      'Use as Mix factor for organic transitions between colors',
    ],
    example: 'Noise + Color gradient = flowing lava/clouds',
  },
  {
    type: 'pattern',
    name: 'Pattern',
    category: 'Noise',
    whatItDoes: 'Generates repeating geometric shapes: stripes, dots, checkerboard, hexagons, waves.',
    howItWorks: 'Uses math (fract, step, sin) on UV coordinates to create repeating patterns. Scale controls how many repetitions. Thickness controls the line/dot width.',
    whenToUse: 'For grid backgrounds, retro patterns, tech overlays, or as a mask to cut/reveal other effects.',
    parameters: [
      { name: 'scale', description: 'How many times the pattern repeats (higher = smaller, more frequent)' },
      { name: 'patternType', description: 'Shape type: 0=stripes, 1=dots, 2=checker, 3=hexagons' },
      { name: 'thickness', description: 'How thick the lines/dots are (0=thin, 1=thick)' },
      { name: 'rotation', description: 'Rotate the entire pattern (in radians)' },
    ],
    tips: [
      'Animate rotation with Time for spinning patterns',
      'Use as a mask with Mix to reveal/hide effects in patterns',
      'Combine two patterns at different scales for moiré effects',
    ],
    example: 'Pattern (stripes) + Glow = neon grid lines',
  },

  // TEXTURE NODES
  {
    type: 'texture',
    name: 'Texture Sample',
    category: 'Texture',
    whatItDoes: 'Reads color from an uploaded image at each pixel position. Like stretching a photo across the shader.',
    howItWorks: 'Uses UV coordinates to look up what color the image has at that position. Tiling makes it repeat, offset shifts it. You can distort UVs first for warped images.',
    whenToUse: 'When you want to use an uploaded image in your shader — apply effects to photos, create animated textures, or use images as data/masks.',
    parameters: [
      { name: 'textureId', description: 'Which uploaded texture to use (0 = first, 1 = second)' },
      { name: 'tiling', description: 'How many times the texture repeats (1,1 = once, 2,2 = 2x2 grid)' },
      { name: 'offset', description: 'Shift the texture position' },
    ],
    tips: [
      'Distort UVs before sampling for liquid/wavy image effects',
      'Use grayscale images as displacement/height maps',
      'Tile seamless textures for repeating patterns',
    ],
    example: 'UV → Distortion → Texture = wavy/distorted image',
  },
  {
    type: 'image',
    name: 'Image Input',
    category: 'Texture',
    whatItDoes: 'Loads an uploaded photo/image to use in your shader. Outputs the image colors plus individual R, G, B, A channels.',
    howItWorks: 'Wraps an uploaded image into the shader. Unlike Texture Sample, this is specifically for the primary image input with fit options.',
    whenToUse: 'When your shader\'s main purpose is to process/effect an image (like a photo filter).',
    parameters: [
      { name: 'textureId', description: 'Which uploaded image to use' },
      { name: 'fit', description: '0=stretch to fill, 1=contain (show all), 2=cover (fill, may crop)' },
    ],
    tips: [
      'Upload the image in the Media panel first',
      'Connect outputs to individual channel nodes for channel manipulation',
      'Great as base for applying post-processing effects',
    ],
    example: 'Image → Color Grading → Output = photo filter',
  },
  {
    type: 'video',
    name: 'Video Input',
    category: 'Texture',
    whatItDoes: 'Plays a video file and feeds each frame into the shader as a live texture. Every frame the image updates.',
    howItWorks: 'Like Image Input but updates 30-60 times per second with new video frames. The video plays in sync with your shader.',
    whenToUse: 'For video effects, video backgrounds with shader overlays, or using video as animated texture data.',
    parameters: [
      { name: 'textureId', description: 'Which uploaded video to use' },
      { name: 'playbackSpeed', description: 'Video speed: 1.0=normal, 0.5=slow-mo, 2.0=fast' },
      { name: 'loop', description: 'Whether the video loops when it ends' },
    ],
    tips: [
      'Apply Distortion after video for a warped video effect',
      'Use Chromatic Aberration for glitch-style video',
      'Combine video with Particles for layered effects',
    ],
    example: 'Video → Distortion → Glow → Output = stylized music video',
  },

  // LIGHTING NODES
  {
    type: 'light',
    name: 'Point Light',
    category: 'Lighting',
    whatItDoes: 'Simulates a light source at a specific point. Creates bright spots and shadows based on surface angle.',
    howItWorks: 'Calculates how much light hits each pixel based on the angle between the surface normal and the light direction. Closer pixels are brighter (falloff), and pixels facing the light are brighter (diffuse).',
    whenToUse: 'For 3D-looking effects, adding depth to flat shaders, creating spotlights, or simulating realistic lighting.',
    parameters: [
      { name: 'position', description: 'Where the light is in 3D space (x, y, z). Z controls distance.' },
      { name: 'color', description: 'Light color (white light, warm light, colored light, etc.)' },
      { name: 'intensity', description: 'How bright the light is (higher = brighter, wider reach)' },
      { name: 'falloff', description: 'How fast light dims with distance (higher = quicker dimming)' },
    ],
    tips: [
      'Connect Mouse position to light position for interactive spotlights',
      'Use multiple lights with different colors for dramatic effects',
      'Combine with Normal Map for surface detail under lighting',
    ],
    example: 'Mouse → Light position = cursor becomes a flashlight',
  },
  {
    type: 'fresnel',
    name: 'Fresnel Effect',
    category: 'Lighting',
    whatItDoes: 'Makes edges glow brighter than the center, like a rim light or halo around objects. Think of how glass/water glows at edges.',
    howItWorks: 'The "Fresnel effect" in physics means surfaces reflect more light at steep angles. In shaders, this creates a glowing edge/rim effect that\'s brighter where the surface curves away from you.',
    whenToUse: 'For edge glow, holographic effects, force-fields, sci-fi UIs, or making objects look shiny/ethereal.',
    parameters: [
      { name: 'power', description: 'How sharp the edge glow is (low=wide glow, high=thin edge line)' },
      { name: 'color', description: 'Color of the edge glow' },
      { name: 'intensity', description: 'How bright the glow is' },
    ],
    tips: [
      'Power 1-2 = wide soft glow (fog/atmosphere)',
      'Power 4-8 = thin sharp edge (hologram/force-field)',
      'Animate intensity with Time for pulsing edge glow',
    ],
    example: 'Fresnel (cyan) + dark background = holographic orb',
  },
  {
    type: 'normal',
    name: 'Normal Map',
    category: 'Lighting',
    whatItDoes: 'Fakes surface bumps and detail without actual 3D geometry. Makes flat surfaces look textured.',
    howItWorks: 'Normal maps encode surface angle information as colors. The shader uses this to calculate lighting as if the surface has bumps, grooves, and details — all without extra geometry.',
    whenToUse: 'To add surface detail (brick, leather, metal, fabric texture) to objects. Especially useful with Point Light nodes.',
    parameters: [
      { name: 'strength', description: 'How pronounced the bumps appear (0=flat, 5=very bumpy)' },
    ],
    tips: [
      'Use a noise texture as input for procedural bumps',
      'Must be combined with a Light node to see the effect',
      'Subtle strength (0.5-1.5) looks most realistic',
    ],
    example: 'Noise → Normal Map → Light = bumpy lit surface',
  },

  // EFFECTS NODES
  {
    type: 'particles',
    name: 'Particles',
    category: 'Effects',
    whatItDoes: 'Creates many small glowing dots that float/drift around. Like fireflies, stars, or dust motes.',
    howItWorks: 'Generates random positions for each particle using math. Each particle is a small bright dot. They move based on speed and are affected by gravity. The more particles, the denser the field.',
    whenToUse: 'For magical effects, starfields, floating dust, fireflies, snow, bubbles, or any "floating dots" effect.',
    parameters: [
      { name: 'count', description: 'How many particles (more = denser, but slower). 20-100 is typical.' },
      { name: 'size', description: 'How big each particle dot is (0.01 = tiny, 0.1 = large)' },
      { name: 'speed', description: 'How fast particles drift' },
      { name: 'color', description: 'Particle color' },
      { name: 'spread', description: 'How spread out particles are (1=full screen, 0.5=clustered)' },
      { name: 'gravity', description: 'Upward (-) or downward (+) drift. 0=float sideways.' },
    ],
    tips: [
      'Negative gravity = particles rise (fire sparks, bubbles)',
      'Small size + many particles = star field',
      'Large size + few particles + slow = floating orbs',
      'Layer on top of a dark gradient for best visibility',
    ],
    example: 'Particles (gold, rising) + dark gradient = magical fireflies',
  },
  {
    type: 'distortion',
    name: 'Distortion',
    category: 'Effects',
    whatItDoes: 'Warps and bends the image/pattern like looking through water or wavy glass.',
    howItWorks: 'Modifies UV coordinates using sine/cosine waves before other nodes read them. This makes everything downstream appear bent, wavy, or rippled.',
    whenToUse: 'For water effects, heat haze, dream sequences, or making static textures feel alive and organic.',
    parameters: [
      { name: 'strength', description: 'How much warping (0=none, 0.1=subtle, 0.5=extreme)' },
      { name: 'frequency', description: 'How many wave ripples (low=large waves, high=many small waves)' },
      { name: 'speed', description: 'How fast the distortion animates' },
    ],
    tips: [
      'Subtle distortion (0.01-0.05) on images = underwater/glass look',
      'Apply BEFORE texture sampling to distort images',
      'Connect Mouse to strength for interactive distortion',
    ],
    example: 'UV → Distortion → Image = underwater photo effect',
  },
  {
    type: 'blur',
    name: 'Blur',
    category: 'Effects',
    whatItDoes: 'Makes things look soft and out of focus, like a camera bokeh or frosted glass effect.',
    howItWorks: 'For each pixel, it averages the colors of nearby pixels. More radius = more neighbors averaged = more blur. Quality controls how many samples it takes.',
    whenToUse: 'For depth-of-field effects, frosted glass, glow halos, or softening harsh edges.',
    parameters: [
      { name: 'radius', description: 'How blurry (0=sharp, 10=very blurry)' },
      { name: 'quality', description: 'Sample count for blur (higher=smoother but slower)' },
      { name: 'type', description: '0=gaussian (even), 1=radial (from center), 2=directional' },
    ],
    tips: [
      'Use small blur (1-3) for subtle softness',
      'Combine with Glow for bloom/light-leak effects',
      'Blur only the bright parts for cinematic bloom',
    ],
    example: 'Image → Blur → Add to original = dreamy glow',
  },
  {
    type: 'glow',
    name: 'Glow / Bloom',
    category: 'Effects',
    whatItDoes: 'Makes bright areas bleed light outward, like a glowing neon sign or looking at lights with foggy vision.',
    howItWorks: 'Finds pixels brighter than the threshold, then spreads their brightness outward. Only bright things glow — dark areas stay dark.',
    whenToUse: 'For neon effects, magical glow, sci-fi UIs, making lights feel more realistic, or emphasizing bright elements.',
    parameters: [
      { name: 'threshold', description: 'Minimum brightness to glow (0=everything glows, 1=only pure white)' },
      { name: 'intensity', description: 'How bright the glow is' },
      { name: 'radius', description: 'How far the glow spreads' },
      { name: 'color', description: 'Tint the glow with a specific color' },
    ],
    tips: [
      'Low threshold (0.3-0.5) = lots of glow, dreamy look',
      'High threshold (0.7-0.9) = only highlights glow, cinematic',
      'Colored glow on patterns = instant neon signs',
    ],
    example: 'Pattern → Glow (cyan) = neon grid lines',
  },

  // OUTPUT
  {
    type: 'output',
    name: 'Shader Output',
    category: 'Output',
    whatItDoes: 'The final destination. Whatever color arrives here is what shows on screen. Every shader needs exactly one Output.',
    howItWorks: 'Takes the final calculated color and displays it. Alpha controls transparency (1=solid, 0=invisible). Connect your final color result here.',
    whenToUse: 'ALWAYS. This is required. It\'s the end of your node chain.',
    parameters: [
      { name: 'alpha', description: 'Transparency: 1.0=fully visible, 0.5=semi-transparent, 0.0=invisible' },
    ],
    tips: [
      'Only connect ONE thing to the Output color input',
      'Use Mix node to combine multiple effects before Output',
      'Alpha < 1.0 lets the website background show through',
    ],
    example: 'Mix(effect1, effect2) → Output = combined final result',
  },

  // ============================
  // NEW INPUT NODES
  // ============================
  {
    type: 'position',
    name: 'Position',
    category: 'Input',
    whatItDoes: 'Gives you the 3D position of each pixel in world space (x, y, z coordinates).',
    howItWorks: 'Unlike UV which is 2D (flat screen), Position gives 3D coordinates. This is useful when your shader is applied to a 3D object and you want effects based on actual 3D location.',
    whenToUse: 'For 3D effects: applying colors based on height (y), creating world-space patterns that don\'t stretch on angled surfaces, or positioning lights in 3D.',
    parameters: [
      { name: 'space', description: '0 = world space (absolute position), 1 = local/object space (relative to object center)' },
    ],
    tips: [
      'Use Y position to create height-based gradients on 3D objects',
      'Combine with distance calculations for proximity effects',
      'Great with PBR Lighting for realistic 3D shading',
    ],
    example: 'Position.y → Gradient = color changes based on height',
  },
  {
    type: 'uniform',
    name: 'Custom Uniform',
    category: 'Input',
    whatItDoes: 'Lets you create your own controllable value that can be changed from outside the shader (like a slider on your website).',
    howItWorks: 'A "uniform" is a value that stays the same for all pixels in one frame but can be changed from JavaScript code. It\'s how you control shaders from your UI.',
    whenToUse: 'When you want to control a shader parameter from your website — sliders, toggles, scroll-driven values, audio reactivity, or any external input.',
    parameters: [
      { name: 'value', description: 'The current value of the uniform (can be changed at runtime)' },
    ],
    tips: [
      'Name your uniforms clearly for easy JavaScript access',
      'Use for interactive controls users can adjust',
      'Connect to any parameter that should be controllable externally',
    ],
    example: 'Custom Uniform → Noise scale = user slider controls texture zoom',
  },
  {
    type: 'resolution',
    name: 'Resolution',
    category: 'Input',
    whatItDoes: 'Gives you the screen/canvas size in pixels and the aspect ratio.',
    howItWorks: 'Outputs the width and height of the rendering area in pixels, and the aspect ratio (width/height). Useful for making effects that look correct regardless of screen size.',
    whenToUse: 'When you need pixel-perfect effects, correct circle shapes (not stretched), or responsive shaders that adapt to screen size.',
    parameters: [],
    tips: [
      'Divide position by resolution for pixel-perfect UVs',
      'Use aspect ratio to keep circles circular on non-square screens',
      'Essential for any effect that uses pixel measurements',
    ],
    example: 'Resolution → correct aspect ratio for perfect circles',
  },

  // ============================
  // NEW PROCESSING NODES
  // ============================
  {
    type: 'trigonometry',
    name: 'Trigonometry',
    category: 'Math',
    whatItDoes: 'Creates smooth wave shapes using sin, cos, tan functions. These make things oscillate back and forth smoothly.',
    howItWorks: 'Sin/cos output values that wave between -1 and +1 smoothly. By changing frequency (how fast it waves) and amplitude (how big the waves are), you can create pulses, oscillations, and wave patterns.',
    whenToUse: 'For any smooth oscillating motion: breathing effects, wave patterns, circular motion, smooth pulsing, or converting linear motion into wave-like motion.',
    parameters: [
      { name: 'function', description: '0=sin, 1=cos, 2=tan, 3=asin, 4=acos, 5=atan' },
      { name: 'frequency', description: 'How many waves per unit (higher = faster/more waves)' },
      { name: 'amplitude', description: 'How tall the waves are (higher = bigger oscillation)' },
      { name: 'offset', description: 'Shifts the output up or down (centers the wave)' },
    ],
    tips: [
      'sin(time) = smooth back-and-forth forever',
      'Use frequency to control wave speed when multiplied by time',
      'cos is just sin shifted by 90° — use both for circular motion',
      'Amplitude 0.5 + offset 0.5 = wave between 0 and 1 (useful!)',
    ],
    example: 'sin(Time * frequency) * amplitude = smooth pulsing glow',
  },
  {
    type: 'vectorOps',
    name: 'Vector Operations',
    category: 'Math',
    whatItDoes: 'Performs operations on direction/position vectors: dot product, cross product, normalize, length, distance, reflect.',
    howItWorks: 'Vectors are arrows with direction and length. Dot product tells you how aligned two vectors are. Cross product gives a perpendicular vector. Normalize makes a vector length 1. Length measures how long a vector is.',
    whenToUse: 'For lighting (dot product with normals), reflections, distance calculations, or any math involving directions/positions.',
    parameters: [
      { name: 'operation', description: '0=dot, 1=cross, 2=normalize, 3=length, 4=distance, 5=reflect' },
      { name: 'vecA', description: 'First vector input' },
      { name: 'vecB', description: 'Second vector input (for two-vector operations)' },
    ],
    tips: [
      'Dot product = -1 (opposite), 0 (perpendicular), 1 (same direction)',
      'Length of (uv - point) = distance from that point (for radial effects)',
      'Normalize before dot products for correct results',
    ],
    example: 'dot(normal, lightDir) = basic lighting',
  },
  {
    type: 'logicBranch',
    name: 'Logic / Branch',
    category: 'Math',
    whatItDoes: 'Makes decisions in the shader: "if this value is above X, do this, otherwise do that." Like an if/else statement.',
    howItWorks: 'Uses smoothstep to create a smooth transition around the threshold. Below threshold = 0 (false), above = 1 (true). Smoothness controls how gradual the transition is.',
    whenToUse: 'For masking, thresholding, conditional effects, or splitting a shader into regions (e.g., top half vs bottom half).',
    parameters: [
      { name: 'threshold', description: 'The cutoff point (values below = 0, above = 1)' },
      { name: 'smoothness', description: 'How gradual the transition is (0 = sharp line, 1 = very gradual)' },
    ],
    tips: [
      'Use Noise as input to create organic masked regions',
      'Chain multiple branches for complex region logic',
      'Smoothness 0 = hard edge (like a mask), 0.1+ = soft feathered edge',
    ],
    example: 'Noise → Branch(0.5) = organic mask splitting two effects',
  },
  {
    type: 'filter',
    name: 'Filter',
    category: 'Math',
    whatItDoes: 'Applies image processing filters: edge detection, sharpen, emboss, sobel. Makes edges visible or enhances detail.',
    howItWorks: 'Samples neighboring pixels and compares them using a "kernel" (a small grid of weights). Differences between neighbors reveal edges, or emphasizing the center pixel sharpens.',
    whenToUse: 'For outline/edge effects, sharpening textures, creating sketch/comic looks, or detecting boundaries in images.',
    parameters: [
      { name: 'type', description: '0=edge detect, 1=sharpen, 2=emboss, 3=sobel' },
      { name: 'strength', description: 'How strong the filter effect is' },
      { name: 'radius', description: 'How far apart the sample points are (larger = thicker edges)' },
    ],
    tips: [
      'Edge detect on a photo = sketch/outline effect',
      'Sharpen a blurry texture to add crispness',
      'Combine edge detect + Glow for neon outline look',
    ],
    example: 'Image → Edge Detect → Glow = neon outline art',
  },
  {
    type: 'step',
    name: 'Step / Smoothstep',
    category: 'Math',
    whatItDoes: 'Creates a cutoff: values below edge1 become 0, values above edge2 become 1, with a smooth transition between.',
    howItWorks: 'Smoothstep is like a dimmer switch. Edge1 is where it starts turning on, edge2 is where it\'s fully on. Between them, it transitions smoothly (not linearly — it eases in/out).',
    whenToUse: 'For creating masks, thresholds, soft edges, or converting gradual gradients into defined shapes.',
    parameters: [
      { name: 'edge1', description: 'Lower edge — below this, output is 0' },
      { name: 'edge2', description: 'Upper edge — above this, output is 1' },
    ],
    tips: [
      'Small gap (edge1=0.49, edge2=0.51) = nearly sharp cutoff',
      'Large gap (edge1=0.2, edge2=0.8) = very gradual fade',
      'Use to turn noise into defined cloud shapes',
    ],
    example: 'Noise → Smoothstep(0.4, 0.6) = defined cloud shapes from noise',
  },
  {
    type: 'clamp',
    name: 'Clamp / Saturate',
    category: 'Math',
    whatItDoes: 'Restricts a value to stay within a range. If it goes below min, it becomes min. If above max, it becomes max.',
    howItWorks: 'Like guardrails — prevents values from going too high or too low. "Saturate" is clamp(0, 1) which is the most common case.',
    whenToUse: 'To prevent color overflow (values > 1), ensure positive values, or limit effects to a specific range.',
    parameters: [
      { name: 'minVal', description: 'The minimum allowed value' },
      { name: 'maxVal', description: 'The maximum allowed value' },
    ],
    tips: [
      'Clamp(0, 1) after any color calculation to prevent artifacts',
      'Use to limit particle brightness',
      'Clamp noise before using as a Mix factor',
    ],
    example: 'Bright glow → Clamp(0, 1) = prevents white-out artifacts',
  },
  {
    type: 'remap',
    name: 'Remap Range',
    category: 'Math',
    whatItDoes: 'Converts a value from one range to another. Like converting Celsius to Fahrenheit — same information, different scale.',
    howItWorks: 'If input goes from inMin to inMax, the output will proportionally go from outMin to outMax. Example: remap noise (0-1) to (-1 to 1).',
    whenToUse: 'When a node outputs values in one range but the next node expects a different range, or to invert values, or scale effects.',
    parameters: [
      { name: 'inMin/inMax', description: 'The expected input range' },
      { name: 'outMin/outMax', description: 'The desired output range' },
    ],
    tips: [
      'Remap(0,1, -1,1) to center a 0-1 value around zero',
      'Remap(0,1, 1,0) to invert a value (flip it)',
      'Great for adjusting noise output to match effect parameters',
    ],
    example: 'Noise(0-1) → Remap(-0.5, 0.5) = centered displacement',
  },

  // ============================
  // NEW COLOR & LIGHTING NODES
  // ============================
  {
    type: 'colorBlend',
    name: 'Color Blend',
    category: 'Color',
    whatItDoes: 'Blends two colors using advanced Photoshop-style modes: multiply, screen, overlay, dodge, burn, difference.',
    howItWorks: 'Each blend mode has a different formula for combining colors. Multiply darkens, Screen lightens, Overlay adds contrast, Dodge/Burn push extremes, Difference creates psychedelic inversions.',
    whenToUse: 'For compositing layers, creating texture overlays, color grading, or artistic color combinations beyond simple mixing.',
    parameters: [
      { name: 'blendMode', description: '0=multiply, 1=screen, 2=overlay, 3=dodge, 4=burn, 5=difference, 6=exclusion' },
      { name: 'opacity', description: 'How strong the blend is (0=base only, 1=full blend)' },
    ],
    tips: [
      'Multiply = shadows/darkening (like stacking colored glass)',
      'Screen = lights/brightening (like projecting two lights)',
      'Overlay = contrast boost (darkens darks, brightens brights)',
      'Use noise as blend layer for organic texturing',
    ],
    example: 'Photo + Noise (Overlay mode) = grungy textured photo',
  },
  {
    type: 'colorCorrect',
    name: 'Color Correction',
    category: 'Color',
    whatItDoes: 'Adjusts brightness, contrast, saturation, hue, gamma, and exposure of colors — like photo editing controls.',
    howItWorks: 'Brightness adds/subtracts from all channels. Contrast stretches/compresses the range. Saturation boosts/kills color intensity. Hue shifts rotates the color wheel. Gamma adjusts midtones.',
    whenToUse: 'For color grading your shader output, matching a brand palette, creating moods (warm/cool/vibrant/muted), or fixing washed-out colors.',
    parameters: [
      { name: 'brightness', description: 'Lighten or darken (-1 to 1)' },
      { name: 'contrast', description: 'Punch or flatten (0=flat gray, 1=normal, 3=extreme)' },
      { name: 'saturation', description: 'Color intensity (0=grayscale, 1=normal, 3=vivid)' },
      { name: 'hueShift', description: 'Rotate all colors around the color wheel (0-6.28 = full rotation)' },
      { name: 'gamma', description: 'Midtone adjustment (< 1=brighter mids, > 1=darker mids)' },
      { name: 'exposure', description: 'Overall light level in stops (-3 to +3)' },
    ],
    tips: [
      'Saturation 0 = instant grayscale conversion',
      'Hue shift animated with Time = rainbow color cycling',
      'Slight contrast boost (1.1-1.3) makes shaders pop',
      'Place at the end of your chain as a final "look" node',
    ],
    example: 'Any shader → Color Correct (warm, high contrast) = cinematic look',
  },
  {
    type: 'pbrLighting',
    name: 'PBR Lighting',
    category: 'Lighting',
    whatItDoes: 'Physically Based Rendering — realistic lighting that simulates how real materials look. Handles metal, plastic, glass, skin, etc.',
    howItWorks: 'Uses the Cook-Torrance BRDF model. Metallic controls if the surface is metal (reflects environment color) or non-metal (reflects white light). Roughness controls sharpness of reflections.',
    whenToUse: 'For realistic 3D materials: chrome, gold, plastic, ceramic, rubber, skin. When you want lighting that "just looks right" like modern game engines.',
    parameters: [
      { name: 'metallic', description: '0 = non-metal (plastic, wood), 1 = pure metal (gold, chrome)' },
      { name: 'roughness', description: '0 = mirror smooth, 0.5 = satin, 1 = completely rough/matte' },
      { name: 'albedo', description: 'Base color of the material' },
      { name: 'lightPos', description: 'Where the light source is' },
      { name: 'lightColor', description: 'Color of the light' },
      { name: 'ambientStrength', description: 'How much ambient (fill) light is present' },
    ],
    tips: [
      'Metallic 0 + Roughness 0.3 = shiny plastic',
      'Metallic 1 + Roughness 0.1 = polished chrome',
      'Metallic 1 + Roughness 0.7 = brushed metal',
      'Connect Mouse to light position for interactive lighting',
    ],
    example: 'Geometry → PBR(metallic=1, roughness=0.2) = polished gold sphere',
  },
  {
    type: 'ambientOcclusion',
    name: 'Ambient Occlusion',
    category: 'Lighting',
    whatItDoes: 'Darkens crevices and corners where light can\'t easily reach. Makes 3D objects look more grounded and detailed.',
    howItWorks: 'Samples nearby pixels and checks how "enclosed" the current pixel is. Corners and crevices have less surrounding open space, so they get darker.',
    whenToUse: 'To add depth and realism to any 3D-lit scene. Makes objects look like they\'re sitting in real space with soft contact shadows.',
    parameters: [
      { name: 'intensity', description: 'How dark the occlusion shadows get' },
      { name: 'radius', description: 'How far to sample (larger = softer, wider shadows)' },
      { name: 'samples', description: 'Quality of the AO (more = smoother but slower)' },
    ],
    tips: [
      'Multiply AO with your final color for realistic shadows',
      'Subtle (intensity 0.3-0.7) looks most natural',
      'Use after PBR Lighting for complete realistic look',
    ],
    example: 'PBR Color × AO = realistically shadowed material',
  },
  {
    type: 'shadow',
    name: 'Shadow',
    category: 'Lighting',
    whatItDoes: 'Creates a drop shadow or soft shadow behind/below elements. Like CSS box-shadow but for shader shapes.',
    howItWorks: 'Takes the shape, offsets it in a direction, and makes it dark and blurry. The result is a shadow that gives depth and elevation.',
    whenToUse: 'For UI elements in shaders, floating text effects, or giving flat shapes the appearance of being elevated above a surface.',
    parameters: [
      { name: 'offset', description: 'Shadow direction and distance (x, y)' },
      { name: 'softness', description: 'How blurry/soft the shadow edge is' },
      { name: 'opacity', description: 'How dark the shadow is (0=invisible, 1=black)' },
      { name: 'color', description: 'Shadow color (usually dark/black)' },
    ],
    tips: [
      'Small offset + small softness = tight contact shadow',
      'Large offset + large softness = floating/elevated look',
      'Colored shadows (dark blue/purple) look more natural than pure black',
    ],
    example: 'SDF Shape + Shadow(offset, soft) = floating 3D button',
  },

  // ============================
  // NEW 3D / GEOMETRY NODES
  // ============================
  {
    type: 'geometry',
    name: 'Geometry',
    category: '3D',
    whatItDoes: 'Accesses the 3D shape properties of the surface: normals (which way it faces), tangents, and whether a face points toward or away from you.',
    howItWorks: 'Every 3D surface has a "normal" — an arrow pointing outward. This node gives you that data to use for lighting, fresnel, reflections. Tangent/Bitangent are the surface directions.',
    whenToUse: 'As the foundation for any 3D lighting or material effect. Connects to PBR, Fresnel, and Light nodes to tell them about the surface shape.',
    parameters: [
      { name: 'property', description: '0=all outputs, 1=normals only, 2=tangent frame' },
    ],
    tips: [
      'Connect Normal output to PBR/Light nodes',
      'Facing value = 1 when facing you, 0 at edges (like Fresnel)',
      'Tangent and Bitangent are needed for Normal Map calculations',
    ],
    example: 'Geometry → PBR Lighting = properly lit 3D surface',
  },
  {
    type: 'glbModel',
    name: '3D Model (GLB)',
    category: '3D',
    whatItDoes: 'Loads a 3D model file (GLB/GLTF format) and renders it in your shader. You can rotate, scale, and apply shader effects to it.',
    howItWorks: 'GLB is a standard 3D file format (used in games and web). This node loads the model geometry and provides its position, normals, and UVs for other nodes to shade.',
    whenToUse: 'When you want to apply custom shader effects to actual 3D models — product viewers, artistic 3D renders, or interactive 3D elements on websites.',
    parameters: [
      { name: 'scale', description: 'Size of the model (1 = original, 2 = double, 0.5 = half)' },
      { name: 'rotationY', description: 'Rotation around vertical axis (left/right spin)' },
      { name: 'rotationX', description: 'Rotation around horizontal axis (up/down tilt)' },
      { name: 'autoRotate', description: 'Auto-spin speed (0 = still, 1+ = rotating)' },
    ],
    tips: [
      'Upload .glb files in the Media panel',
      'Connect outputs to PBR Lighting for realistic materials',
      'Use autoRotate for product showcase turntables',
      'Apply custom shaders like holographic, wireframe, or toon',
    ],
    example: 'GLB Model → PBR + Fresnel = shiny spinning product',
  },
  {
    type: 'sdf',
    name: 'SDF Shape',
    category: '3D',
    whatItDoes: 'Creates perfect geometric shapes using math (no mesh/geometry needed): spheres, boxes, toruses, cylinders. Infinitely smooth at any zoom.',
    howItWorks: 'SDF (Signed Distance Field) calculates "how far is this pixel from the nearest surface?" Negative = inside, Positive = outside, Zero = on the surface. This creates perfectly smooth shapes from pure math.',
    whenToUse: 'For crisp geometric shapes, 2D/3D icons, combining shapes (union/subtract), or as input for Ray Marching (full 3D).',
    parameters: [
      { name: 'shape', description: '0=sphere/circle, 1=box/rectangle, 2=torus/ring, 3=cylinder' },
      { name: 'size', description: 'Size of the shape' },
      { name: 'position', description: 'Center position offset (x, y)' },
      { name: 'smoothness', description: 'Edge softness (0 = crisp, higher = gradient edge)' },
      { name: 'roundness', description: 'Corner rounding for box shapes' },
    ],
    tips: [
      'Combine SDFs with min() for union, max() for intersection',
      'Use smoothness for anti-aliased edges',
      'Animate position with sin(time) for bouncing shapes',
      'Feed into Glow for neon shape outlines',
    ],
    example: 'SDF (circle) + Glow = glowing orb',
  },
  {
    type: 'rayMarch',
    name: 'Ray Marching',
    category: '3D',
    whatItDoes: 'Renders true 3D scenes entirely in the fragment shader — no mesh needed. Can create complex 3D worlds from math alone.',
    howItWorks: 'Shoots a "ray" from the camera through each pixel, then steps forward along the ray until it hits something (the SDF surface). This is how Shadertoy creates those amazing 3D visuals.',
    whenToUse: 'For impressive 3D visuals without any geometry: abstract sculptures, infinite landscapes, fractal worlds, or smooth organic shapes.',
    parameters: [
      { name: 'maxSteps', description: 'Maximum steps per ray (64 typical, 128 for complex scenes)' },
      { name: 'maxDist', description: 'How far to look before giving up' },
      { name: 'surfaceDist', description: 'Precision of surface detection (lower = more precise)' },
      { name: 'camDist', description: 'Camera distance from origin' },
      { name: 'fov', description: 'Field of view (1 = normal, 0.5 = zoom in, 2 = wide angle)' },
    ],
    tips: [
      'Connect SDF shapes as the scene to march through',
      'More steps = more detail but slower',
      'Use with PBR Lighting for realistic 3D materials',
      'Combine multiple SDFs for complex scenes',
    ],
    example: 'SDF Sphere → Ray March → PBR Light = 3D lit sphere in pure shader',
  },

  // ============================
  // PARTICLE SIMULATION NODES
  // ============================
  {
    type: 'waterSim',
    name: 'Water Simulation',
    category: 'Simulation',
    whatItDoes: 'Simulates realistic water with waves, caustic light patterns, and foam. Like looking at a pool or ocean surface.',
    howItWorks: 'Layers multiple sine waves at different angles and speeds to create a convincing water surface. Adds caustics (light patterns at the bottom of a pool) and foam at wave peaks.',
    whenToUse: 'For water backgrounds, pool effects, ocean surfaces, rivers, or any liquid surface. Also great for underwater caustic lighting effects.',
    parameters: [
      { name: 'waveSpeed', description: 'How fast the waves move' },
      { name: 'waveScale', description: 'Size of the waves (low = big ocean swells, high = small ripples)' },
      { name: 'depth', description: 'How much depth color variation (deep blue vs shallow)' },
      { name: 'clarity', description: 'Water transparency / caustic visibility' },
      { name: 'foamAmount', description: 'How much white foam appears at wave peaks' },
      { name: 'deepColor/shallowColor', description: 'Colors for deep and shallow water' },
      { name: 'causticIntensity', description: 'Brightness of underwater light patterns' },
    ],
    tips: [
      'Low waveScale + slow speed = calm lake',
      'High waveScale + fast speed = stormy ocean',
      'High foam + high waves = crashing surf',
      'Caustics alone (no waves) = underwater light pattern',
    ],
    example: 'Water Sim (calm, blue) = serene pool background',
  },
  {
    type: 'fireSim',
    name: 'Fire Simulation',
    category: 'Simulation',
    whatItDoes: 'Creates realistic fire with flames, embers, and heat distortion. From candle flickers to raging infernos.',
    howItWorks: 'Uses turbulent noise that scrolls upward (heat rises!) with color gradient from white/yellow core through orange to red/black edges. Adds floating ember particles and heat shimmer.',
    whenToUse: 'For fire effects, torch animations, explosion aftermath, campfire scenes, or dramatic backgrounds. Also great for text-on-fire effects.',
    parameters: [
      { name: 'intensity', description: 'How bright and strong the fire is' },
      { name: 'turbulence', description: 'How chaotic/wild the flames are' },
      { name: 'speed', description: 'How fast the flames flicker and rise' },
      { name: 'height', description: 'How tall the flames reach (0.3=short, 0.9=tall)' },
      { name: 'coreColor/midColor/outerColor', description: 'Fire color gradient (center → edge)' },
      { name: 'emberCount', description: 'Number of floating ember particles' },
      { name: 'heatDistortion', description: 'How much the area above the fire shimmers' },
    ],
    tips: [
      'Low turbulence + low speed = candle flame',
      'High everything = inferno/explosion',
      'Change coreColor to blue/white for gas flame',
      'Green core + green mid = magical/toxic fire',
    ],
    example: 'Fire Sim (blue core, high turbulence) = magical blue fire',
  },
  {
    type: 'rockSim',
    name: 'Rock / Terrain',
    category: 'Simulation',
    whatItDoes: 'Generates realistic rock, stone, and terrain textures with erosion, cracks, and optional moss.',
    howItWorks: 'Layers FBM noise for the base shape, adds voronoi-based cracks, applies erosion (smoothing sharp features), and colors with layers based on height/angle.',
    whenToUse: 'For terrain textures, rock/cliff surfaces, stone walls, ground materials, planets, or any natural mineral surface.',
    parameters: [
      { name: 'scale', description: 'Zoom level of the rock detail' },
      { name: 'erosion', description: 'How worn/smooth the rock is (0=sharp, 1=very eroded)' },
      { name: 'layers', description: 'Detail layers (more = finer detail)' },
      { name: 'crackDensity', description: 'How many cracks in the rock surface' },
      { name: 'mossAmount', description: 'Green moss growing on top (0=none, 1=lots)' },
      { name: 'baseColor/darkColor/highlightColor', description: 'Rock coloring' },
    ],
    tips: [
      'Low erosion + high cracks = dry desert rock',
      'High erosion + moss = old forest boulder',
      'Use as height map with lighting for 3D-looking terrain',
      'Scale 1-3 = large cliff face, 10+ = close-up pebble texture',
    ],
    example: 'Rock (mossy, eroded) + PBR Light = realistic forest boulder',
  },
  {
    type: 'smokeSim',
    name: 'Smoke Simulation',
    category: 'Simulation',
    whatItDoes: 'Creates volumetric smoke, fog, or mist that flows and dissipates realistically.',
    howItWorks: 'Uses multiple layers of animated noise with upward drift and turbulence. Adds light scattering (smoke looks bright when backlit) and dissipation at edges.',
    whenToUse: 'For fog effects, smoke trails, atmospheric haze, steam, clouds, or any gaseous/volumetric effect.',
    parameters: [
      { name: 'density', description: 'How thick/opaque the smoke is' },
      { name: 'speed', description: 'How fast the smoke rises and moves' },
      { name: 'turbulence', description: 'How turbulent/swirly the smoke is' },
      { name: 'dissipation', description: 'How quickly the smoke fades at edges' },
      { name: 'color', description: 'Base smoke color (gray, white, colored)' },
      { name: 'lightColor/lightDir', description: 'Light scattering color and direction' },
    ],
    tips: [
      'Low density + low speed = subtle atmospheric fog',
      'High density + high turbulence = dramatic smoke cloud',
      'Use as alpha/mask to fade other effects',
      'Colored smoke (pink, purple) = magical/concert effects',
    ],
    example: 'Smoke (thin, slow) + scene = atmospheric fog overlay',
  },
  {
    type: 'sparksSim',
    name: 'Sparks / Electricity',
    category: 'Simulation',
    whatItDoes: 'Creates electric arcs, lightning bolts, sparks, and electrical effects with branching and glow.',
    howItWorks: 'Generates jagged lines using sine waves at different frequencies to simulate the zigzag path of electricity. Adds randomized jitter each frame for that crackling look, plus bloom/glow around the arcs.',
    whenToUse: 'For sci-fi interfaces, energy effects, lightning, Tesla coils, powered-up states, electrical hazards, or connecting energy between points.',
    parameters: [
      { name: 'branches', description: 'Number of lightning bolt branches' },
      { name: 'intensity', description: 'Brightness of the arcs' },
      { name: 'speed', description: 'How fast the bolts flicker/change' },
      { name: 'thickness', description: 'Width of each bolt' },
      { name: 'color/glowColor', description: 'Arc color and surrounding glow color' },
      { name: 'jitter', description: 'How much random jumping between frames (higher = more chaotic)' },
    ],
    tips: [
      'Blue/white = natural lightning',
      'Green = Matrix/sci-fi energy',
      'Purple = magical electricity',
      'Animate between two SDF shapes for "power connecting" effect',
    ],
    example: 'Sparks (blue, high jitter) + dark bg = crackling electricity',
  },
]

export default function DocsPanel({ onClose }: { onClose: () => void }) {
  const [selectedNode, setSelectedNode] = useState<NodeDoc | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [...new Set(nodeDocs.map((d) => d.category))]

  const filteredDocs = searchQuery
    ? nodeDocs.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nodeDocs

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-3xl bg-editor-panel border-l border-editor-accent flex overflow-hidden">
        {/* Node list */}
        <div className="w-56 border-r border-editor-accent flex flex-col overflow-hidden">
          <div className="p-3 border-b border-editor-accent flex items-center justify-between">
            <h2 className="text-sm font-bold text-editor-text">Node Docs</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 bg-editor-bg border border-editor-accent rounded text-xs text-editor-text placeholder-gray-500 focus:outline-none focus:border-editor-highlight"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {categories.map((cat) => {
              const catDocs = filteredDocs.filter((d) => d.category === cat)
              if (catDocs.length === 0) return null
              return (
                <div key={cat}>
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                    {cat}
                  </div>
                  {catDocs.map((doc) => {
                    const template = nodeTemplates.find((t) => t.type === doc.type)
                    return (
                      <button
                        key={doc.type}
                        onClick={() => setSelectedNode(doc)}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors flex items-center gap-2 ${
                          selectedNode?.type === doc.type
                            ? 'bg-editor-accent text-white'
                            : 'text-gray-300 hover:bg-editor-accent/30'
                        }`}
                      >
                        <div
                          className="w-2 h-2 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: template?.color || '#666' }}
                        />
                        {doc.name}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Doc content */}
        <div className="flex-1 overflow-y-auto">
          {selectedNode ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {selectedNode.category}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-editor-text">
                  {selectedNode.name}
                </h1>
              </div>

              {/* What it does */}
              <section>
                <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                  What It Does
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedNode.whatItDoes}
                </p>
              </section>

              {/* How it works */}
              <section>
                <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                  How It Works (Simple Explanation)
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedNode.howItWorks}
                </p>
              </section>

              {/* When to use */}
              <section>
                <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                  When To Use It
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedNode.whenToUse}
                </p>
              </section>

              {/* Parameters */}
              {selectedNode.parameters.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                    Parameters Explained
                  </h3>
                  <div className="space-y-2">
                    {selectedNode.parameters.map((p) => (
                      <div
                        key={p.name}
                        className="bg-editor-bg rounded-md p-3 border border-editor-accent"
                      >
                        <div className="text-xs font-semibold text-node-math mb-1">
                          {p.name}
                        </div>
                        <p className="text-[11px] text-gray-400">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tips */}
              <section>
                <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                  Pro Tips
                </h3>
                <ul className="space-y-1.5">
                  {selectedNode.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-editor-highlight text-xs mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Example */}
              <section>
                <h3 className="text-xs font-semibold text-editor-highlight mb-2">
                  Quick Example
                </h3>
                <div className="bg-editor-bg rounded-md p-3 border border-editor-accent font-mono text-xs text-node-texture">
                  {selectedNode.example}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Node Documentation
                </h3>
                <p className="text-xs text-gray-500">
                  Select a node from the list to learn what it does, how it works,
                  and when to use it. Every explanation is in simple, non-technical language.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
