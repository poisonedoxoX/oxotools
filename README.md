# Studio AI

editing and background removal.

Core Functionality:

Image Upload: A simple drag-and-drop zone to upload images.

AI Processing: Use the native 'Lovable AI' connector (Gemini 3 Flash and Nano Banana Pro) to perform tasks.

Background Removal: A dedicated button that identifies the subject and removes the background entirely.

AI Image Editing: A text input field where users can describe changes (e.g., 'Change the sky to a sunset' or 'Make this look like a professional studio portrait').

Preview & Download: A side-by-side view showing the original and the edited version, with a clear download button for the result.

Technical Requirements:

Use Gemini 3 Flash for analyzing the image and Nano Banana Pro for the generative editing/modifications.

Integrate this using Lovable AI shared connectors so no external API keys are required from the user.

Ensure the UI is 'realistic'—meaning it should feel like a premium, professional tool (think clean lines, subtle shadows, and a dark-mode-first aesthetic).

User Experience:

The interface must be dead-simple. No clutter. Just the image, a few action buttons, and a prompt box."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://oxotools.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/33781d71-41cd-49c0-8e20-db6e9aa8f2f0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
