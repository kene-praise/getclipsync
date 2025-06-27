
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const ReceiveClipPanel = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

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
        <Card className="border border-white/20 bg-background/40 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Receive Clip</CardTitle>
                <CardDescription>Enter a code to view a shared clip.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="e.g. ABCXYZ"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="border-white/20 bg-background/20 placeholder:text-muted-foreground/80 text-center tracking-widest font-mono uppercase"
                    />
                    <Button type="submit" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Find Clip
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReceiveClipPanel;
