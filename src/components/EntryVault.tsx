import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { useRouter } from 'next/router'; // Exemplo para navegacao

export const EntryVault: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
    const [designerId, setDesignerId] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Auth Flow logic
        if (designerId === 'ARKANA' || designerId === 'ADMIN') { // Exemplo de success
            setHasError(false);
            if (onSuccess) {
                onSuccess();
            } else {
                window.location.href = '/library';
            }
        } else {
            setHasError(true);
            // Resetar estado de erro após a animação
            setTimeout(() => setHasError(false), 500);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: "Public Sans, sans-serif"
        }}>
            <motion.form
                onSubmit={handleSubmit}
                animate={hasError ? { x: [-5, 5, -5, 0] } : {}}
                transition={{ duration: 0.4 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px'
                }}
            >
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '20px' }}>Entry Vault</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: '12px', color: '#4D4D4D' }}>
                        DESIGNER ID
                    </label>
                    <input
                        type="text"
                        value={designerId}
                        onChange={(e) => setDesignerId(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type your ID"
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: isFocused ? '#121212' : '#000000',
                            border: isFocused ? '0.5px solid #FFFFFF' : '0.5px solid #1A1A1A',
                            color: '#FFFFFF',
                            fontFamily: "IBM Plex Mono, monospace",
                            outline: 'none',
                            transition: 'all 0.3s ease',
                        }}
                    />
                </div>

                <motion.button
                    type="submit"
                    whileHover={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        letterSpacing: '2px'
                    }}
                    style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        border: '1px solid #FFFFFF',
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Authorize Entry
                </motion.button>
            </motion.form>
        </div>
    );
};
