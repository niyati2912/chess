# Chess Game in React

## Overview

A modern chess application built using **React**, **JavaScript**, and **chess.js**. The project includes game logic, timers, themes, sounds, animations, move history, captured pieces, and support for playing against Stockfish AI.

---

# Technology Stack

* React
* JavaScript
* chess.js
* CSS
* Web Workers
* HTML5 Audio API
* Stockfish

---

# Features

## Chess Board

* 8×8 board
* Unicode chess pieces
* Legal move highlighting
* Selected square highlighting
* Capture highlighting
* Automatic pawn promotion to Queen
* Move validation through chess.js

---

## Game Modes

### Play vs Friend

Two-player local mode.

### Play vs AI

Human plays White.

Stockfish plays Black automatically.

---

## Chess Clock

Initial time:

```
10:00
```

Features:

* Active player's timer decreases.
* Timer pauses during game pause.
* Timer stops when game ends.
* Timers reset when starting a new game.
* Active player's clock is highlighted.

---

## Pause and Resume

Features:

* Pause button
* Resume button
* Board disabled during pause
* Timers stop during pause
* Status updates accordingly

---

## Move History

Moves are stored in SAN format.

Example:

```
1. e4      e5
2. Nf3     Nc6
3. Bb5     a6
```

Move history is displayed in a scrollable panel.

---

## Captured Pieces

Captured pieces are displayed separately.

### Above Board

Black pieces captured by White.

### Below Board

White pieces captured by Black.

---

## Themes

### Light Theme

Wood-inspired interface.

### Dark Theme

Modern dark interface.

Theme switching is implemented using CSS variables.

---

## Sound Effects

Generated using the Web Audio API.

### Move Sound

Played after normal moves.

### Capture Sound

Played after captures.

### Check Sound

Played when a king is in check.

### Game Over Sound

Played on:

* Checkmate
* Timeout

---

## Game Over Detection

### Checkmate

Detects checkmate and declares the winner.

### Stalemate

Recognizes stalemate positions.

### Draw

Handles draw conditions.

---

## Timeout Detection

If White reaches zero:

```
Time Out! Black Wins
```

If Black reaches zero:

```
Time Out! White Wins
```

Further moves are disabled.

---

## One-Minute Warning

When a player's clock reaches one minute:

* A popup appears.
* An animated king enters from the side.
* A speech bubble displays:

```
One Minute Left
```

The popup disappears automatically after five seconds.

Animations used:

* slideInLeft
* bubbleBounce

---

## Winner Popup

When the game ends:

* Dark overlay appears.
* Winner card is displayed.
* Winner message is shown.
* Animated queen enters.
* New Game button is provided.

---

## Confetti Animation

Confetti particles are generated dynamically.

Animation:

```css
@keyframes confettiFall
```

Triggered after victory.

---

## Stockfish AI

Implemented through a Web Worker.

Human:

```
White
```

AI:

```
Black
```

Flow:

```
Player Move
      ↓
AI Thinking
      ↓
Best Move Computed
      ↓
AI Move Executed
```

Stockfish commands:

```javascript
engine.postMessage(
    "position fen " + game.fen()
);

engine.postMessage(
    "go movetime 500"
);
```

---

## Background Image

Custom chess-themed wallpaper.

CSS properties:

```css
background-size: cover;
background-position: center;
```

A translucent overlay is added for readability.

---

# Styling

The interface uses:

### Box Shadows

```css
box-shadow
```

### Rounded Corners

```css
border-radius
```

### CSS Variables

Used for theme support.

### Animations

* slideInLeft
* slideInRight
* bubbleBounce
* popupScaleIn
* confettiFall
* fadeIn

---

# State Variables

```javascript
moveHistorySan

selectedSquare

legalMoves

whiteTime
blackTime

paused

theme

gameOverInfo

oneMinuteWarning

playAI

isThinking
```

---

# React Hooks Used

## useState

Manages game and UI state.

## useEffect

Handles:

* Timers
* Sounds
* Warnings
* Game over detection
* Stockfish communication

## useMemo

Optimizes:

* Chess object reconstruction
* Board generation
* Move history
* Captured pieces

## useRef

Stores:

* Warning flags
* Sound indices

---

# Folder Structure

```
src/
│
├── components/
│     Board.js
│     Square.js
│
├── chess.jfif
│
├── App.js
│
public/
│
├── stockfish-18-lite-single.js
├── stockfish-18-lite-single.wasm
│
package.json
```

---

# Future Improvements

## Additional Themes

* Wood
* Purple
* Pink
* Neon

## Drag-and-Drop Movement

Replace click-based movement.

## Multiplayer Support

Implement using Socket.io.

## User Accounts

Authentication and rating system.

## Opening Explorer

Display opening names.

## PGN Export

Allow downloading completed games.

## Undo Move

Move rollback functionality.

## Save and Load Games

Store and retrieve PGN/FEN.

---

# Learning Outcomes

This project provided practical experience with:

* React Hooks
* State management
* useEffect and useMemo
* chess.js
* Stockfish integration
* Web Workers
* CSS animations
* Web Audio API
* Game logic implementation
* Component-based architecture
* UI/UX design
* Performance optimization
* Debugging complex state interactions

---

# Author

**Niyati Aggarwal**

Built using React, chess.js, and Stockfish to create a complete and interactive chess experience.
