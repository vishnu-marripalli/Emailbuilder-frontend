// // export interface EmailSection {
// //   id: string;
// //   type: 'text' | 'image';
// //   content: string;
// //   styles?: {
// //     color?: string;
// //     fontSize?: string;
// //     textAlign?: 'left' | 'center' | 'right';
// //   };
// // }

// export interface EmailTemplate {
//   _id?: string;
//   title: string;
//   sections: EmailSection[];
//   createdAt?: string;
//   updatedAt?: string;
// }


export interface EmailSection {
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

export interface EmailTemplate {
  _id: string;
  title: string;
  sections: EmailSection[];
  updatedAt: string;
}

// interface EmailEditorProps {
//   template: EmailTemplate;
//   onSave: (template: EmailTemplate) => void;
// }