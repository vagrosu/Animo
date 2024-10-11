# Animo: Web and Mobile Messaging App with AI Emotion Analysis

Animo is a cross platform messaging app designed to change online communication by integrating AI for emotion analysis. Its core features allow users to send messages, create group chats, and share selfies, with AI analyzing and displaying emotional states to improve understanding in conversations.

<div style="display: flex; align-items: center; justify-content: center;">
  <img src="./Media/youtube.svg" alt="YouTube Icon" style="width: 20px; height: 20px; margin-right: 8px;" />
  <span>Demo: <a href="https://youtu.be/P04D65B8hx4">Animo: Web and Mobile Messaging App with AI Emotion Analysis</a></span>
</div>

## Tech Stack

- Web: [React](https://react.dev), [Vite](https://vitejs.dev), [TypeScript](https://www.typescriptlang.org), [Tailwind](https://tailwindcss.com)
- Mobile: [React Native](https://reactnative.dev), [TypeScript](https://www.typescriptlang.org)
- Backend: [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
- Microservices: [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- AI Facial Emotion Analysis: [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/guide), [OpenCV](https://opencv.org/get-started/), [Scikit-learn](https://scikit-learn.org/stable/)

<div align="center">
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code>
	<code><img width="40" src="https://github-production-user-asset-6210df.s3.amazonaws.com/62091613/261395532-b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35.png" alt="Vite" title="Vite"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/></code>
	<code><img width="40" src="https://images-cdn.openxcell.com/wp-content/uploads/2024/07/25082439/reactnative-inner.svg" alt="React Native" title="React Native"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/121405754-b4f48f80-c95d-11eb-8893-fc325bde617f.png" alt=".NET Core" title=".NET Core"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/183423775-2276e25d-d43d-4e58-890b-edbc88e915f7.png" alt="Flask" title="Flask"/></code>
	<code><img width="40" src="https://viz.mediapipe.dev/logo.png" alt="MediaPipe" title="MediaPipe"/></code>
	<code><img width="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/OpenCV_Logo_with_text_svg_version.svg/1200px-OpenCV_Logo_with_text_svg_version.svg.png" alt="OpenCV" title="OpenCV"/></code>
</div>

## Pages

- **Landing:** A welcoming page that introduces users to Animo’s core features and provides access to login and registration.

  ![Landing Web](./Media/landing_web.png)
  ![Landing Mobile](./Media/landing_mobile.png)

- **Login:** Allows existing users to sign into their accounts.

  ![Login Web](./Media/login_web.png)
  ![Login Mobile](./Media/login_mobile.png)

- **Register:** Enables new users to create an account by providing essential details.

  ![Register Web](./Media/register_web.png)
  ![Register Mobile](./Media/register_mobile.png)

- **User Profile:** Displays user information such as name, username, phone number, email and selfie consent status.

  ![User Profile Web](./Media/user-profile_web.png)
  ![User Profile Mobile](./Media/user-profile_mobile.png)

- **Selfie Consent:** Asks users for consent to capture and analyze their selfies for emotion detection during chats.

  ![Selfie Consent Web](./Media/selfie-consent_web.png)
  ![Selfie Consent Mobile](./Media/selfie-consent_mobile.png)

- **Chats List:** Lists all ongoing and past chats, allowing users to quickly access their conversations. In the web version, the selected chat is also displayed with its messages and members

  ![Chats List Web](./Media/chats-list_web.png)
  ![Chats List Mobile](./Media/chats-list_mobile.png)

- **Chat:** A real-time messaging interface where AI-based emotional insights and reactions are displayed alongside messages.

  ![Chat](./Media/specific-chat.png)

- **Chat Members:** Shows the participants of the current chat.

  ![Chat Members](./Media/chat-members.png)

## Key Features

- **Create Chat:** Quickly create new group or individual chats by selecting users from a search list.

  ![Create Chat](./Media/create-chat.png)

- **Message Emotions:** Analyzes the emotion behind each message in real-time, using AI to display mood indicators like joy, anger, or surprise. This feature leverages the MoodScanner microservice to analyze facial emotions from user selfies and Rapid API for contextual emotion analysis based on message inputs.

  ![Message Emotions](./Media/message-emotions.png)

- **Message Reactions:** Users can react to messages with emojis in real time. A dedicated reactions list shows the emojis used and the users who reacted.

  ![Message Reactions](<./Media/message-reactions(edited).gif>)
  ![Message Reactions](./Media/message-reactions-list.png)

## App Logic

- **App Architecture:** An overview of the structure connecting the front-end and back-end components, detailing how messages and emotions are processed.

  ![App Architecture](./Media/animo_architecture.png)

- **API Architecture:** The API architecture is centered around the API Controller, which uses various backend services. Key components include SignalR Hubs for real-time communication, Emotions Controller for emotion analysis, and feature-specific services for managing chat rooms, messages, and user reactions.\
  ![App Architecture](./Media/backend_c4.png)

- **MoodScanner Microservice Architecture:** A specific microservice responsible for analyzing selfies to generate emotion data.

  ![App Architecture](./Media/moodscanner_c4.png)

- **Database Architecture:** The relational database schema that manages user profiles, chats, messages, and more.

  ![Database Architecture](./Media/database_design.png)

## Author

<div align="center">
  <a href="https://github.com/vagrosu"><img src="./Media/github.svg" alt="GitHub" style="width: 50px; height: 50px; margin-right: 8px; cursor: pointer"></a>
  <a href="https://www.linkedin.com/in/victorgrosu/"><img src="./Media/linkedin.svg" alt="LinkedIn" style="width: 50px; height: 50px; margin-right: 8px; cursor: pointer"></a>
</div>
