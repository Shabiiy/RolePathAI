import type { Role, Resource, Badge } from '@/types'
import { Award, Star, Shield, Zap } from 'lucide-react'

export const ROLES: Role[] = [
  {
    title: 'Junior Data Engineer',
    description: 'Builds and maintains data pipelines and infrastructure.',
    skills: ['SQL', 'Python', 'ETL', 'Spark', 'Airflow', 'Cloud (AWS/GCP/Azure)'],
  },
  {
    title: 'Frontend Developer',
    description: 'Builds user interfaces and web applications.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Next.js', 'Webpack'],
  },
  {
    title: 'ML Engineer',
    description: 'Deploys and maintains machine learning models in production.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Docker', 'Kubernetes'],
  },
  {
    title: 'QA Engineer',
    description: 'Ensures software quality through manual and automated testing.',
    skills: ['Testing Methodologies', 'Selenium', 'Cypress', 'Jira', 'CI/CD'],
  },
  {
    title: 'Product Analyst',
    description: 'Analyzes data to provide insights for product decisions.',
    skills: ['SQL', 'Tableau', 'Power BI', 'Python (Pandas)', 'A/B Testing'],
  },
  {
    title: 'DevOps Engineer',
    description: 'Manages infrastructure, automation, and deployment pipelines.',
    skills: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins'],
  },
  {
    title: 'UX Designer',
    description: 'Designs user-friendly and intuitive digital products.',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
  },
]

export const RESOURCES: Resource[] = [
  {
    title: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'A non-profit organization that consists of an interactive learning web platform, an online community forum, chat rooms, online publications and local organizations that intend to make learning web development accessible to anyone.',
    tags: ['web development', 'javascript', 'python', 'data science'],
    level: 'Beginner',
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'The Mozilla Developer Network (MDN) provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
    tags: ['html', 'css', 'javascript', 'web apis'],
    level: 'Intermediate',
  },
  {
    title: 'Coursera - Machine Learning by Andrew Ng',
    url: 'https://www.coursera.org/learn/machine-learning',
    description: 'A foundational online course on machine learning taught by Stanford professor Andrew Ng.',
    tags: ['machine learning', 'ai', 'python'],
    level: 'Beginner',
  },
  {
    title: 'SQLZoo',
    url: 'https://sqlzoo.net/',
    description: 'Interactive SQL tutorials with online interpreters.',
    tags: ['sql', 'database', 'data analysis'],
    level: 'Beginner',
  },
  {
    title: 'The Odin Project',
    url: 'https://www.theodinproject.com/',
    description: 'A free open source coding curriculum that can be taken entirely online.',
    tags: ['full stack', 'web development', 'ruby', 'javascript'],
    level: 'Intermediate',
  },
  {
    title: 'Figma Learn',
    url: 'https://www.figma.com/learn/',
    description: 'Official tutorials and guides for learning Figma, a popular UX/UI design tool.',
    tags: ['ux', 'ui', 'design', 'figma'],
    level: 'Beginner',
  },
  {
    title: 'A-Frame - WebVR',
    url: 'https://aframe.io/',
    description: 'A web framework for building virtual reality experiences. Make WebVR with HTML and Entity-Component.',
    tags: ['vr', 'webvr', 'javascript', 'three.js'],
    level: 'Advanced',
  },
  {
    title: 'Docker Get Started',
    url: 'https://docs.docker.com/get-started/',
    description: 'Official documentation to get started with Docker containerization.',
    tags: ['docker', 'devops', 'containers'],
    level: 'Beginner',
  },
  {
    title: 'Kubernetes Basics',
    url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    description: 'Interactive tutorials to learn the basics of Kubernetes.',
    tags: ['kubernetes', 'devops', 'orchestration'],
    level: 'Intermediate',
  },
]

export const TASK_XP = 10;

export const BADGES: Badge[] = [
    { name: 'Novice', xpThreshold: 0, icon: Award, description: 'You\'ve started your journey!' },
    { name: 'Apprentice', xpThreshold: 100, icon: Star, description: 'Making great progress!' },
    { name: 'Journeyman', xpThreshold: 250, icon: Shield, description: 'You\'re a skilled practitioner!' },
    { name: 'Master', xpThreshold: 500, icon: Zap, description: 'You have mastered the path!' },
]
