# **App Name**: RolePath AI

## Core Features:

- Personalized Roadmap Generation: Generates a tailored learning roadmap for a specified job role based on current skills, time commitment, and desired timeline, using LLM to create phases and topics.
- Editable Mermaid Mind-Map: Generates an editable Mermaid mind-map of the roadmap, with LLM-driven initial structure. Allows users to visualize and modify their learning path.
- Weekly Task Planner: Creates a weekly plan with tasks and estimated hours based on the roadmap. Helps users break down learning goals into manageable steps.
- Skill Checklist: Provides a checklist of skills to acquire, allowing users to track their progress and identify areas for improvement.
- Curated Resource Matching: Uses TensorFlow.js and Universal Sentence Encoder to match curated learning resources (URLs, descriptions, tags) to generated skills/topics, ranking resources by cosine similarity.
- Micro-Project Prompts: Generates micro-project prompts to provide hands-on practice and application of learned skills using an LLM as a tool.
- Gamified Progress Tracking: Implements a gamified system with XP and badges to motivate users and track their learning progress. Persists completed tasks in localStorage.
- Save, Load, Export and Import: Store the learning state in the localStorage and allows the learning path to be saved and loaded using local storage.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke professionalism, knowledge, and trust. It is versatile and suitable for various interfaces.
- Background color: Very light gray (#F5F5F5) to provide a clean and neutral backdrop, ensuring readability and focus on the content.
- Accent color: Purple (#9575CD), analogous to the primary color, adds a touch of sophistication and contrast for key UI elements like buttons and highlights.
- Body font: 'PT Sans' for readability in long passages; headline font: 'Space Grotesk' for headings
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clean, minimalist icons to represent different skills, resources, and progress milestones.
- Implement a tabbed interface for easy navigation between the dashboard, roadmap, resources, planner, and export/import functions.
- Use subtle animations to provide feedback and enhance the user experience, such as loading spinners or progress bar transitions.