
import { Share2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-center">
        <Share2 className="text-primary mr-3 h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tighter">ClipSync</h1>
      </div>
    </header>
  );
};

export default Header;
