'use client';

export const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageBody = `Name: ${data.name} \n Email: ${data.email} \n Query Type: ${data['query-type']} \n Subject: ${data.subject} \n Message: ${data.message}`;
    const mailtoLink = `mailto:info@webtimemachine.io?subject=${encodeURIComponent(
      data.subject as string,
    )}&body=${encodeURIComponent(messageBody)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <form id='contact-form' onSubmit={handleSubmit}>
      <div className='flex flex-wrap'>
        <div className='w-full md:w-6/12 px-2 pb-4'>
          <input
            type='text'
            className='w-full px-3 py-2 border rounded-lg'
            id='name'
            placeholder='Your Name'
            name='name'
          />
        </div>
        <div className='w-full md:w-6/12 px-2 pb-4'>
          <input
            type='email'
            className='w-full px-3 py-2 border rounded-lg'
            id='email'
            placeholder='Your Email'
            name='email'
          />
        </div>
        <div className='w-full px-2 pb-4'>
          <select
            id='query-type'
            className='w-full form-select px-3 py-2 border rounded-lg'
            name='query-type'
          >
            <option value=''>-- Please select an option --</option>
            <option value='Technical Support'>Technical Support</option>
            <option value='Delete Account Request'>
              Delete Account Request
            </option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='w-full px-2 pb-4'>
          <input
            type='text'
            className='w-full px-3 py-2 border rounded-lg'
            id='subject'
            placeholder='Subject'
            name='subject'
          />
        </div>
        <div className='w-full px-2 pb-4'>
          <textarea
            className='w-full px-3 py-2 border rounded-lg'
            placeholder='Leave a message here'
            id='message'
            name='message'
          ></textarea>
        </div>
        <div className='w-full text-center'>
          <button
            className='bg-gray-700 hover:bg-gray-500 text-white py-2 px-6 rounded-lg'
            id='submitButton'
            type='submit'
          >
            Send Message
          </button>
        </div>
      </div>
    </form>
  );
};
