interface LoadingStateProps {
    messages?: string[];
}

const DEFAULT_MESSAGES = [
    "Analyzing your face...",
    "Finding your weak spots...",
    "Crafting the perfect insult...",
    "Searching for compliments... none found.",
    "Loading savage mode...",
    "Calibrating brutality levels...",
];

export default function LoadingState({ messages = DEFAULT_MESSAGES }: LoadingStateProps) {
    // Rotate through messages
    const messageIndex = Math.floor((Date.now() / 2500) % messages.length);

    return (
        <div className="loading-overlay">
            <div className="loading-spinner" />
            <p className="loading-text">Roasting in progress...</p>
            <p className="loading-subtext">{messages[messageIndex]}</p>
        </div>
    );
}
