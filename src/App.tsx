import  { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { EmailEditor } from './components/EmailEditor';
import { EmailList } from './components/EmailList';
import { EmailTemplate } from './types/email';
import toast from 'react-hot-toast';
import { FeaturesSection, Footer, HeroSection } from './components/Homeandfooter';

function App() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true); // Start loading indicator
    try {
      const response = await fetch('https://emailbuilder-backend.onrender.com/api/email-templates'); // Fetch templates from backend
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
  
      const data = await response.json(); // Parse the JSON response
      setTemplates(data || []); // Update the templates state
      toast.success('Templates loaded successfully');
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  
  const createNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      title: 'Untitled Template',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingTemplate(newTemplate);
  };

  const handleSaveTemplate = async (template: EmailTemplate) => {
    try {
      let response;
  
      if (template._id) {
        // Update existing template
        response = await fetch(`https://emailbuilder-backend.onrender.com/api/email-templates/${template._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template),
        });
      } else {
        // Create new template
        response = await fetch('https://emailbuilder-backend.onrender.com/api/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template),
        });
      }
  
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
  
      const data = await response.json();
  
      if (template._id) {
        // Update the template in the list
        setTemplates(templates.map((t) => (t._id === template._id ? data : t)));
        toast.success('Template updated successfully');
      } else {
        // Add the new template to the list
        setTemplates([data, ...templates]);
        // toast.success('Template created successfully');
      }
  
      setEditingTemplate(null);
      fetchTemplates(); // Refresh the list of templates
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }}  

  const handleDeleteTemplate = async (id: string) => {
    console.log('delete template', id);
    if (!confirm('Are you sure you want to delete this template?')) return;

  
    try {
      const response = await fetch(`https://emailbuilder-backend.onrender.com/api/email-templates/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
  
      setTemplates(templates.filter((t) => t._id !== id));
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (editingTemplate) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <EmailEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      {/* <Toaster position="top-right" /> */}
      <Toaster/>
      <HeroSection />
      <FeaturesSection />
      <div className="max-w-4xl p-12 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <button
            onClick={createNewTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            New Template
          </button>
        </div>

        <EmailList
          templates={templates}
          onEdit={setEditingTemplate}
          onDelete={handleDeleteTemplate}
        />
      </div>
      <Footer />
    </div>

  );
}

export default App;