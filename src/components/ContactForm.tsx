import { useForm, ValidationError } from '@formspree/react';

function ContactForm() {
  const [state, handleSubmit] = useForm("mpwzrepd");

  if (state.succeeded) {
    return <p className="text-center text-green-600 font-bold">Thanks for your message!</p>;
  }

  return (
    <section id ="contact" className="scroll-mt-20 max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <div className="bg-gray-100 rounded-lg p-6 my-12 shadow-md">
      <h2 className="text-4xl font-bold text-primary mb-6">Join the Movement</h2>
      <p className="mb-4 font-bold">We'd love to hear from you. Fill out the form below:</p>
      <form id="fs-frm" onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="First and Last"
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          />
          <ValidationError
            prefix="Name"
            field="name"
            errors={state.errors}
            className="text-red-500 text-sm"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="text-red-500 text-sm"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-500 text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state.submitting}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark"
        >
          Submit
        </button>
      </form>
      </div>
    </section>
  );
}

function App() {
  return <ContactForm />;
}

export default App;
