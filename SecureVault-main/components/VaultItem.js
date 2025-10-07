// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Copy, Eye, EyeOff, CreditCard as Edit, Trash2, ExternalLink } from 'lucide-react';
// import { toast } from 'sonner';
// import { decryptData } from '@/lib/encryption';

// export default function VaultItem({ item, onEdit, onDelete }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [decryptedPassword, setDecryptedPassword] = useState('');

//   useEffect(() => {
//     if (item.password) {
//       setDecryptedPassword(decryptData(item.password));
//     }
//   }, [item.password]);

//   const copyToClipboard = (text, label) => {
//     navigator.clipboard.writeText(text);
//     toast.success(`${label} copied to clipboard`);

//     setTimeout(() => {
//       navigator.clipboard.writeText('');
//     }, 15000);
//   };

//   const copyPassword = () => {
//     copyToClipboard(decryptedPassword, 'Password');
//   };

//   const copyUsername = () => {
//     const username = item.username ? decryptData(item.username) : '';
//     copyToClipboard(username, 'Username');
//   };

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <CardTitle className="text-lg">{item.title}</CardTitle>
//             {item.url && (
//               <a
//                 href={item.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
//               >
//                 {item.url}
//                 <ExternalLink className="h-3 w-3" />
//               </a>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onEdit(item)}
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onDelete(item._id)}
//             >
//               <Trash2 className="h-4 w-4 text-destructive" />
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {item.username && (
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-muted-foreground">Username</p>
//               <p className="text-sm font-medium truncate">{decryptData(item.username)}</p>
//             </div>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={copyUsername}
//             >
//               <Copy className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         <div className="flex items-center justify-between gap-2">
//           <div className="flex-1 min-w-0">
//             <p className="text-sm text-muted-foreground">Password</p>
//             <p className="text-sm font-mono font-medium truncate">
//               {showPassword ? decryptedPassword : '••••••••••••'}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={copyPassword}
//             >
//               <Copy className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {item.notes && (
//           <div>
//             <p className="text-sm text-muted-foreground">Notes</p>
//             <p className="text-sm mt-1">{decryptData(item.notes)}</p>
//           </div>
//         )}

//         <p className="text-xs text-muted-foreground">
//           Created: {new Date(item.createdAt).toLocaleDateString()}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, CreditCard as Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { decryptData } from '@/lib/encryption';

export default function VaultItem({ item, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState('');

  useEffect(() => {
    if (item.password) {
      setDecryptedPassword(decryptData(item.password));
    }
  }, [item.password]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);

    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 15000);
  };

  const copyPassword = () => {
    copyToClipboard(decryptedPassword, 'Password');
  };

  const copyUsername = () => {
    const username = item.username ? decryptData(item.username) : '';
    copyToClipboard(username, 'Username');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{item.title}</CardTitle>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 truncate"
              >
                {item.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item._id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {item.username && (
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="text-sm font-medium truncate">{decryptData(item.username)}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyUsername}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Password</p>
            <p className="text-sm font-mono font-medium truncate">
              {showPassword ? decryptedPassword : '••••••••••••'}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyPassword}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {item.notes && (
          <div className="break-words">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="text-sm mt-1">{decryptData(item.notes)}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
