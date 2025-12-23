import React from 'react';

export const Loader = ({ text = "SYNCING" }: { text?: string }) => {
    return (
        <div className="loader">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="text">
                    <span>{text}</span>
                </div>
            ))}
            <div className="line" />
        </div>
    );
};
