export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Annapurna Tours and Travels
      </h1>
      <p className="text-xl mb-8">Your journey to the Himalayas begins here.</p>
      <a
        href="https://annapurna-travels.vercel.app"
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        Visit Our Site
      </a>
    </main>
  );
}
