'use client';

import { useState } from 'react';
import { Copy, Share } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  TextInput,
} from '@noactionjaxn/another-react-tailwind-component-library';
import SocialIcon from '@/components/ui/SocialIcon';

interface ShareDialogProps {
  postUrl: string;
  postTitle: string;
}

const ShareDialog = ({ postUrl, postTitle }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const url = encodeURIComponent(postUrl);
  const title = encodeURIComponent(postTitle);
  const socialLinks = [
    { service: 'reddit', url: `https://www.reddit.com/submit?url=${url}&title=${title}` },
    { service: 'x', url: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { service: 'linkedin', url: `https://www.linkedin.com/shareArticle/?mini=true&url=${url}&title=${title}` },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share className="size-4" aria-hidden />
          Share Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this blog post</DialogTitle>
        </DialogHeader>
        <div className="mb-1 flex justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.service}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${social.service}`}
              className="inline-flex items-center justify-center rounded transition-opacity hover:opacity-70"
            >
              <SocialIcon service={social.service} size={32} alt="" className="size-8" />
            </a>
          ))}
        </div>
        <TextInput
          label="Link"
          labelPlacement="border"
          value={postUrl}
          readOnly
          block
          appendElement={
            <IconButton variant="ghost" size="sm" aria-label="Copy link" onClick={handleCopy}>
              <Copy aria-hidden />
            </IconButton>
          }
        />
        <p role="status" className="min-h-5 text-sm text-green-700">
          {copied ? 'Link copied to clipboard!' : ''}
        </p>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="soft">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
