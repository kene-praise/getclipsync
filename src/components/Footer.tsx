import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
const Footer = () => {
  return <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="font-bold">ClipSync</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign Up
            </Link>
            
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 ClipSync. Made with ❤️ for secure sharing. Contact: <a href="mailto:praiseofumaduadike@gmail.com" className="text-primary hover:underline">praiseofumaduadike@gmail.com</a></p>
        </div>
      </div>
    </footer>;
};
export default Footer;