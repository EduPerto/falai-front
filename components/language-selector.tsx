'use client';

import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation, getLanguageName, getAvailableLanguages, type Language } from '@/lib/i18n';

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const languages = getAvailableLanguages();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {getLanguageName(lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
