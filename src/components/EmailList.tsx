import  { useState, useMemo } from 'react';
import { 
  Mail, Edit, Trash2, Search, Filter, 
  ChevronUp, ChevronDown, Copy, 
  Archive, Download, AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface EmailTemplate {
  id: string;
  _id?: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
  sections: any[];
  isArchived?: boolean;
  tags?: string[];
}

interface EmailListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (template: EmailTemplate) => void;
  onArchive?: (id: string) => void;
  onExport?: (template: EmailTemplate) => void;
}

export function EmailList({ 
  templates, 
  onEdit, 
  onDelete,
  onDuplicate,
  onArchive,
  onExport 
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'title' | 'updatedAt'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);

  const handleSort = (field: 'title' | 'updatedAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTemplates = useMemo(() => {
    return templates
      .filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterArchived ? template.isArchived : !template.isArchived)
      )
      .sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'title') {
          return a.title.localeCompare(b.title) * modifier;
        }
        return (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) * modifier;
      });
  }, [templates, searchQuery, sortField, sortDirection, filterArchived]);

  const handleDeleteClick = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTemplate?._id) {
      onDelete(selectedTemplate._id);
    }
    setShowDeleteDialog(false);
    setSelectedTemplate(null);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setFilterArchived(!filterArchived)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            filterArchived ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
        >
          <Filter size={20} />
          {filterArchived ? 'Show Active' : 'Show Archived'}
        </button>
      </div>

      {/* Sort Headers */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg mb-2">
        <button
          onClick={() => handleSort('title')}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          Title
          {sortField === 'title' && (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
        <button
          onClick={() => handleSort('updatedAt')}
          className="flex items-center gap-1 hover:text-blue-600 ml-auto"
        >
          Last Updated
          {sortField === 'updatedAt' && (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="mx-auto mb-2" size={24} />
            <p>No templates found</p>
          </div>
        ) : (
          filteredAndSortedTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Mail className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">{template.title}</h3>
                    <p className="text-sm text-gray-500">
                      {getRelativeTime(template.updatedAt)}
                      {template.isArchived && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          Archived
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(template)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    title="Edit template"
                  >
                    <Edit size={18} />
                  </button>
                  {onDuplicate && (
                    <button
                      onClick={() => onDuplicate(template)}
                      className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                      title="Duplicate template"
                    >
                      <Copy size={18} />
                    </button>
                  )}
                  {onExport && (
                    <button
                      onClick={() => onExport(template)}
                      className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                      title="Export template"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  {onArchive && (
                    <button
                      onClick={() => onArchive(template.id)}
                      className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
                      title={template.isArchived ? "Unarchive template" : "Archive template"}
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(template)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                    title="Delete template"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTemplate?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EmailList;