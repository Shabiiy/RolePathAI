import type { RoadmapPhase } from '@/types';

export function parseRoadmap(roadmapText: string): RoadmapPhase[] {
  if (!roadmapText) return [];

  const phases: RoadmapPhase[] = [];
  const lines = roadmapText.split(/\r?\n/).filter(line => line.trim() !== '');
  let currentPhase: RoadmapPhase | null = null;

  // Regex to identify a line that is likely a phase header.
  // It looks for "Phase", a number, and a colon, but makes them all optional.
  // It prioritizes lines that are not just list items.
  const phaseRegex = /^(?!-)\s*(?:Phase\s*\d+\s*[:-]?)?\s*(.*?)(?:\s*\(([^)]+)\))?$/i;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if it's a topic item (starts with '-')
    if (trimmedLine.startsWith('-')) {
      if (currentPhase) {
        const topicTitle = trimmedLine.substring(1).trim();
        if (topicTitle) {
          currentPhase.topics.push({ title: topicTitle });
        }
      }
      // If we find a topic before any phase, create a default phase
      else {
        currentPhase = {
          title: "Learning Plan",
          weeks: "N/A",
          topics: [{ title: trimmedLine.substring(1).trim() }]
        }
      }
      continue;
    }

    // Check if it's a phase title
    const phaseMatch = trimmedLine.match(phaseRegex);
    if (phaseMatch && phaseMatch[1]) { // phaseMatch[1] contains the title text
       // If there's an existing phase, push it before starting a new one.
      if (currentPhase) {
        phases.push(currentPhase);
      }
      
      // Start a new phase
      currentPhase = {
        title: phaseMatch[1].trim(),
        weeks: phaseMatch[2] ? phaseMatch[2].trim() : 'N/A',
        topics: [],
      };
    }
  }

  // Don't forget to push the last phase being processed.
  if (currentPhase && (currentPhase.topics.length > 0 || phases.length === 0)) {
    phases.push(currentPhase);
  }

  // --- GUARANTEED FALLBACK ---
  // If, after all logic, we have no phases but there are lines of text,
  // it means the format was completely unrecognized. We create a single
  // phase and treat all non-empty lines starting with '-' as topics.
  if (phases.length === 0 && lines.length > 0) {
    const fallbackTopics = lines
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => ({ title: line.substring(1).trim() }))
      .filter(topic => topic.title); // Ensure we don't have empty topics

    if (fallbackTopics.length > 0) {
      return [{
        title: "Generated Learning Plan",
        weeks: "As specified",
        topics: fallbackTopics,
      }];
    }
     // If still no topics, create a single phase with the raw text
     return [{
        title: 'Full Roadmap',
        weeks: 'N/A',
        topics: lines.map(l => ({ title: l })),
     }]
  }

  return phases;
}


export function parseTopics(roadmapText: string): string[] {
    if (!roadmapText) return [];
    
    const lines = roadmapText.split('\n');
    const topics: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-')) {
            // Extract text after '-' and before any '(', removing extra whitespace
            const topicMatch = trimmedLine.substring(1).split('(')[0].trim();
            if (topicMatch) {
                topics.push(topicMatch);
            }
        }
    }
    
    return topics;
}
