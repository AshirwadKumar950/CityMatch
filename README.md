# SmartRelocate – Intelligent Region Recommendation System

SmartRelocate is a full-stack web application that helps users find the best regions to live in based on their personal preferences and essential facilities such as hospitals, schools, gyms, supermarkets, and parks.

Instead of manually searching maps and comparing locations, SmartRelocate uses geospatial analysis and scoring algorithms to recommend the most suitable regions visually on an interactive map. :contentReference[oaicite:1]{index=1}

---

## Features

- Select any location or region on the map
- Choose preferred facilities (hospital, school, gym, park, etc.)
- Intelligent scoring of regions based on facility availability
- Interactive heatmap showing best regions
- Fast and responsive UI
- Real-time visualization using geospatial data
- User authentication and profile support

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Leaflet.js (interactive maps)

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Supabase

### Tools
- Git & GitHub
- VS Code
- npm

---

## System Architecture

The system consists of three main components: :contentReference[oaicite:2]{index=2}

1. Frontend (React + Leaflet)
   - Region selection
   - Facility preference input
   - Heatmap visualization

2. Backend (Node.js)
   - Grid generation for selected region
   - Spatial queries execution
   - Region scoring algorithm

3. Database (PostgreSQL via Supabase)
   - Stores facilities data
   - Provides spatial query support

Data Flow:

User → Frontend → Backend API → Database → Backend Scoring → Frontend Heatmap

---

## Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/AshirwadKumar950/CityMatch.git
cd CityMatch