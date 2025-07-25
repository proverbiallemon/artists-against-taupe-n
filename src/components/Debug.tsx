import { useState, useEffect } from 'react';

function Debug() {
  const [debugInfo, setDebugInfo] = useState<{
    hasResendKey?: boolean;
    resendKeyLength?: number;
    resendKeyPrefix?: string;
    envKeys?: string[];
    [key: string]: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => {
        setDebugInfo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading debug info...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Quick Check:</h2>
        <ul className="list-disc pl-5">
          <li>RESEND_API_KEY present: {debugInfo?.hasResendKey ? '✅ Yes' : '❌ No'}</li>
          <li>Key length: {debugInfo?.resendKeyLength || 0} characters</li>
          <li>Key prefix: {debugInfo?.resendKeyPrefix}</li>
          <li>Total env vars: {debugInfo?.envKeys?.length || 0}</li>
        </ul>
      </div>
    </div>
  );
}

export default Debug;