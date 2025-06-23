
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Share2, User, Clock } from 'lucide-react';

interface ClipData {
  id: string;
  content_type: string;
  text_content?: string;
  file_name?: string;
  user_email?: string;
  code?: string;
  created_at: string;
}

interface AdminContentDisplayProps {
  recentClips: ClipData[];
  recentTempClips: ClipData[];
}

const AdminContentDisplay = ({ recentClips, recentTempClips }: AdminContentDisplayProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const ClipRow = ({ clip }: { clip: ClipData }) => (
    <TableRow>
      <TableCell className="max-w-xs">
        {clip.content_type === 'text' && clip.text_content ? (
          <div className="text-sm">
            <span className="text-muted-foreground">Text:</span>
            <p className="mt-1 p-2 bg-muted rounded text-xs font-mono">
              {clip.text_content}
              {clip.text_content.length >= 100 && '...'}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{clip.file_name || 'File'}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={clip.content_type === 'text' ? 'default' : 'secondary'}>
          {clip.content_type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-3 w-3" />
          <span className="text-sm">{clip.user_email || 'Anonymous'}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDate(clip.created_at)}
        </div>
      </TableCell>
    </TableRow>
  );

  const TempClipRow = ({ clip }: { clip: ClipData }) => (
    <TableRow>
      <TableCell className="max-w-xs">
        {clip.content_type === 'text' && clip.text_content ? (
          <div className="text-sm">
            <span className="text-muted-foreground">Text:</span>
            <p className="mt-1 p-2 bg-muted rounded text-xs font-mono">
              {clip.text_content}
              {clip.text_content.length >= 100 && '...'}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{clip.file_name || 'File'}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={clip.content_type === 'text' ? 'default' : 'secondary'}>
          {clip.content_type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Share2 className="h-3 w-3" />
          <span className="text-sm font-mono">{clip.code}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDate(clip.created_at)}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent User Clips
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentClips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClips.map((clip) => (
                  <ClipRow key={clip.id} clip={clip} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent clips</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Recent Quick Shares
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTempClips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Share Code</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTempClips.map((clip) => (
                  <TempClipRow key={clip.id} clip={clip} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent quick shares</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContentDisplay;
