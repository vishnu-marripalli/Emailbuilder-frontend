import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const convertImageToBase64 = async (imgUrl: string): Promise<string> => {
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const cleanHtmlForEmail = async (htmlContent: string): Promise<string> => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
  
    // Process images to ensure they work in email clients
    const images = tempDiv.getElementsByTagName('img');
    for (const img of Array.from(images)) {
      // Ensure images have proper dimensions
      if (img.style.width) {
        img.setAttribute('width', img.style.width);
      }
      if (img.style.height) {
        img.setAttribute('height', img.style.height);
      }
  
      // Convert relative URLs to absolute URLs if needed
      if (img.src.startsWith('/')) {
        img.src = window.location.origin + img.src;
      }
  
      // Inline image (convert image to base64 and set as src)
      try {
        const base64Image = await convertImageToBase64(img.src);
        img.setAttribute('src', base64Image);
      } catch (error) {
        console.error('Failed to convert image to Base64:', error);
      }
  
      // Add essential attributes for email client compatibility
      img.setAttribute('border', '0');
      img.setAttribute('style', 'display: block; max-width: 100%;');
    }
  
    return tempDiv.innerHTML;
  };
  

// Function to create MIME message with proper content encoding for images
const createMimeMessage = ({
    to,
    subject,
    htmlContent
  }: {
    to: string;
    subject: string;
    htmlContent: string;
  }): string => {
    const boundary = `boundary_${Math.random().toString(36).substring(2)}`;
    
    const message = [
      'MIME-Version: 1.0',
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: multipart/alternative; boundary=' + boundary,
      '',
      '--' + boundary,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: quoted-printable',  // Changed to quoted-printable for better handling of rich content
      '',
      htmlContent
        .replace(/=/g, '=3D')
        .replace(/\r\n|\r|\n/g, '\r\n'),
      '',
      '--' + boundary + '--'
    ].join('\r\n');
  
    return btoa(message)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
};

export const useGmailSender = ({ 
    title, 
    templateRef,
    onSuccess = () => {},
    onError = () => {}
  }: {
    title: string;
    templateRef: React.RefObject<HTMLDivElement>;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    const [isSending, setIsSending] = useState(false);
  
    const getUserEmail = async (accessToken: string): Promise<string> => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch user info');
      }
  
      const data = await res.json();
      if (!data.email) {
        throw new Error('Email not found in user info');
      }
  
      return data.email;
    };
  
    const login = useGoogleLogin({
      onSuccess: async (response) => {
        try {
          setIsSending(true);
  
          const accessToken = response.access_token;
          if (!accessToken) {
            throw new Error('Invalid access token');
          }
  
          // Fetch email
          const recipientEmail = await getUserEmail(accessToken);
          if (!recipientEmail) {
            throw new Error('Failed to get recipient email');
          }
  
          // Validate template content
          if (!templateRef.current) {
            throw new Error('Template content is missing');
          }
  
          // Clean and prepare HTML content (async)
          const cleanedHtml = await cleanHtmlForEmail(templateRef.current.innerHTML);
  
          // Create formatted email content
          const mimeMessage = createMimeMessage({
            to: recipientEmail,
            subject: title || 'Email Template',
            htmlContent: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                  ${cleanedHtml}
                </body>
              </html>
            `
          });
  
          // Send email using Gmail API
          const result = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw: mimeMessage }),
          });
  
          const responseData = await result.json();
  
          if (!result.ok) {
            throw new Error(responseData.error?.message || 'Failed to send email');
          }
  
          toast.success('Email sent successfully');
          onSuccess();
  
        } catch (error) {
          console.error('Error sending email:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to send email');
          onError();
        } finally {
          setIsSending(false);
        }
      },
      onError: (error) => {
        console.error('Google login error:', error);
        toast.error('Gmail authentication failed');
        onError();
      },
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
    });
  
    return {
      sendToGmail: login,
      isSending
    };
  };
  