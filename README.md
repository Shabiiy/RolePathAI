# RolePath AI

RolePath AI is a Next.js application that leverages generative AI to create personalized career development roadmaps. Users can input their target job role, current skills, and learning availability to receive a comprehensive, actionable plan to achieve their career goals.

![RolePath AI Screenshot](https://placehold.co/800x600?text=RolePath+AI+Screenshot)

## Features

- **Personalized Roadmap Generation**: AI-powered generation of learning phases and topics tailored to your career goals.
- **Interactive Mind Map**: Visualize your learning path with an editable Mermaid.js mind map.
- **Gamified Progress Tracking**: Earn XP for completing tasks and unlock badges to stay motivated.
- **Curated Resource Matching**: Discover relevant learning resources (articles, courses, tutorials) matched to your roadmap topics using AI.
- **Micro-Project Ideas**: Get practical, hands-on project prompts to solidify your skills.
- **Weekly Planner**: Break down your roadmap into a structured weekly schedule.
- **Data Portability**: Save your progress to your browser, export it as a JSON file, or share it with a simple snippet.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **AI/ML**: [Google AI](https://ai.google/) via [Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Hooks & `localStorage`
- **Diagramming**: [Mermaid.js](https://mermaid-js.github.io/mermaid/)

## Getting Started

To run this project locally, you'll need Node.js and a package manager (npm, yarn, or pnpm). You will also need a Google AI API key.

### 1. Set up your Environment

First, clone the repository:

```bash
git clone <repository_url>
cd <directory_name>
```

Next, install the dependencies:

```bash
npm install
```

### 2. Configure API Keys

This project uses Google AI for its generative features. You need to obtain an API key and configure it as an environment variable.

1.  **Get a Google AI API Key**: Visit the [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key.
2.  **Create an Environment File**: Create a `.env` file in the root of the project.
3.  **Add the API Key**: Add the following line to your `.env` file, replacing `<your_api_key>` with the key you obtained.

    ```
    GOOGLE_API_KEY=<your_api_key>
    ```

    The application is configured to use this environment variable for all AI-powered generations.

### 3. Run the Development Server

You can run the application in development mode with:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The Genkit flows can also be inspected and run separately using the Genkit developer UI:

```bash
npm run genkit:dev
```

This will start the Genkit development server, typically on [http://localhost:4000](http://localhost:4000).

## How it Works

### AI-Powered Generation

The core of RolePath AI is its ability to generate content using Google's Gemini models through Genkit flows defined in the `src/ai/flows/` directory.

- **`generatePersonalizedRoadmap`**: Takes the user's inputs (job role, skills, time) and prompts the LLM to create a structured learning roadmap.
- **`generateEditableMindMap`**: Converts the generated roadmap into valid Mermaid.js syntax for visualization.
- **`generateMicroProjectPrompts`**: Creates a list of small, practical project ideas based on the roadmap's topics.
- **`matchCuratedResources`**: Compares the skills and topics from the user's roadmap against a predefined list of learning resources to find the most relevant matches.

### Fallback Behavior

If the `GOOGLE_API_KEY` is not provided or an API call fails, the application gracefully handles the error. While it cannot generate a new roadmap, other features of the application (like importing an existing state) will still function. A user-friendly error message is displayed to inform the user of the issue.

### Data and State

The application state, including user inputs and all generated content, is stored in the browser's `localStorage`. This allows your progress to be automatically saved and restored between sessions.

The **Settings** tab provides options to:
- **Export**: Download your entire state as a `rolepath-ai-save.json` file.
- **Import**: Load a previously exported JSON file to restore your state.
- **Share**: Copy a Base64-encoded snippet of your state to the clipboard, which can be shared with others (who can then import it).

## Extending the Application

You can easily customize the available job roles and learning resources.

- **To add new job roles**: Edit the `ROLES` array in `src/lib/constants.ts`.
- **To add new learning resources**: Edit the `RESOURCES` array in `src/lib/constants.ts`. The resource matching AI will automatically consider any new additions.
