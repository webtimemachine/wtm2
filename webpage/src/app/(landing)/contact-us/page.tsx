import { Metadata } from 'next';
import { Footer } from '../components/footer';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'WebTM | Contact Us',
  description:
    'Contact us for any questions, feedback, or concerns. We are here to help you.',
};

export default function ContactUsPage() {
  return (
    <div className='flex-grow flex items-center justify-center'>
      <div className='py-5 px-8 lg:px-20 flex flex-col items-center gap-6'>
        <h1 className='text-4xl font-semibold'>Contact Us</h1>
        <div className='flex justify-center'>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
