'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Mic, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatFlow } from '@/ai/flows/chat';
import { cn } from '@/lib/utils';
import { transcribeAudio } from '@/app/actions/speech';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatFlow({
                history: messages,
                message: userMessage.content,
            });

            setMessages((prev) => [...prev, { role: 'model', content: response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'model', content: 'Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMicClick = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    try {
                        setIsLoading(true);
                        const transcript = await transcribeAudio(base64Audio);
                        if (transcript) {
                            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
                        }
                    } catch (error) {
                        console.error('STT Error:', error);
                    } finally {
                        setIsLoading(false);
                        stream.getTracks().forEach(track => track.stop());
                    }
                };
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? 'auto' : '500px',
                            width: isMinimized ? '300px' : '350px'
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4"
                    >
                        <Card className="h-full flex flex-col shadow-xl border-primary/20 bg-background/95 backdrop-blur-sm">
                            <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-primary" />
                                    AI Assistant
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setIsMinimized(!isMinimized)}
                                    >
                                        {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {!isMinimized && (
                                <>
                                    <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                            <div className="space-y-4">
                                                {messages.length === 0 && (
                                                    <div className="text-center text-muted-foreground text-sm py-8">
                                                        <p>Hi! How can I help you today?</p>
                                                    </div>
                                                )}
                                                {messages.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "flex w-fit max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap",
                                                            msg.role === 'user'
                                                                ? "ml-auto bg-primary text-primary-foreground"
                                                                : "bg-muted"
                                                        )}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                ))}
                                                {isLoading && (
                                                    <div className="flex items-center gap-2 text-muted-foreground text-sm ml-2">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Thinking...
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>

                                        <div className="p-3 border-t bg-background">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSend();
                                                }}
                                                className="flex gap-2"
                                            >
                                                <Input
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder="Type a message..."
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant={isRecording ? "destructive" : "secondary"}
                                                    onClick={handleMicClick}
                                                    disabled={isLoading}
                                                >
                                                    <Mic className={cn("w-4 h-4", isRecording && "animate-pulse")} />
                                                </Button>
                                                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
