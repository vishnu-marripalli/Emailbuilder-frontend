



// import React, { useState, useRef } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { HexColorPicker } from 'react-colorful';
// import { Trash2, Image as ImageIcon, Type, Settings, Download, Send } from 'lucide-react';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import { EmailSection, EmailTemplate } from '../types/email';
// // import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';
// import { useGoogleLogin } from '@react-oauth/google';

// interface EmailEditorProps {
//   template: EmailTemplate;
//   onSave: (template: EmailTemplate) => void;
// }

// export function EmailEditor({ template, onSave }: EmailEditorProps) {
//   const [sections, setSections] = useState<EmailSection[]>(template.sections);
//   const [title, setTitle] = useState(template.title);
//   const [editingStyles, setEditingStyles] = useState<string | null>(null);
//   const templateRef = useRef<HTMLDivElement>(null);

//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const items = Array.from(sections);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     setSections(items);
//   };

//   const addSection = (type: 'text' | 'image') => {
//     const newSection: EmailSection = {
//       id: crypto.randomUUID(),
//       type,
//       content: type === 'text' ? 'New text section' : '',
//       styles: {
//         color: '#000000',
//         fontSize: '16px',
//         textAlign: 'left',
//       },
//     };
//     setSections([...sections, newSection]);
//   };

//   const updateSection = (id: string, updates: Partial<EmailSection>) => {
//     setSections(sections.map(section => 
//       section.id === id ? { ...section, ...updates } : section
//     ));
//   };

//   const deleteSection = (id: string) => {
//     setSections(sections.filter(section => section.id !== id));
//   };


//   const handleImageUpload = async (id: string, file: File) => {
//         try {
//           const formData = new FormData();
//           formData.append('image', file);
      
//           const response = await fetch('http://localhost:5000/api/upload-image', {
//             method: 'POST',
//             body: formData,
//           });
      
//           if (!response.ok) {
//             throw new Error('Failed to upload image');
//           }
      
//           const { imageUrl } = await response.json();
      
//           // Update the section content with the uploaded image URL
//           updateSection(id, { content: imageUrl });
      
//           toast.success('Image uploaded successfully');
//         } catch (error) {
//           toast.error('Failed to upload image');
//           console.error('Error uploading image:', error);
//         }
//       };
      
    
//       const handleSave = async () => {
//         const updatedTemplate: EmailTemplate = {
//           ...template,
//           title,
//           sections,
//           updatedAt: new Date().toISOString(),
//         };
//         onSave(updatedTemplate);
//       };


//   const exportToPDF = async () => {
//     if (!templateRef.current) return;

//     try {
//       const canvas = await html2canvas(templateRef.current);
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'px',
//         format: [canvas.width, canvas.height]
//       });

//       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//       pdf.save(`${title}.pdf`);
//       toast.success('Template exported as PDF');
//     } catch (error) {
//       console.error('Error exporting PDF:', error);
//       toast.error('Failed to export PDF');
//     }
//   };

//   const login = useGoogleLogin({
//     onSuccess: async (response) => {
//       try {
//         const result = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${response.access_token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             raw: btoa(
//               `To: ${response.email}\r\n` +
//               `Subject: ${title}\r\n` +
//               'Content-Type: text/html; charset=utf-8\r\n\r\n' +
//               templateRef.current?.innerHTML
//             ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
//           })
//         });

//         if (!result.ok) throw new Error('Failed to send email');
//         toast.success('Template sent to Gmail');
//       } catch (error) {
//         console.error('Error sending to Gmail:', error);
//         toast.error('Failed to send to Gmail');
//       }
//     },
//     onError: () => {
//       toast.error('Gmail authentication failed');
//     },
//     scope: 'https://www.googleapis.com/auth/gmail.send',
//   });

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="mb-6">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
//           placeholder="Email Template Title"
//         />
//       </div>

//       <div className="mb-6 flex gap-4">
//         <button
//           onClick={() => addSection('text')}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           <Type size={20} />
//           Add Text
//         </button>
//         <button
//           onClick={() => addSection('image')}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//         >
//           <ImageIcon size={20} />
//           Add Image
//         </button>
//         <button
//           onClick={exportToPDF}
//           className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
//         >
//           <Download size={20} />
//           Export PDF
//         </button>
//         <button
//           onClick={() => login()}
//           className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//         >
//           <Send size={20} />
//           Send to Gmail
//         </button>
//       </div>

//       <div ref={templateRef}>
//         <DragDropContext onDragEnd={handleDragEnd}>
//           <Droppable droppableId="email-sections">
//             {(provided) => (
//               <div
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="space-y-4"
//               >
//                 {sections.map((section, index) => (
//                   <Draggable key={section.id} draggableId={section.id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         className="border rounded-lg p-4 bg-gray-50"
//                       >
//                         <div className="flex justify-between items-center mb-2">
//                           <div {...provided.dragHandleProps} className="flex items-center gap-2">
//                             <span className="text-gray-500">{section.type === 'text' ? 'Text Section' : 'Image Section'}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => setEditingStyles(section.id)}
//                               className="p-2 hover:bg-gray-200 rounded"
//                             >
//                               <Settings size={20} />
//                             </button>
//                             <button
//                               onClick={() => deleteSection(section.id)}
//                               className="p-2 hover:bg-red-100 text-red-500 rounded"
//                             >
//                               <Trash2 size={20} />
//                             </button>
//                           </div>
//                         </div>

//                         {editingStyles === section.id && section.type === 'text' && (
//                           <div className="mb-4 p-4 border rounded bg-white">
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Color</label>
//                                 <HexColorPicker
//                                   color={section.styles?.color || '#000000'}
//                                   onChange={(color) => updateSection(section.id, {
//                                     styles: { ...section.styles, color }
//                                   })}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Font Size</label>
//                                 <select
//                                   value={section.styles?.fontSize || '16px'}
//                                   onChange={(e) => updateSection(section.id, {
//                                     styles: { ...section.styles, fontSize: e.target.value }
//                                   })}
//                                   className="w-full border rounded p-2"
//                                 >
//                                   {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].map(size => (
//                                     <option key={size} value={size}>{size}</option>
//                                   ))}
//                                 </select>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {section.type === 'text' ? (
//                           <textarea
//                             value={section.content}
//                             onChange={(e) => updateSection(section.id, { content: e.target.value })}
//                             style={{
//                               color: section.styles?.color,
//                               fontSize: section.styles?.fontSize,
//                               textAlign: section.styles?.textAlign as any,
//                             }}
//                             className="w-full min-h-[100px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         ) : (
//                           <div className="space-y-2">
//                             {section.content ? (
//                               <img
//                                 src={section.content}
//                                 alt="Email section"
//                                 className="max-w-full h-auto rounded"
//                               />
//                             ) : (
//                               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   onChange={(e) => {
//                                     const file = e.target.files?.[0];
//                                     if (file) handleImageUpload(section.id, file);
//                                   }}
//                                   className="hidden"
//                                   id={`image-upload-${section.id}`}
//                                 />
//                                 <label
//                                   htmlFor={`image-upload-${section.id}`}
//                                   className="cursor-pointer text-gray-500 hover:text-gray-700"
//                                 >
//                                   <ImageIcon size={48} className="mx-auto mb-2" />
//                                   <span>Click to upload image</span>
//                                 </label>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>

//       <div className="mt-6">
//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           Save Template
//         </button>
//       </div>
//     </div>
//   );
// }













import  { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { HexColorPicker } from 'react-colorful';
import { 
  Trash2, Image as ImageIcon, Type, Settings, Download,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Eye,Menu,Send,
  Undo, Redo, Copy, Loader
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

import { useGmailSender } from '../lib/helper';

interface EmailSection {
  id: string;
  type: 'text' | 'image' | 'divider';
  content: string;
  styles: {
    color?: string;
    fontSize?: string;
    textAlign?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
  };
}

interface EmailTemplate {
  _id: string;
  title: string;
  sections: EmailSection[];
  updatedAt: string;
}

interface EmailEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
}

export function EmailEditor({ template, onSave }: EmailEditorProps) {
  const [sections, setSections] = useState<EmailSection[]>(template.sections);
  const [title, setTitle] = useState(template.title);
  const [editingStyles, setEditingStyles] = useState<string | null>(null);
  const [history, setHistory] = useState<EmailSection[][]>([template.sections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const [selectedPaper, setSelectedPaper] = useState('a4');
  // const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    if (JSON.stringify(sections) !== JSON.stringify(history[historyIndex])) {
      setHistory([...history, sections]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [sections]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const addSection = (type: 'text' | 'image' | 'divider') => {
    const newSection: EmailSection = {
      id: crypto.randomUUID(),
      type,
      content: type === 'text' ? 'New text section' : '',
      styles: {
        color: '#000000',
        fontSize: '16px',
        textAlign: 'left',
        padding: '1rem',
        margin: '0.5rem',
        backgroundColor: type === 'divider' ? '#e5e7eb' : 'transparent',
      },
    };
    setSections([...sections, newSection]);
  };

  const duplicateSection = (section: EmailSection) => {
    const newSection = {
      ...section,
      id: crypto.randomUUID(),
    };
    const index = sections.findIndex(s => s.id === section.id);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);
    setSections(newSections);
  };

  const updateSection = (id: string, updates: Partial<EmailSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const exportToPDF = async () => {
    if (!templateRef.current) return;
  
    setIsExporting(true);
  
    try {
      // Render the HTML element to a high-quality canvas
      const canvas = await html2canvas(templateRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true, // Ensures CORS compliance
        logging: false,
        backgroundColor: '#ffffff', // Ensures a white background
      });
  
      // Calculate PDF dimensions based on orientation and paper size
      const pdfWidth =  210 ; // A4 width in mm
      const pdfHeight = 297 ; // A4 height in mm
      const imgWidth = pdfWidth - 20 * 2; // Adding 20mm margin
      const imgHeight =( (canvas.height * imgWidth) / canvas.width);
      console.log(imgHeight)
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format:"a4", // A4 or other formats
      });
  
      // Add metadata to the PDF
      pdf.setProperties({
        title: title,
        creator: 'Email Template Editor',
      });
  
      // Add the title as a header
      pdf.setFontSize(16);
      pdf.text(title, 20, 20);
  
      // Embed the rendered canvas image into the PDF
      let currentHeight = 30; // Start below the title
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
      while (currentHeight < imgHeight + 30) {
        pdf.addImage(
          imgData,
          'JPEG',
          20,
          currentHeight,
          imgWidth,
          imgHeight        );
  
        // If the content exceeds the page, add a new page
        if (currentHeight + imgHeight >= pdfHeight - 20) {
          pdf.addPage();
          currentHeight = 20; // Reset to the top margin for the next page
        } else {
          break;
        }
      }
  
      // Add page numbers at the footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pdf.internal.pageSize.getWidth() - 40,
          pdf.internal.pageSize.getHeight() - 10
        );
      }
  
      // Save the PDF with a timestamped filename
      pdf.save(`${title}-${new Date().toISOString()}.pdf`);
  
      toast.success('Template exported as PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };
  // const getUserEmail = async (accessToken) => {
  //   const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   const data = await res.json();
  //   return data.email;  // Fetches the email from the profile endpoint
  // };
  
  // const login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     try {
  //       // Validate the access token
  //       const accessToken = response.access_token;
  //       if (!accessToken) throw new Error('Invalid access token');
  
  //       // Fetch email if not directly available in response
  //       const recipientEmail = response.email || await getUserEmail(accessToken);
  //       if (!recipientEmail) throw new Error('Recipient email is missing');
  
  //       console.log('Recipient Email:', recipientEmail);  // Debugging
  
  //  // Create the email body content
  //  const emailBody = [
  //   `To: ${recipientEmail}`,
  //   `Subject: ${title}`,  // Ensure `title` is defined and not empty
  //   'Content-Type: text/html; charset=utf-8\r\n\r\n',
  //   templateRef.current?.innerHTML || 'Default email content'  // Ensure templateRef is populated
  // ].join('\r\n');

  // // Encode the email body to base64
  // const encodedEmailBody = btoa(emailBody)
  //   .replace(/\+/g, '-')
  //   .replace(/\//g, '_')
  //   .replace(/=+$/, '');

  // // Send the email using Gmail API
  // const result = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ raw: encodedEmailBody }),
  // });

  //       const responseBody = await result.json();
  //       console.log('Gmail API response:', responseBody);

  //     if (!result.ok) {
  //       throw new Error(`Failed to send email: ${responseBody.error.message}`);
  //     }

  //       toast.success('Template sent to Gmail');
  //     } catch (error) {
  //       console.error('Error sending to Gmail:', error);
  //       toast.error('Failed to send to Gmail');
  //     }
  //   },
  //   onError: () => {
  //     toast.error('Gmail authentication failed');
  //   },
  //   scope: 'https://www.googleapis.com/auth/gmail.send',
  // });
  
  const { sendToGmail, isSending } = useGmailSender({
    title,
    templateRef,
    onSuccess: () => {
              // toast('Template sent to Gmail');

    },
    onError: () => {
      // Handle error
    }
  });
  
  const TextControls = ({ section }: { section: EmailSection }) => (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, fontWeight: section.styles.fontWeight === 'bold' ? 'normal' : 'bold' }
        })}
        className={`p-1 rounded ${section.styles.fontWeight === 'bold' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, fontStyle: section.styles.fontStyle === 'italic' ? 'normal' : 'italic' }
        })}
        className={`p-1 rounded ${section.styles.fontStyle === 'italic' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, textDecoration: section.styles.textDecoration === 'underline' ? 'none' : 'underline' }
        })}
        className={`p-1 rounded ${section.styles.textDecoration === 'underline' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <Underline size={16} />
      </button>
      <div className="border-l mx-2 hidden sm:block" />
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, textAlign: 'left' }
        })}
        className={`p-1 rounded ${section.styles.textAlign === 'left' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, textAlign: 'center' }
        })}
        className={`p-1 rounded ${section.styles.textAlign === 'center' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => updateSection(section.id, {
          styles: { ...section.styles, textAlign: 'right' }
        })}
        className={`p-1 rounded ${section.styles.textAlign === 'right' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      >
        <AlignRight size={16} />
      </button>
    </div>
  );

  return (
    <div className="w-full mx-auto p-2 sm:p-6 bg-white rounded-lg shadow-lg">
            <Toaster/>

      {/* Header Toolbar */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl sm:text-3xl font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full sm:w-auto"
          placeholder="Email Template Title"
        />
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded ${previewMode ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            title="Toggle Preview"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full px-4 py-2 bg-gray-100 rounded flex items-center justify-between"
        >
          <span>Actions</span>
          <Menu size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className={`mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 ${isMobileMenuOpen ? 'block' : 'hidden sm:flex'}`}>
        <button
          onClick={() => addSection('text')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Type size={20} />
          <span>Add Text</span>
        </button>
        <button
          onClick={() => addSection('image')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          <ImageIcon size={20} />
          <span>Add Image</span>
        </button>
        <button
          onClick={() => addSection('divider')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <span>—</span>
          <span>Add Divider</span>
        </button>
        <button
  onClick={() => sendToGmail()}
  disabled={isSending}
  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
>
  {isSending ? <Loader className="animate-spin" /> : null}
  Send to Gmail
</button>

        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors sm:ml-auto"
        >
          {isExporting ? <Loader className="animate-spin" /> : <Download size={20} />}
          <span>Export PDF</span>
        </button>
      </div>

      {/* Template Content */}
      <div 
        ref={templateRef}
        className={`${previewMode ? 'pointer-events-none' : ''} bg-white p-2 sm:p-8 border rounded-lg`}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="email-sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sections.map((section, index) => (
                  <Draggable 
                    key={section.id} 
                    draggableId={section.id} 
                    index={index}
                    isDragDisabled={previewMode}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${!previewMode ? 'border rounded-lg p-2 sm:p-4 bg-gray-50' : ''}`}
                        style={{
                          ...section.styles,
                          ...provided.draggableProps.style
                        }}
                      >
                        {!previewMode && (
                          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                            <div {...provided.dragHandleProps} className="flex items-center gap-2">
                              <span className="text-gray-500 text-sm sm:text-base">
                                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                              </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => duplicateSection(section)}
                                className="p-1 sm:p-2 hover:bg-gray-200 rounded"
                                title="Duplicate"
                              >
                                <Copy size={16} className="sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => setEditingStyles(section.id)}
                                className="p-1 sm:p-2 hover:bg-gray-200 rounded"
                                title="Style Settings"
                              >
                                <Settings size={16} className="sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => deleteSection(section.id)}
                                className="p-1 sm:p-2 hover:bg-red-100 text-red-500 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} className="sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {editingStyles === section.id && (
                          <div className="mb-4 p-2 sm:p-4 border rounded bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {section.type === 'text' && (
                                <>
                                  <TextControls section={section} />
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Color</label>
                                    <div className="w-full max-w-[200px]">
                                      <HexColorPicker
                                        color={section.styles?.color || '#000000'}
                                        onChange={(color) => updateSection(section.id, {
                                          styles: { ...section.styles, color }
                                        })}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Font Size</label>
                                    <select
                                      value={section.styles?.fontSize || '16px'}
                                      onChange={(e) => updateSection(section.id, {
                                        styles: { ...section.styles, fontSize: e.target.value }
                                      })}
                                      className="w-full border rounded p-2"
                                    >
                                      {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                      ))}
                                    </select>
                                  </div>
                                </>
                              )}
                              <div>
                                <label className="block text-sm font-medium mb-1">Background Color</label>
                                <div className="w-full max-w-[200px]">
                                  <HexColorPicker
                                    color={section.styles?.backgroundColor || 'transparent'}
                                    onChange={(color) => updateSection(section.id, {
                                      styles: { ...section.styles, backgroundColor: color }
                                    })}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Padding</label>
                                <select
                                  value={section.styles?.padding || '1rem'}
                                  onChange={(e) => updateSection(section.id, {
                                    styles: { ...section.styles, padding: e.target.value }
                                  })}
                                  className="w-full border rounded p-2"
                                >
                                  {['0', '0.5rem', '1rem', '1.5rem', '2rem'].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'text' && (
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            style={{
                              ...section.styles,
                              width: '100%',
                              minHeight: '100px',
                            }}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        {section.type === 'image' && (
                          <div className="space-y-2">
                            {section.content ? (
                              <div className="relative group">
                                <img
                                  src={section.content}
                                  alt="Email section"
                                  className="max-w-full h-auto rounded"
                                />
                               {!previewMode && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                      onClick={() => updateSection(section.id, { content: '' })}
                                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                                    >
                                      <Trash2 size={20} className="text-red-500" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        updateSection(section.id, { 
                                          content: event.target?.result as string 
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                  id={`image-upload-${section.id}`}
                                />
                                <label
                                  htmlFor={`image-upload-${section.id}`}
                                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                                >
                                  <ImageIcon size={36} className="mx-auto mb-2 sm:h-12 sm:w-12" />
                                  <span className="text-sm sm:text-base">Click to upload image</span>
                                </label>
                              </div>
                            )}
                          </div>
                        )}

                        {section.type === 'divider' && (
                          <hr className="border-t border-gray-300" />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => onSave({
            ...template,
            title,
            sections,
            updatedAt: new Date().toISOString(),
          })}
          className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save Template
        </button>
        
        <div className="text-xs sm:text-sm text-gray-500 w-full sm:w-auto text-center sm:text-right">
          Last saved: {new Date(template.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default EmailEditor;