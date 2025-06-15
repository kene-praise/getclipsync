
import { Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link to="/" className="flex items-center justify-center text-foreground hover:text-primary transition-colors">
          <Share2 className="text-primary mr-3 h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tighter">ClipSync</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
