'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PasswordGenerator({ onPasswordGenerated }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  });

  const generatePassword = () => {
    let charset = '';
    let excludeChars = '';

    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (options.excludeSimilar) {
      excludeChars = 'il1Lo0O';
    }

    if (charset === '') {
      toast.error('Please select at least one character type');
      return;
    }

    let finalCharset = charset.split('').filter(char => !excludeChars.includes(char)).join('');

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * finalCharset.length);
      generatedPassword += finalCharset[randomIndex];
    }

    setPassword(generatedPassword);
    if (onPasswordGenerated) {
      onPasswordGenerated(generatedPassword);
    }
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error('No password to copy');
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>Create a strong, random password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={password}
              readOnly
              placeholder="Generated password will appear here"
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!password}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password Length: {length}</Label>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={32}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Character Types</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={() => handleOptionChange('uppercase')}
                />
                <label htmlFor="uppercase" className="text-sm cursor-pointer">
                  Uppercase Letters (A-Z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={() => handleOptionChange('lowercase')}
                />
                <label htmlFor="lowercase" className="text-sm cursor-pointer">
                  Lowercase Letters (a-z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={() => handleOptionChange('numbers')}
                />
                <label htmlFor="numbers" className="text-sm cursor-pointer">
                  Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={() => handleOptionChange('symbols')}
                />
                <label htmlFor="symbols" className="text-sm cursor-pointer">
                  Symbols (!@#$%^&*)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeSimilar"
                  checked={options.excludeSimilar}
                  onCheckedChange={() => handleOptionChange('excludeSimilar')}
                />
                <label htmlFor="excludeSimilar" className="text-sm cursor-pointer">
                  Exclude Similar Characters (i, l, 1, L, o, 0, O)
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={generatePassword} className="w-full" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Password
        </Button>
      </CardContent>
    </Card>
  );
}
