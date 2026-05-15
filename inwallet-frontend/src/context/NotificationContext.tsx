import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketAlert {
    symbol: string;
    oldPrice: number;
    newPrice: number;
    changePercentage: number;
    timestamp: number;
}

interface NotificationContextType {
    alerts: MarketAlert[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<MarketAlert[]>([]);
    const [toast, setToast] = useState<MarketAlert | null>(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-alerts');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe('/topic/alerts', (message) => {
                    const alert: MarketAlert = JSON.parse(message.body);
                    setAlerts(prev => [alert, ...prev].slice(0, 50));
                    setToast(alert);
                    
                    // 10 saniye sonra tostu kaldır
                    setTimeout(() => setToast(null), 10000);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            }
        });

        client.activate();
        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ alerts }}>
            {children}
            
            {/* Real-time Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.5 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.5 }}
                        className="fixed bottom-10 right-10 z-[9999]"
                    >
                        <div className="glass-card" style={{ 
                            background: 'rgba(15, 23, 42, 0.9)', 
                            borderLeft: `4px solid ${toast.changePercentage > 0 ? '#10b981' : '#ef4444'}`,
                            padding: '16px 24px',
                            minWidth: '300px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(12px)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff' }}>{toast.symbol}</span>
                                <span style={{ 
                                    color: toast.changePercentage > 0 ? '#10b981' : '#ef4444', 
                                    fontWeight: 900,
                                    fontSize: '16px'
                                }}>
                                    {toast.changePercentage > 0 ? '▲' : '▼'} {Math.abs(toast.changePercentage).toFixed(2)}%
                                </span>
                            </div>
                            <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                                Fiyat {toast.changePercentage > 0 ? 'yükseldi' : 'düştü'}! 
                                <br />
                                Güncel: ₺{toast.newPrice.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};
