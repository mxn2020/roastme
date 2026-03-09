import { useState, useCallback, useEffect } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../components/LoadingState';
import RoastCard, { type RoastResult } from '../components/RoastCard';

type AppState = 'upload' | 'loading' | 'result';

const LOADING_MESSAGES = [
    "Analyzing your face...",
    "Finding your weak spots...",
    "Crafting the perfect insult...",
    "Preparing maximum savagery...",
    "Searching for compliments... none found.",
    "Loading brutal mode...",
    "Calibrating cringe detector...",
    "Consulting the roast gods...",
];

export default function HomePage() {
    const [state, setState] = useState<AppState>('upload');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [result, setResult] = useState<RoastResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

    const generateRoast = useAction(api.ai.generateRoast);
    const saveRoast = useMutation(api.functions.saveRoast);

    // Rotate loading messages
    useEffect(() => {
        if (state !== 'loading') return;
        const interval = setInterval(() => {
            setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [state]);

    const handleImageSelect = useCallback((base64: string) => {
        setImageBase64(base64);
        setError(null);
    }, []);

    const handleClear = useCallback(() => {
        setImageBase64(null);
        setError(null);
    }, []);

    const handleRoast = useCallback(async () => {
        if (!imageBase64) return;

        setState('loading');
        setError(null);

        try {
            const roastResult = await generateRoast({ imageBase64 });

            const typedResult: RoastResult = {
                roastText: roastResult.roastText,
                hotTake: roastResult.hotTake,
                brutalRating: roastResult.brutalRating,
                redFlagsIdentified: roastResult.redFlagsIdentified,
            };

            setResult(typedResult);
            setState('result');

            // Save to DB in background
            await saveRoast({
                roastText: typedResult.roastText,
                hotTake: typedResult.hotTake,
                brutalRating: typedResult.brutalRating,
                redFlagsIdentified: typedResult.redFlagsIdentified,
            });
        } catch (err) {
            console.error('Roast failed:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Even the AI couldn\'t handle your photo.');
            setState('upload');
        }
    }, [imageBase64, generateRoast, saveRoast]);

    const handleTryAgain = useCallback(() => {
        setImageBase64(null);
        setResult(null);
        setError(null);
        setState('upload');
    }, []);

    if (state === 'loading') {
        return (
            <div className="main-content">
                <LoadingState messages={[LOADING_MESSAGES[loadingMsgIndex]]} />
            </div>
        );
    }

    if (state === 'result' && result) {
        return (
            <div className="main-content">
                <RoastCard result={result} onTryAgain={handleTryAgain} />
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="hero">
                <h1 className="hero-title">
                    Get <span className="fire">Roasted</span> by AI
                </h1>
                <p className="hero-subtitle">
                    Upload a selfie and let our merciless AI roast you into oblivion.
                    No feelings were spared in the making of this app.
                </p>

                <ImageUploader
                    onImageSelect={handleImageSelect}
                    preview={imageBase64}
                    onClear={handleClear}
                />

                {error && (
                    <p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </p>
                )}

                <button
                    className="btn-roast"
                    disabled={!imageBase64}
                    onClick={handleRoast}
                >
                    🔥 Roast Me
                </button>
            </div>
        </div>
    );
}
