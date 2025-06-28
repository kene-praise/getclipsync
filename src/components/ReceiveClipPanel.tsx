
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useResponsive } from '@/hooks/useResponsive';

const ReceiveClipPanel = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const { isMobile } = useResponsive();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedCode = code.trim();
        if (trimmedCode.length === 0) {
            toast.error('Please enter a share code.');
            return;
        }
        navigate(`/share/${trimmedCode.toUpperCase()}`);
    };

    return (
        <Card className="animate-fade-in">
            <CardHeader className={isMobile ? "p-4" : "p-6"}>
                <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Receive Clip</CardTitle>
                <CardDescription className={isMobile ? "text-sm" : "text-base"}>
                    Enter a code to view a shared clip.
                </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "p-4 pt-0" : "p-6 pt-0"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="e.g. ABCXYZ"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className={`border-white/20 bg-background/20 placeholder:text-muted-foreground/80 text-center tracking-widest font-mono uppercase transition-all duration-200 focus:scale-105 ${
                            isMobile ? "text-base py-3" : "text-lg py-2"
                        }`}
                    />
                    <Button type="submit" className="w-full hover-scale">
                        <Search className="mr-2 h-4 w-4" />
                        Find Clip
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReceiveClipPanel;
