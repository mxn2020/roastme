export interface RoastResult {
    roastText: string;
    hotTake: string;
    brutalRating: number;
    redFlagsIdentified: string[];
}

interface RoastCardProps {
    result: RoastResult;
    onTryAgain: () => void;
}

export default function RoastCard({ result, onTryAgain }: RoastCardProps) {
    return (
        <div className="result-container">
            <div className="result-card">
                {/* Header */}
                <div className="result-header">
                    <span className="fire-emoji">🔥</span>
                    <h2>You've Been Roasted</h2>
                </div>

                {/* Body */}
                <div className="result-body">
                    {/* Hot Take */}
                    <div className="hot-take">
                        "{result.hotTake}"
                    </div>

                    {/* Full Roast */}
                    <div className="roast-text">
                        {result.roastText}
                    </div>

                    {/* Brutal Rating */}
                    <div className="rating-section">
                        <div className="rating-label">Roastability Score</div>
                        <div className="rating-bar-track">
                            <div
                                className="rating-bar-fill"
                                style={{ width: `${(result.brutalRating / 10) * 100}%` }}
                            />
                        </div>
                        <div className="rating-value">
                            {result.brutalRating}<span>/10</span>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className="red-flags">
                        <div className="red-flags-title">🚩 Red Flags Identified</div>
                        <div className="red-flags-list">
                            {result.redFlagsIdentified.map((flag, i) => (
                                <span key={i} className="red-flag-chip">{flag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="result-actions">
                    <button className="btn-roast" onClick={onTryAgain}>
                        🔥 Roast Me Again
                    </button>
                </div>
            </div>
        </div>
    );
}
