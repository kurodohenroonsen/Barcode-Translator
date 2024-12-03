## Inspiration

## What it does

## How we built it

## Challenges we ran into

## Accomplishments that we're proud of

## What we learned

## What's next for Barcode Translator Extension GeminiNano, Tool for BaTra
Barcode Translator Extension GeminiNano: Tool for BaTra
Inspiration

Inspired by Saint Isidore of Seville, the patron saint of the internet, this project envisions an encyclopedic platform where barcodes (GTINs) serve as keys to universal product knowledge. Leveraging Google Chrome’s built-in AI model Gemini Nano, we aim to create a tool that efficiently connects consumers with meaningful data, reducing redundant local processing by publishing results on Archive.org.
What It Does

    Barcode Scanning: Identifies products via GTIN.
    Data Retrieval: Looks for product information in databases or online via Google Chrome’s Prompt API.
    Knowledge Sharing: Publishes costly-to-generate results (inputs, prompts, and outputs) on Archive.org for global reuse.
    Text-to-Speech (TTS): Ensures accessibility for visually impaired users.
    Multilingual Support: Translates results into multiple languages.

How We Built It
APIs Utilized:

    Prompt API (required):
        Enables interaction with Gemini Nano to retrieve product data, structure responses, and summarize information.
        Used for dynamic user queries (e.g., “What are the product benefits?”).
    Rewrite API:
        Refines and optimizes data outputs to ensure clarity and TTS-friendliness.
    Summarization API:
        Extracts concise, meaningful summaries from extensive product data for user-friendly responses.

Stack:

    Google Chrome Extension Framework: Ensures seamless integration.
    Gemini Nano Integration: Powers intelligent data extraction.
    HTML, CSS, JavaScript: Provides a lightweight, intuitive user interface.
    Archive.org API: Stores generated data for global access.

Challenges We Ran Into

    Balancing API Usage: Ensuring compliance with contest requirements while maintaining efficiency.
    Data Integrity: Avoiding inaccurate outputs when relying on AI-generated information.
    Energy Optimization: Publishing data to Archive.org minimizes repeated costly local computations.

Accomplishments That We’re Proud Of

    Successfully integrating Gemini Nano APIs to enhance user experience.
    Building a sustainable knowledge-sharing system through Archive.org.
    Providing accessible, multilingual TTS responses for inclusivity.
    Bridging the gap between raw product data and consumer needs.

What We Learned

    Prompt Design Matters: Crafting precise prompts significantly improves AI output quality.
    Collaboration Potential: Sharing locally generated results globally reduces resource consumption.
    Accessibility Is Key: TTS and multilingual support ensure the tool is usable for diverse audiences.

What’s Next for Barcode Translator Extension GeminiNano

    Improved AI Interaction: Explore additional use cases for Rewrite API and Summarization API.
    Community Collaboration: Expand the repository of shared product data on Archive.org.
    Advanced Personalization: Enable user-defined prompts tailored to specific product categories.
    Mobile Version: Extend functionality to mobile browsers for on-the-go use.

Contest-Specific Adaptations
APIs Used:

    Prompt API: Core to Gemini Nano interaction, enabling user queries and dynamic responses.
    Rewrite API: Refines outputs to ensure readability and relevance.
    Summarization API: Distills key product insights into concise, digestible blocks.

APIs Not Used:

    Write API: Excluded as this project focuses on structured responses and summaries, not generative content.
    Hybrid AI (server-client): Deliberately avoided to prioritize full client-side functionality for privacy and simplicity.

Why Barcode Translator Stands Out

    Solves a real-world problem by bridging the gap between barcodes and meaningful product insights.
    Pushes innovation by integrating AI into a browser extension, aligning with Chrome’s native capabilities.
    Encourages global collaboration by sharing results on Archive.org, democratizing access to knowledge.

Repository Details

    Open Source: The code is hosted publicly with an MIT license.
    Setup Instructions: Includes a comprehensive guide for installation and testing.
    Languages: Supports English with translations into French, Spanish, and more.

“Barcode Translator Extension GeminiNano: Revolutionizing barcodes into encyclopedic keys for global collaboration.”