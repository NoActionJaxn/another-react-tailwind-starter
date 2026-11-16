'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconButton,
} from '@noactionjaxn/another-react-tailwind-component-library';
import { debounce } from '@/lib/utils';
import { searchContent } from '@/lib/directus/fetchers';

type SearchResult = {
  id: string;
  title: string;
  description: string | null | undefined;
  type: string;
  link: string;
};

/**
 * Site search (⌘K / Ctrl+K): the library Dialog holding a cmdk command list,
 * since the library has no command palette of its own.
 */
export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setResults([]);
      setSearched(false);
      setLoading(false);
    }
  }, [open]);

  const fetchResults = async (search: string) => {
    if (search.length < 3) {
      setResults([]);
      setSearched(false);

      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchContent(search);
      setResults(data.filter((r) => r.link));
    } catch {
      setResults([]);
      throw new Error('Error fetching search results');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchResults = debounce(fetchResults, 300);

  const status = loading
    ? 'Loading...'
    : !searched
      ? 'Enter a search term above to see results'
      : results.length === 0
        ? 'No results found'
        : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <IconButton variant="ghost" aria-label="Search" onClick={() => setOpen(true)}>
        <Search aria-hidden />
      </IconButton>

      <DialogContent className="overflow-hidden p-0 sm:max-w-xl" showClose={false}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search for pages or posts</DialogDescription>

        {/* Results come from the server, so cmdk's own filtering is off. */}
        <Command shouldFilter={false} label="Search" className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-default-200 px-4">
            <Search className="size-5 shrink-0 text-default-500" aria-hidden />
            <Command.Input
              placeholder="Search for pages or posts"
              onValueChange={(value) => debouncedFetchResults(value)}
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-default-500"
            />
          </div>

          <Command.List className="max-h-[500px] overflow-y-auto p-2">
            {status && <p className="py-6 text-center text-sm text-default-500">{status}</p>}
            {!loading && results.length > 0 && (
              <Command.Group
                heading="Search Results"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-default-500"
              >
                {results.map((result) => (
                  <Command.Item
                    key={result.id}
                    value={result.id}
                    onSelect={() => (window.location.href = result.link)}
                    className="flex cursor-pointer items-start gap-4 rounded-lg px-2 py-3 data-[selected=true]:bg-default-100"
                  >
                    <Badge variant="soft">{result.type}</Badge>
                    <div className="w-full">
                      <p className="text-base font-medium">{result.title}</p>
                      {result.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-default-600">{result.description}</p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
