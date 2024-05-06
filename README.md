# TripCraft

## Overview

We propose to develop a Travel Itinerary Planner web application which aims to simplify the process of planning and organizing trips for travelers. The main objective of this project is to provide users with a comprehensive platform where they can efficiently plan their travel itineraries, including selecting destinations, creating schedules, and share their travel itineraries to the public for reference or collaboration. The motivation behind building this project is to address the existing challenges faced by travelers in manually researching and organizing their trips, saving them time and effort.

## Background

Currently, there are multiple mobile applications and online services available for travel planning. However, many of them are lack of specific features or a user-friendly interface, making the planning process cumbersome and time-consuming. Since currently launched apps having better features or a more user-friendly interface requires users for monthly or annually subscription, in order to sustain app maintenance which needed cost and resources like manpower. Our proposed project aims to overcome these limitations and provide a more efficient, cost-free and user-centric travel itinerary planning experience. Our main goal is to build a website application that allow people to plan for their travel itineraries.

## Goals

There are 3 goals for this project:

- Responsive design: Provide user interface for users to use our application smoothly on either desktop, tablet, or mobile. The outlooks of the user interface differ by the device screen size.
- Simplify Travel Planning: Provide user-friendly and intuitive platform for users to plan for their itineraries. Users will be able to easily input their travel destinations and date and the application will then return related attractions and public holiday information and they can further add to their schedule.
- Encourage Community Engagement: Provide a way for users to share their travel itineraries to the general public. Other users will be able to gather some basic ideas during planning for their trips.

## Development

### Prerequisites

1. [asdf](https://asdf-vm.com)
2. [Docker](https://www.docker.com)

### Environment Setup

Under the project root directory, run the following command:

```bash
git submodule update --init --recursive
make vendor
make setup
```

### Running everything

Under the project root directory, run the following command:

```bash
docker compose up -d
```

After all containers have been created and started, run the following command:

```bash
make -C server upgrade-db
```

### Project architecture

- Database: PostgreSQL + Elasticsearch
- Backend: Python + FastAPI
- Frontend: TypeScript + ReactJS

## Credits

### Data used in this project

- [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)
