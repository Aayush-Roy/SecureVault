'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Plus, Search, LogOut } from 'lucide-react';
import VaultItem from '@/components/VaultItem';
import VaultForm from '@/components/VaultForm';
import { toast } from 'sonner';
import { encryptData, decryptData } from '@/lib/encryption';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function VaultPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [vaults, setVaults] = useState([]);
  const [filteredVaults, setFilteredVaults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVault, setEditingVault] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchVaults();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVaults(vaults);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vaults.filter(vault => {
        const title = vault.title.toLowerCase();
        const username = vault.username ? decryptData(vault.username).toLowerCase() : '';
        return title.includes(query) || username.includes(query);
      });
      setFilteredVaults(filtered);
    }
  }, [searchQuery, vaults]);

  const fetchVaults = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch vaults');
      }

      setVaults(data.vaults);
      setFilteredVaults(data.vaults);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVault = async (formData) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');

      const encryptedData = {
        title: formData.title,
        username: formData.username ? encryptData(formData.username) : '',
        password: encryptData(formData.password),
        url: formData.url,
        notes: formData.notes ? encryptData(formData.notes) : '',
      };

      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create vault entry');
      }

      toast.success('Vault entry created successfully');
      setFormOpen(false);
      fetchVaults();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateVault = async (formData) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');

      const encryptedData = {
        title: formData.title,
        username: formData.username ? encryptData(formData.username) : '',
        password: encryptData(formData.password),
        url: formData.url,
        notes: formData.notes ? encryptData(formData.notes) : '',
      };

      const res = await fetch(`/api/vault/${editingVault._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update vault entry');
      }

      toast.success('Vault entry updated successfully');
      setFormOpen(false);
      setEditingVault(null);
      fetchVaults();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVault = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/vault/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete vault entry');
      }

      toast.success('Vault entry deleted successfully');
      setDeleteId(null);
      fetchVaults();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (vault) => {
    setEditingVault({
      ...vault,
      username: vault.username ? decryptData(vault.username) : '',
      password: decryptData(vault.password),
      notes: vault.notes ? decryptData(vault.notes) : '',
    });
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingVault(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg">
                <KeyRound className="h-6 w-6 text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Secure Vault</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setFormOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Entry
          </Button>
        </div>

        {filteredVaults.length === 0 ? (
          <div className="text-center py-12">
            <KeyRound className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No vault entries yet</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No results found for your search' : 'Start by adding your first password'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Entry
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVaults.map((vault) => (
              <VaultItem
                key={vault._id}
                item={vault}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </main>

      <VaultForm
        isOpen={formOpen}
        onClose={handleFormClose}
        onSubmit={editingVault ? handleUpdateVault : handleAddVault}
        initialData={editingVault}
        loading={formLoading}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vault entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVault} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
